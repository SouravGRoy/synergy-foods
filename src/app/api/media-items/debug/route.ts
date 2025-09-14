import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { mediaItems } from "@/lib/db/schemas";
import { like } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get media items that might be problematic
        const problematicUrls = [
            'gBbqJgQfERoYtoMRHHQKkYSuU9QNMgdjezGZ6Xafv0i8A4JV',
            'gBbqJgQfERoYmVywHXOCwhLd6TbNV8I2Elq0mAnWyt3ukcpY',
            'gBbqJgQfERoY1e6EwyRbmvA2EhC5Qlc9qjRJfaS4UnLGzpZO'
        ];

        const allMedia = await db
            .select()
            .from(mediaItems)
            .orderBy(mediaItems.createdAt);

        const problematicMedia = allMedia.filter(media => 
            problematicUrls.some(url => media.url.includes(url))
        );

        return NextResponse.json({
            message: "Media items debug",
            totalCount: allMedia.length,
            problematicCount: problematicMedia.length,
            problematicMedia: problematicMedia,
            allMedia: allMedia.slice(0, 10) // First 10 for inspection
        });
    } catch (error) {
        console.error("Error fetching media items:", error);
        return NextResponse.json(
            { error: "Failed to fetch media items" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const problematicUrls = [
            'gBbqJgQfERoYtoMRHHQKkYSuU9QNMgdjezGZ6Xafv0i8A4JV',
            'gBbqJgQfERoYmVywHXOCwhLd6TbNV8I2Elq0mAnWyt3ukcpY',
            'gBbqJgQfERoY1e6EwyRbmvA2EhC5Qlc9qjRJfaS4UnLGzpZO'
        ];

        // Delete problematic media items
        for (const urlPart of problematicUrls) {
            await db
                .delete(mediaItems)
                .where(like(mediaItems.url, `%${urlPart}%`));
        }

        return NextResponse.json({
            message: "Problematic media items deleted"
        });
    } catch (error) {
        console.error("Error deleting media items:", error);
        return NextResponse.json(
            { error: "Failed to delete media items" },
            { status: 500 }
        );
    }
}
