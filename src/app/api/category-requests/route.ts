import { ERROR_MESSAGES } from "@/config/const";
import { queries } from "@/lib/db/queries";
import { AppError, CResponse, handleError } from "@/lib/utils";
import { createCategoryRequestSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") as "pending" | "approved" | "rejected" | null;

        const data = await queries.categoryRequest.scan(status || undefined);
        return CResponse({ data });
    } catch (err) {
        return handleError(err);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId)
            throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");

        const body = await req.json();
        const parsed = createCategoryRequestSchema.parse(body);

        const data = await queries.categoryRequest.create({
            ...parsed,
            requesterId: userId,
        });

        return CResponse({ message: "CREATED", data });
    } catch (err) {
        return handleError(err);
    }
}