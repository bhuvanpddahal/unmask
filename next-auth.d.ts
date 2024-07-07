import { UserRole } from "@prisma/client";
import { type DefaultJWT } from "next-auth/jwt";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    id: string;
    username: string;
    email: string;
    image: string | null;
    joinedAt: Date;
    updatedAt: Date;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        username: string;
        email: string;
        image: string | null;
        joinedAt: Date;
        updatedAt: Date;
    }
}