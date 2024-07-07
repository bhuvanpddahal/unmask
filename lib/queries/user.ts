import { db } from "@/lib/db";
import { hashEmail } from "../utils";

export const getUserByEmail = async (email: string) => {
    try {
        const hashedEmail = await hashEmail(email);
        if (!hashedEmail) return null;

        const user = await db.user.findUnique({
            where: { email: hashedEmail }
        });
        return user;
    } catch (error) {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id }
        });
        return user;
    } catch (error) {
        return null;
    }
};

export const getUserForSession = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id }
        });
        return user;
    } catch (error) {
        return null;
    }
};