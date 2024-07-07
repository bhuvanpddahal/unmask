import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

import { getUserByEmail } from "@/lib/queries/user";
import { SigninValidator } from "@/lib/validators/auth";

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = SigninValidator.safeParse(credentials);
                if (!validatedFields.success) return null;
                const { email, password } = validatedFields.data;
                const user = await getUserByEmail(email);
                if (!user) return null;
                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (!passwordsMatch) return null;
                return user;
            }
        })
    ]
} satisfies NextAuthConfig;