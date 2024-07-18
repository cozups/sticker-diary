import { prisma } from '@/app/lib/prisma';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

function createRandomString(length: number) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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
  const fileName = `IMG_${createRandomString(10)}`;

  if (!file) {
    return NextResponse.json({ error: 'File is null.' }, { status: 400 });
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket,
    Key: `${fileName}`,
    Body: fileBuffer,
  });
  await s3.send(command);

  const objectUrl = `https://${Bucket}.s3.amazonaws.com/${fileName}`;

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

export async function DELETE(req: NextRequest) {
  const { url } = await req.json();
  const filename = url.split('/').slice(-1)[0];

  try {
    const command = new DeleteObjectCommand({
      Bucket,
      Key: filename,
    });
    await s3.send(command);
  } catch (error) {
    return NextResponse.json(
      { error: 'DELETE image failed.' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { result: 'DELETE image success.' },
    { status: 201 }
  );
}
