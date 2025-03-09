import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  productName: text("productName").notNull(),
  index: integer("index").unique(),
});
