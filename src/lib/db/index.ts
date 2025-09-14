import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schemas from "./schemas";

// Configure connection with proper pooling
export const connection = postgres(process.env.DATABASE_URL!, {
    max: 10, // Maximum number of connections
    idle_timeout: 20,
    connect_timeout: 10,
});
export const db = drizzle(connection, { schema: schemas });
