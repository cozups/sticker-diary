import { SHA256 } from 'crypto-js';
import { prisma } from '@/app/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // create user
  const { username: name, email, password, image } = await req.json();

  console.log({ name, email, password, image });

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword(password),
        image: '',
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export function hashPassword(password: string) {
  return SHA256(password).toString();
}
