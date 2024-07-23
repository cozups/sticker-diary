import { Bucket, s3 } from '@/app/lib/s3';
import { prisma } from '@/app/lib/prisma';
import { createRandomString } from '@/app/utils';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const target = searchParams.get('target');

  if (target === 'profile') {
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

  if (target === 'stickers') {
    const formData = await req.formData();
    const stickers: Record<string, string> = {};
    const email = formData.get('email') as string;

    const userData = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const savedStickers = userData?.stickers as Record<string, string>;

    // delete prevSticker and upload new sticker
    for (const key of formData.keys()) {
      if (key === 'email') continue;

      // delete previous Sticker
      const deleteKey = savedStickers[key]?.split('/').slice(-1)[0];
      if (deleteKey) {
        const deletePrevCommand = new DeleteObjectCommand({
          Bucket,
          Key: deleteKey,
        });
        await s3.send(deletePrevCommand);
      }

      // upload new Sticker
      const file = formData.get(key) as File;
      const fileName = `STK_${createRandomString(10)}`;
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const uploadCommand = new PutObjectCommand({
        Bucket,
        Key: `${fileName}`,
        Body: fileBuffer,
      });
      await s3.send(uploadCommand);

      const objectUrl = `https://${Bucket}.s3.amazonaws.com/${fileName}`;

      stickers[key] = objectUrl;
    }

    // update sticker url to DB
    const updated = await prisma.user.update({
      where: {
        email,
      },
      data: {
        stickers: { ...savedStickers, ...stickers },
      },
    });

    return NextResponse.json(updated.stickers, { status: 201 });
  }
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

async function uploadImageToS3(fileName: string, file: File, email: string) {}

async function DeleteImageFromS3(fileName: string, file: File, email: string) {}
