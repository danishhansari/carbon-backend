import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  productName: text("productName").notNull(),
  description: text("description"),
  range: text("range"),
  index: integer("index").unique(),
  imgUrl: text("image"),
});
