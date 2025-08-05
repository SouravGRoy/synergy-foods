import { env } from "@/../env";
import { ERROR_MESSAGES } from "@/config/const";
import { queries } from "@/lib/db/queries";
import { cache } from "@/lib/redis/methods";
import { AppError, CResponse, handleError } from "@/lib/utils";
import { updateCategoryRequestSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = await queries.categoryRequest.get(id);

        if (!data) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");
        }

        return CResponse({ data });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
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
        const body = await req.json();
        const parsed = updateCategoryRequestSchema.parse(body);

        const { userId } = await auth();
        const data = await queries.categoryRequest.update(id, {
            ...parsed,
            reviewerId: userId || undefined,
        });

        return CResponse({ message: "OK", data });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
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
        const data = await queries.categoryRequest.delete(id);

        return CResponse({ message: "OK", data });
    } catch (err) {
        return handleError(err);
    }
}