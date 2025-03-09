import { v4 as uuidv4 } from "uuid";
import type { NextRequest } from "next/server";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";

export const runtime = "edge";

const ACCOUNT_ID = process.env.ACCOUNT_ID as string;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID as string;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY as string;

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

// Get Pre-Signed URL for Upload
export async function POST(request: NextRequest) {
  const { filename } = await request.json();
  const fileExtension = filename.split(".").pop(); // Get file extension
  const uniqueFilename = `${uuidv4()}.${fileExtension}`; // Replace with UUID and retain extension

  console.log(uniqueFilename);

  try {
    const url = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: "carbon-backend",
        Key: uniqueFilename,
      }),
      {
        expiresIn: 600,
      }
    );
    console.log(uniqueFilename);
    const publicPath = `https://pub-eb15d66d126740589c61b97ec9d026af.r2.dev/${uniqueFilename}`;
    console.log(publicPath);
    if (url != null) {
      return Response.json({ publicPath, url });
    }
    return Response.json({
      error: "Error while uploading file please try again later",
    });
  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}
