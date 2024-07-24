import { prisma } from '@/app/lib/prisma';
import { auth } from '@/auth';
import { endOfMonth, startOfMonth, format } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const id = searchParams.get('id');
  const session = await auth();

  if (!session) return;

  if (date) {
    const dateFormat = 'yyyy-MM-dd';

    const gteString = new Date(format(startOfMonth(date), dateFormat));
    const lteString = new Date(format(endOfMonth(date), dateFormat));
    const schedules = await prisma.schedule.findMany({
      where: {
        userId: session.user.email as string,
        date: {
          gte: gteString,
          lte: lteString,
        },
      },
    });

    return NextResponse.json(schedules, { status: 200 });
  }

  if (id) {
    console.log(id);
    const schedule = await prisma.schedule.findUnique({
      where: { id: id },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(schedule, { status: 200 });
  }
}
export async function POST(req: NextRequest) {
  const session = await auth();
  const schedule = await req.json();

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

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const { id, title, description } = await req.json();

  const schedule = await prisma.schedule.findUnique({
    where: {
      id,
    },
  });

  if (!schedule) {
    return NextResponse.json({ error: 'Schedule not found.' }, { status: 404 });
  }

  if (schedule.userId !== session?.user.email) {
    return NextResponse.json(
      { error: "You can't delete this schedule." },
      { status: 403 }
    );
  }

  const result = await prisma.schedule.update({
    where: {
      id,
    },
    data: {
      title,
      description,
    },
  });

  return NextResponse.json(
    { result: 'PATCH schedule success.' },
    { status: 201 }
  );
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const { id } = await req.json();

  const schedule = await prisma.schedule.findUnique({
    where: {
      id,
    },
  });

  if (!schedule) {
    return NextResponse.json({ error: 'Schedule not found.' }, { status: 404 });
  }

  if (schedule.userId !== session?.user.email) {
    return NextResponse.json(
      { error: "You can't delete this schedule." },
      { status: 403 }
    );
  }

  const result = await prisma.schedule.delete({
    where: {
      id,
    },
  });

  return NextResponse.json(
    { result: 'DELETE schedule success.' },
    { status: 201 }
  );
}
