import {
    bannerSchema,
    cachedBannerSchema,
    CreateBanner,
    UpdateBanner,
} from "@/lib/validations";
import { and, eq, ilike } from "drizzle-orm";
import { db } from "..";
import { banners } from "../schemas";

class BannerQuery {
    async count({ location }: { location?: string }) {
        const data = await db.$count(
            banners,
            location !== undefined ? eq(banners.location, location) : undefined
        );
        return +data || 0;
    }

    async scan({ location }: { location?: string }) {
        const data = await db.query.banners.findMany({
            where: (f, o) =>
                location !== undefined ? o.eq(f.location, location) : undefined,
        });

        const parsed = cachedBannerSchema.array().parse(data);
        return parsed;
    }

    async paginate({
        limit,
        page,
        search,
        location,
    }: {
        limit: number;
        page: number;
        search?: string;
        location?: string;
    }) {
        const data = await db.query.banners.findMany({
            where: (f, o) =>
                o.and(
                    location !== undefined
                        ? o.eq(f.location, location)
                        : undefined,
                    !!search?.length
                        ? o.ilike(f.title, `%${search}%`)
                        : undefined
                ),
            limit,
            offset: (page - 1) * limit,
            orderBy: (f, o) => [o.desc(f.createdAt)],
            extras: {
                count: db
                    .$count(
                        banners,
                        and(
                            location !== undefined
                                ? eq(banners.location, location)
                                : undefined,
                            !!search?.length
                                ? ilike(banners.title, `%${search}%`)
                                : undefined
                        )
                    )
                    .as("banners_count"),
            },
        });

        const items = +data?.[0]?.count || 0;
        const pages = Math.ceil(items / limit);

        const parsed = bannerSchema.array().parse(data);

        return {
            data: parsed,
            items,
            pages,
        };
    }

    async get(id: string) {
        const data = await db.query.banners.findFirst({
            where: (f, o) => o.eq(f.id, id),
        });
        if (!data) return null;

        return bannerSchema.parse(data);
    }

    async create(
        values: CreateBanner & {
            imageUrl: string;
        }
    ) {
        const data = await db
            .insert(banners)
            .values(values)
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async update(
        id: string,
        values: UpdateBanner & {
            imageUrl: string;
        }
    ) {
        const data = await db
            .update(banners)
            .set({
                ...values,
                updatedAt: new Date(),
            })
            .where(eq(banners.id, id))
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async delete(id: string) {
        const data = await db
            .delete(banners)
            .where(eq(banners.id, id))
            .returning()
            .then((res) => res[0]);

        return data;
    }
}

export const bannerQueries = new BannerQuery();