import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './prisma';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }

  interface User {
    role: Role;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' as const },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Email link',
      credentials: {
        email: { label: 'Email', type: 'email' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }
        const { email, name } = parsed.data;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          return existing;
        }
        return prisma.user.create({
          data: {
            email,
            name,
            role: Role.GUEST,
          },
        });
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signup',
  },
};

export const { handlers: authHandlers, auth, signIn, signOut } = NextAuth(authOptions);
