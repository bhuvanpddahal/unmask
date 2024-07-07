import bcrypt from "bcryptjs";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function hashEmail(email: string) {
    const { AUTH_SECRET, HASHING_SALT } = process.env;
    if (!AUTH_SECRET || !HASHING_SALT) return null;

    const concatenatedEmail = email + AUTH_SECRET;
    const hashedEmail = await bcrypt.hash(concatenatedEmail, `$2a$10$s6D${HASHING_SALT}`);

    return hashedEmail;
}