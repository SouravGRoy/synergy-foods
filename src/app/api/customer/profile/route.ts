import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const profile = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.primaryEmailAddress?.emailAddress,
            phone: user.primaryPhoneNumber?.phoneNumber,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
        };

        return NextResponse.json({
            success: true,
            data: profile,
            message: "Profile fetched successfully"
        });

    } catch (error) {
        console.error("Error in customer profile API:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Internal server error",
                message: "Failed to fetch profile"
            },
            { status: 500 }
        );
    }
}
