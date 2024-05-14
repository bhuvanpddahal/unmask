import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { getUserById, getUserForSession } from "./lib/queries/user";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            });
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            // Allow OAuth login without email verification
            if (account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id || "");
            // Prevent sign in without email verification
            if (!existingUser || !existingUser.emailVerified) {
                return false;
            }

            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.name = token.name;
                session.user.email = token.email;
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

            token.name = existingUser.name;
            token.email = existingUser.email;
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