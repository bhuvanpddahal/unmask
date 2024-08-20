import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { getUserById, getUserForSession } from "@/lib/queries/user";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    callbacks: {
        async signIn({ user }) {
            const existingUser = await getUserById(user.id || "");
            if (!existingUser) {
                return false;
            }

            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.username = token.username;
                session.user.image = token.image;
                session.user.joinedAt = token.joinedAt;
                session.user.updatedAt = token.updatedAt;
            }
            
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserForSession(token.sub);
            if (!existingUser) return token;

            token.username = existingUser.username;
            token.image = existingUser.image;
            token.joinedAt = existingUser.joinedAt;
            token.updatedAt = existingUser.updatedAt;

            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
});