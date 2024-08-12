import bcrypt from "bcryptjs";
import { Editor } from "@tiptap/react";
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

export const setLink = (editor: Editor) => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({
        href: url,
        target: "_blank",
        class: "text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-500"
    }).run();
};