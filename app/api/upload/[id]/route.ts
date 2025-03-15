import Redis from "ioredis";
import { NextRequest } from "next/server";

const redis = new Redis(process.env.REDIS_URL as string);

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const uuid = (await params).id;

  if (!uuid) {
    return Response.json({ error: "UUID is required" }, { status: 400 });
  }

  try {
    const productData = await redis.hgetall(`product:${uuid}`);

    if (!productData || Object.keys(productData).length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ id: uuid, ...productData }, { status: 200 });
  } catch (error) {
    console.error("Redis Fetch Error:", error);
    return Response.json(
      { error: "Failed to fetch data from Redis" },
      { status: 500 }
    );
  }
}
