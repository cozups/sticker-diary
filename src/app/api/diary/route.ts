import { prisma } from '@/app/lib/prisma';
import { formatDate } from '@/app/utils';
import { auth } from '@/auth';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: 'You are not logged in.' },
      { status: 401 }
    );
  }

  if (date) {
    const gteString = new Date(formatDate(startOfMonth(date)));
    const lteString = new Date(formatDate(endOfMonth(date)));
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
