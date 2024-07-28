import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/diary', '/schedule'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (!session && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/profile/:path*',
    '/diary/:path*',
    '/schedule/:path*',
  ],
};
