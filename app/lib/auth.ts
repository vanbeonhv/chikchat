import {NextAuthOptions} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import {PrismaClient} from "@prisma/client";
import {PrismaAdapter} from "@auth/prisma-adapter";

const prisma = new PrismaClient()
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? ''
        })

    ]
}