import { env } from "@/../env";
import { ERROR_MESSAGES } from "@/config/const";
import { queries } from "@/lib/db/queries";
import { cache } from "@/lib/redis/methods";
import {
    AppError,
    CResponse,
    getUploadThingFileKey,
    handleError,
} from "@/lib/utils";
import { updateBannerSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { utApi } from "../../uploadthing/core";

interface RouteProps {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
    try {
        const { id } = await params;

        const data = await cache.banner.get(id);
        if (!data) throw new AppError(ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");

        return CResponse({ data });
    } catch (err) {
        return handleError(err);
    }
}

export async function PATCH(req: NextRequest, { params }: RouteProps) {
    try {
        const { id } = await params;

        if (env.IS_API_AUTHENTICATED) {
            const { userId } = await auth();
            if (!userId)
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");

            const user = await cache.user.get(userId);
            if (!user || user.role !== "admin")
                throw new AppError(ERROR_MESSAGES.FORBIDDEN, "FORBIDDEN");
        }

        const body = await req.json();
        const parsed = updateBannerSchema.parse(body);

        const existingData = await cache.banner.get(id);
        if (!existingData)
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");

        const existingImageUrl = existingData.imageUrl;
        if (existingImageUrl !== parsed.imageUrl) {
            const existingKey = getUploadThingFileKey(existingImageUrl);
            await utApi.deleteFiles([existingKey]);
        }

        const data = await Promise.all([
            queries.banner.update(id, {
                ...parsed,
                imageUrl: parsed.imageUrl || existingData.imageUrl,
            }),
            cache.banner.remove(id),
        ]);

        return CResponse({ data });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(_: NextRequest, { params }: RouteProps) {
    try {
        const { id } = await params;

        if (env.IS_API_AUTHENTICATED) {
            const { userId } = await auth();
            if (!userId)
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");

            const user = await cache.user.get(userId);
            if (!user || user.role !== "admin")
                throw new AppError(ERROR_MESSAGES.FORBIDDEN, "FORBIDDEN");
        }

        const existingData = await cache.banner.get(id);
        if (!existingData)
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND");

        const existingImageUrl = existingData.imageUrl;
        const existingKey = getUploadThingFileKey(existingImageUrl);
        await utApi.deleteFiles([existingKey]);

        await Promise.all([queries.banner.delete(id), cache.banner.remove(id)]);

        return CResponse();
    } catch (err) {
        return handleError(err);
    }
}