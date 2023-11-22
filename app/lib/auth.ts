import type { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import {prisma} from "@/app/lib/db";
import {PrismaAdapter} from "@auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
};

