import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schemas";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userAddresses = await db
            .select()
            .from(addresses)
            .where(eq(addresses.userId, userId))
            .orderBy(desc(addresses.isPrimary), desc(addresses.createdAt));

        return NextResponse.json({
            success: true,
            data: userAddresses,
            message: "Addresses fetched successfully"
        });

    } catch (error) {
        console.error("Error in addresses API:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Internal server error",
                message: "Failed to fetch addresses"
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            alias,
            fullName,
            street,
            city,
            state,
            zip,
            phone,
            type,
            isPrimary
        } = body;

        // Generate alias slug
        const aliasSlug = alias.toLowerCase().replace(/\s+/g, '-');

        // If this is set as primary, unset all other primary addresses
        if (isPrimary) {
            await db
                .update(addresses)
                .set({ isPrimary: false })
                .where(eq(addresses.userId, userId));
        }

        const newAddress = await db
            .insert(addresses)
            .values({
                userId,
                alias,
                aliasSlug,
                fullName,
                street,
                city,
                state,
                zip,
                phone,
                type,
                isPrimary: isPrimary || false,
            })
            .returning();

        return NextResponse.json({
            success: true,
            data: newAddress[0],
            message: "Address created successfully"
        });

    } catch (error) {
        console.error("Error creating address:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Internal server error",
                message: "Failed to create address"
            },
            { status: 500 }
        );
    }
}
