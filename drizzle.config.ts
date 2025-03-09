import { type Config } from "drizzle-kit";
import { config } from "dotenv";

config();

export default {
  schema: "./app/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
