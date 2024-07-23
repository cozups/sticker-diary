import { prisma } from '@/app/lib/prisma';
import { auth } from '@/auth';
import { endOfMonth, startOfMonth, format } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const session = await auth();

  if (!session) return;

  if (date) {
    const dateFormat = 'yyyy-MM-dd';

    const gteString = new Date(format(startOfMonth(date), dateFormat));
    const lteString = new Date(format(endOfMonth(date), dateFormat));
    console.log({ gteString, lteString });
    const schedules = await prisma.schedule.findMany({
      where: {
        userId: session.user.email as string,
        date: {
          gte: gteString,
          lte: lteString,
        },
      },
    });

    console.log({ schedules });

    return NextResponse.json(schedules, { status: 200 });
  }
}
export async function POST(req: NextRequest) {
  const session = await auth();
  const schedule = await req.json();

  console.log(schedule.date);

  const result = await prisma.schedule.create({
    data: {
      ...schedule,
      user: {
        connect: { email: session?.user.email },
      },
    },
  });

  return NextResponse.json(result, { status: 201 });
}
