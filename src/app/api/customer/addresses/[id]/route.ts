import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schemas";
import { eq, and } from "drizzle-orm";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
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

        // Check if address belongs to user
        const existingAddress = await db
            .select()
            .from(addresses)
            .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
            .limit(1);

        if (existingAddress.length === 0) {
            return NextResponse.json(
                { error: "Address not found" },
                { status: 404 }
            );
        }

        // If this is set as primary, unset all other primary addresses
        if (isPrimary) {
            await db
                .update(addresses)
                .set({ isPrimary: false })
                .where(eq(addresses.userId, userId));
        }

        // Generate alias slug
        const aliasSlug = alias.toLowerCase().replace(/\s+/g, '-');

        const updatedAddress = await db
            .update(addresses)
            .set({
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
                updatedAt: new Date(),
            })
            .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
            .returning();

        return NextResponse.json({
            success: true,
            data: updatedAddress[0],
            message: "Address updated successfully"
        });

    } catch (error) {
        console.error("Error updating address:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Internal server error",
                message: "Failed to update address"
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Check if address belongs to user
        const existingAddress = await db
            .select()
            .from(addresses)
            .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
            .limit(1);

        if (existingAddress.length === 0) {
            return NextResponse.json(
                { error: "Address not found" },
                { status: 404 }
            );
        }

        await db
            .delete(addresses)
            .where(and(eq(addresses.id, id), eq(addresses.userId, userId)));

        return NextResponse.json({
            success: true,
            message: "Address deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting address:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Internal server error",
                message: "Failed to delete address"
            },
            { status: 500 }
        );
    }
}
