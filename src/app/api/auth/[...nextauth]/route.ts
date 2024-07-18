import NextAuth, { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/app/lib/prisma';
// import * as bcrypt from 'bcrypt';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Adapter } from 'next-auth/adapters';

const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as Adapter,
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

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session }) {
      if (trigger === 'update') {
        return { ...token, ...session.user };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.name = token.name;
        session.user.email = token.email || '';
      }
      return session;
    },
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);

export const { GET, POST } = handlers;
