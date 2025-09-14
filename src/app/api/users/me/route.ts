import { ERROR_MESSAGES } from "@/config/const";
import { cache } from "@/lib/redis/methods";
import { AppError, CResponse, handleError } from "@/lib/utils";
import { ensureUserExists } from "@/lib/utils/user-sync";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId)
            throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");

        // Try to get user from cache first, if not found, sync with Clerk
        let user = await cache.user.get(userId);
        if (!user) {
            user = await ensureUserExists(userId);
        }

        if (!user)
            throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, "NOT_FOUND");

        return CResponse({ data: user });
    } catch (err) {
        return handleError(err);
    }
}
