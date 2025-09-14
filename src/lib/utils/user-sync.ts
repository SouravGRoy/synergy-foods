import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schemas";
import { eq } from "drizzle-orm";
import { cache } from "@/lib/redis/methods";

/**
 * Ensures a user exists in the database by syncing with Clerk
 * This is a fallback for when webhooks fail or users are created outside the normal flow
 */
export async function ensureUserExists(userId: string) {
    try {
        // First check if user exists in our database
        const existingUser = await cache.user.get(userId);
        if (existingUser) {
            return existingUser;
        }

        // If not in database, get user from Clerk and sync
        const clerkUser = await currentUser();
        if (!clerkUser || clerkUser.id !== userId) {
            throw new Error("User not found in Clerk");
        }

        // Get primary email and phone
        const primaryEmail = clerkUser.emailAddresses.find(
            (email) => email.id === clerkUser.primaryEmailAddressId
        );
        const primaryPhone = clerkUser.phoneNumbers.find(
            (phone) => phone.id === clerkUser.primaryPhoneNumberId
        );

        if (!primaryEmail) {
            throw new Error("No primary email found");
        }

        // Create user in database
        const newUser = {
            id: clerkUser.id,
            firstName: clerkUser.firstName || "",
            lastName: clerkUser.lastName || "",
            email: primaryEmail.emailAddress,
            phone: primaryPhone?.phoneNumber || null,
            avatarUrl: clerkUser.imageUrl || null,
            isEmailVerified: primaryEmail.verification?.status === "verified",
            isPhoneVerified: primaryPhone?.verification?.status === "verified",
            role: "user" as const,
            createdAt: new Date(clerkUser.createdAt!),
            updatedAt: new Date(clerkUser.updatedAt!),
        };

        // Insert into database
        await db.insert(users).values(newUser);

        // Clear cache and return the user
        await cache.user.remove(userId);
        const syncedUser = await cache.user.get(userId);
        
        return syncedUser;
    } catch (error) {
        console.error("Failed to sync user:", error);
        throw error;
    }
}
