import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";

import * as schema from "./schema";

config();
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const connection =
  globalForDb.conn ?? postgres(process.env.DATABASE_URL!);
if (process.env.NODE_ENV !== "production") globalForDb.conn = connection;

export const db = drizzle(connection, { schema });
