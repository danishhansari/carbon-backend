ALTER TABLE "products" ADD COLUMN "productName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "range" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "index" integer;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_index_unique" UNIQUE("index");