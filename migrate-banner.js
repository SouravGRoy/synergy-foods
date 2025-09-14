import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function addBannerColumns() {
    try {
        console.log("Adding font and url columns to home_banners table...");

        await db.execute(sql`
            ALTER TABLE home_banners 
            ADD COLUMN IF NOT EXISTS title_font TEXT DEFAULT 'Inter',
            ADD COLUMN IF NOT EXISTS description_font TEXT DEFAULT 'Inter',
            ADD COLUMN IF NOT EXISTS url TEXT;
        `);

        console.log("Successfully added columns!");
    } catch (error) {
        console.error("Error adding columns:", error);
    }
}

addBannerColumns();
