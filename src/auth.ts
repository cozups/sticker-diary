import NextAuth, { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/app/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Prisma } from '@prisma/client';

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          throw new Error('User Not Found');
        }

        // const isMatch = await bcrypt.compare(password, user.password);

        // if (!isMatch) {
        //   throw new Error('Password is wrong.');
        // }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          stickers: user.stickers as Record<string, string>,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (user) {
        // 첫 로그인 시
        token.picture = user.image;
        token.stickers = user.stickers;
      }
      if (trigger === 'update') {
        // 세션 업데이트 시
        token.picture = session.user.image;
        token.stickers = session.user.stickers;
        return { ...token, ...session.user };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.name = token.name;
        session.user.email = token.email || '';
        session.user.image = token.picture;
        session.user.stickers = token.stickers as Record<string, string>;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
