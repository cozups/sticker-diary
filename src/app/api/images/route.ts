import { prisma } from '@/app/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

const Bucket = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File = formData.get('image') as File;
  const email = formData.get('email') as string;

  if (!file) {
    return NextResponse.json({ error: 'File is null.' }, { status: 400 });
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket,
    Key: `${file.name}`,
    Body: fileBuffer,
  });
  await s3.send(command);

  const objectUrl = `https://${Bucket}.s3.amazonaws.com/${file.name}`;

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      image: objectUrl,
    },
  });

  return NextResponse.json(
    { result: 'Upload success.', url: objectUrl },
    { status: 201 }
  );
}
