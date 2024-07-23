import { DefaultSession, DefaultUser } from 'next-auth';
import { Prisma } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      stickers?: Record<string, string> | null; // stickers 필드 추가
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    stickers?: Record<string, string> | null; // stickers 필드 추가
  }
}
