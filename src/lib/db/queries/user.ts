import { fullUserSchema } from "@/lib/validations/user";
import { eq, ilike } from "drizzle-orm";
import { db } from "..";
import { users } from "../schemas";

class UserQuery {
    async paginate({
        limit,
        page,
        search,
    }: {
        limit: number;
        page: number;
        search?: string;
    }) {
        const data = await db.query.users.findMany({
            where: (f, o) =>
                !!search?.length ? o.ilike(f.email, `%${search}%`) : undefined,
            with: { addresses: true },
            limit,
            offset: (page - 1) * limit,
            orderBy: (f, o) => o.desc(f.createdAt),
            extras: {
                count: db
                    .$count(
                        users,
                        !!search?.length
                            ? ilike(users.email, `%${search}%`)
                            : undefined
                    )
                    .as("users_count"),
            },
        });

        const items = +data?.[0]?.count || 0;
        const pages = Math.ceil(items / limit);

        const parsed = fullUserSchema.array().parse(data);

        return {
            data: parsed,
            items,
            pages,
        };
    }

  async get(id: string) {
        const data = await db.query.users.findFirst({
            where: (f, o) => o.eq(f.id, id),
            with: { addresses: true },
        });
        if (!data) return null;

        return fullUserSchema.parse(data);
    }

    async update(id: string, values: Partial<typeof users.$inferInsert>) {
        const [data] = await db
            .update(users)
            .set(values)
            .where(eq(users.id, id))
            .returning();

        if (!data) return null;
        
        // Fetch the complete user with addresses after update
        const updatedUser = await db.query.users.findFirst({
            where: (f, o) => o.eq(f.id, id),
            with: { addresses: true },
        });
        
        if (!updatedUser) return null;
        return fullUserSchema.parse(updatedUser);
    }
}

export const userQueries = new UserQuery();
