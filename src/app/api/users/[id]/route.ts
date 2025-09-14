import { env } from "@/../env";
import { ERROR_MESSAGES, SITE_ROLES } from "@/config/const";
import { queries } from "@/lib/db/queries";
import { cache } from "@/lib/redis/methods";
import { AppError, CResponse, handleError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { z } from "zod";

const updateUserRoleSchema = z.object({
    role: z.enum(SITE_ROLES),
});

interface RouteProps {
    params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteProps) {
    try {
        // Authentication check
        if (env.IS_API_AUTHENTICATED) {
            const { userId } = await auth();
            if (!userId)
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");

            const user = await cache.user.get(userId);
            if (!user || user.role !== "admin")
                throw new AppError(ERROR_MESSAGES.FORBIDDEN, "FORBIDDEN");
        }

        const { id } = await params;
        const body = await req.json();
        
        const parsed = updateUserRoleSchema.parse(body);

        // Check if target user exists
        const targetUser = await cache.user.get(id);
        if (!targetUser)
            throw new AppError("User not found", "NOT_FOUND");

        // Get current user for self-demotion check
        const { userId: currentUserId } = await auth();
        const currentUser = currentUserId ? await cache.user.get(currentUserId) : null;
        
        // Prevent self-demotion from admin (only if currently admin)
        if (currentUserId === id && currentUser?.role === "admin" && parsed.role !== "admin") {
            throw new AppError(
                "Cannot demote yourself from admin role",
                "BAD_REQUEST"
            );
        }

        // Update user role in database
        const data = await queries.user.update(id, { 
            role: parsed.role,
            updatedAt: new Date()
        });

        // Invalidate user cache
        await cache.user.remove(id);

        // Also try to clear any potential cached data
        try {
            // Clear all user-related cache patterns
            await Promise.all([
                cache.user.remove(id),
                // If updating current user, also clear their cache
                currentUserId === id ? cache.user.remove(currentUserId) : Promise.resolve(),
            ]);
        } catch (cacheError) {
            console.warn("Cache clearing failed:", cacheError);
        }

        console.log("About to create response with data:", data);
        let response;
        try {
            response = CResponse({
                message: "OK",
                longMessage: "User role updated successfully. User will need to refresh their session.",
                data,
            });
            console.log("Response creation successful");
        } catch (responseError) {
            console.error("Response creation failed:", responseError);
            throw new AppError("Response creation failed", "INTERNAL_SERVER_ERROR");
        }

        // Add no-cache headers to prevent browser caching
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (err) {
        console.error("Error in PUT /api/users/[id]:", err);
        console.error("Error type:", typeof err);
        console.error("Error constructor:", err?.constructor?.name);
        if (err instanceof Error) {
            console.error("Error message:", err.message);
            console.error("Error stack:", err.stack);
        }
        return handleError(err);
    }
}

export async function GET(req: NextRequest, { params }: RouteProps) {
    try {
        if (env.IS_API_AUTHENTICATED) {
            const { userId } = await auth();
            if (!userId)
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");

            const user = await cache.user.get(userId);
            if (!user || user.role !== "admin")
                throw new AppError(ERROR_MESSAGES.FORBIDDEN, "FORBIDDEN");
        }

        const { id } = await params;
        const user = await cache.user.get(id);
        
        if (!user)
            throw new AppError("User not found", "NOT_FOUND");

        return CResponse({ data: user });
    } catch (err) {
        return handleError(err);
    }
}
