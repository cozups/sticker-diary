import { prisma } from '@/app/lib/prisma';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

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
