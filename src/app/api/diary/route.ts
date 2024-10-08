import { prisma } from '@/app/lib/prisma';
import { formatDate } from '@/app/utils';
import { auth } from '@/auth';
import { startOfMonth, endOfMonth, subDays, addDays } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const id = searchParams.get('id');
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: 'You are not logged in.' },
      { status: 401 }
    );
  }

  if (date) {
    const gteString = new Date(formatDate(subDays(startOfMonth(date), 7)));
    const lteString = new Date(formatDate(addDays(endOfMonth(date), 7)));
    const diary = await prisma.diary.findMany({
      where: {
        userId: session.user.email as string,
        date: {
          gte: gteString,
          lte: lteString,
        },
      },
    });

    return NextResponse.json(diary, { status: 200 });
  }

  if (id) {
    const diary = await prisma.diary.findUnique({
      where: { id },
    });

    return NextResponse.json(diary, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: 'You are not logged in.' },
      { status: 401 }
    );
  }

  const result = await prisma.diary.create({
    data: {
      ...data,
      user: {
        connect: { email: session?.user.email },
      },
    },
  });

  return NextResponse.json(
    { message: 'POST diary success.', result },
    { status: 201 }
  );
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  const session = await auth();

  const diary = await prisma.diary.findUnique({
    where: { id },
  });

  if (!diary) {
    return NextResponse.json({ error: 'Diary not found.' }, { status: 404 });
  }

  if (session?.user.email !== diary.userId) {
    return NextResponse.json(
      { error: "You can't update this diary." },
      { status: 403 }
    );
  }

  const result = await prisma.diary.update({
    where: {
      id,
    },
    data,
  });

  return NextResponse.json(
    { result: 'UPDATE Diary success.' },
    { status: 201 }
  );
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const { id } = await req.json();

  const diary = await prisma.diary.findUnique({
    where: {
      id,
    },
  });

  if (!diary) {
    return NextResponse.json({ error: 'Diary not found.' }, { status: 404 });
  }

  if (diary.userId !== session?.user.email) {
    return NextResponse.json(
      { error: "You can't delete this diary." },
      { status: 403 }
    );
  }

  const result = await prisma.diary.delete({
    where: {
      id,
    },
  });

  return NextResponse.json(
    { result: 'DELETE diary success.' },
    { status: 201 }
  );
}
