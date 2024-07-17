import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  const { email, username: name, ...restData } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        name,
        ...restData,
      },
    });

    return NextResponse.json({ updatedUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
