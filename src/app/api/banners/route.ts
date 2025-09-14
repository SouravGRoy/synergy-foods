import { env } from "@/../env";
import {
    DEFAULT_PRODUCT_PAGINATION_LIMIT,
    DEFAULT_PRODUCT_PAGINATION_PAGE,
    ERROR_MESSAGES,
} from "@/config/const";
import { queries } from "@/lib/db/queries";
import { cache } from "@/lib/redis/methods";
import { AppError, CResponse, handleError } from "@/lib/utils";
import { createBannerSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = searchParams.get("limit")
            ? parseInt(searchParams.get("limit") as string)
            : DEFAULT_PRODUCT_PAGINATION_LIMIT;
        const page = searchParams.get("page")
            ? parseInt(searchParams.get("page") as string)
            : DEFAULT_PRODUCT_PAGINATION_PAGE;
        const search = searchParams.get("search") || undefined;
        const location = searchParams.get("location") || undefined;
        const isPaginated = searchParams.get("isPaginated") === "true";
        if (!isPaginated) {
            const data = await cache.banner.scan(location);
            return CResponse({ data });
        } else {
            const data = await queries.banner.paginate({
                page,
                limit,
                search,
                location,
            });
            return CResponse({ data });
        }
    } catch (err) {
        return handleError(err);
    }
}
export async function POST(req: NextRequest) {
    try {
        if (env.IS_API_AUTHENTICATED) {
            const { userId } = await auth();
            if (!userId)
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");
            const user = await cache.user.get(userId);
            if (!user || user.role === "user")
                throw new AppError(ERROR_MESSAGES.FORBIDDEN, "FORBIDDEN");
        }
        const body = await req.json();
        const parsed = createBannerSchema.parse(body);
        if (!parsed.imageUrl)
            throw new AppError("A banner image URL is required", "BAD_REQUEST");
        const data = await queries.banner.create({
            ...parsed,
            imageUrl: parsed.imageUrl,
        });
        return CResponse({ data });
    } catch (err) {
        return handleError(err);
    }
}
