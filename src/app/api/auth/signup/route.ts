import { hash } from 'bcrypt';
import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // create user
  const { username: name, email, password, image } = await req.json();

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password, 12),
        image: '',
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
