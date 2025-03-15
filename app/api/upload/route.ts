import { v4 as uuidv4 } from "uuid";
import type { NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { Redis } from "ioredis";

config();

const ACCOUNT_ID = process.env.ACCOUNT_ID as string;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID as string;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY as string;
const redis = new Redis(process.env.REDIS_URL as string);

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

// Types for request payload and database response
interface ProductData {
  filename: string;
  productName: string;
  description: string;
  range: string;
  index: number;
}

export async function POST(request: NextRequest) {
  let obj: ProductData;

  try {
    obj = await request.json();
  } catch (error) {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { filename, productName, description, range, index } = obj;
  const fileExtension = filename.split(".").pop();
  const uniqueFilename = `${uuidv4()}.${fileExtension}`;

  try {
    const url = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: "carbon-backend",
        Key: uniqueFilename,
      }),
      { expiresIn: 600 }
    );

    const publicPath = `https://pub-${ACCOUNT_ID}.r2.dev/${uniqueFilename}`;

    if (!url) {
      return Response.json(
        {
          error: "Error while generating upload URL",
        },
        { status: 500 }
      );
    }

    // Insert Data into Redis
    try {
      const productData = {
        productName,
        description,
        range,
        index,
        imgUrl: publicPath,
      };

      await redis.hset(`product:${uniqueFilename}`, productData); // Efficient Redis hash storage

      return Response.json({ publicPath, url, productData }, { status: 201 });
    } catch (redisError) {
      console.error("Redis Error:", redisError);
      return Response.json(
        {
          error: "Failed to insert data into Redis",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Upload Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const keys = await redis.keys("product:*"); // Fetch all product keys
    const products = await Promise.all(
      keys.map(async (key) => await redis.hgetall(key))
    );

    return Response.json(products, { status: 200 });
  } catch (error) {
    console.error("Redis Fetch Error:", error);
    return Response.json(
      { error: "Failed to fetch data from Redis" },
      { status: 500 }
    );
  }
}
