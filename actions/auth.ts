"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { db } from "@/lib/db";
import {
    GetUserEmailPayload,
    GetUserEmailValidator,
    ResendTokenPayload,
    ResendTokenValidator,
    SigninPayload,
    SigninValidator,
    VerifyEmailPayload,
    VerifyEmailValidator
} from "@/lib/validators/auth";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { getUserByEmail, getUserById } from "@/lib/queries/user";
import { getVerificationTokenByEmail } from "@/lib/queries/verification-token";

export const signinWithEmail = async (payload: SigninPayload) => {
    try {
        const validatedFields = SigninValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { email, password } = validatedFields.data;

        const existingUser = await getUserByEmail(email);

        if (existingUser) { // If the user has already signed in
            if (!existingUser.password) {
                return { error: "Try signing in with the same provider that you used during your initial sign in" };
            }

            const isCorrectPassword = await bcrypt.compare(
                password,
                existingUser.password
            );
            if (!isCorrectPassword) return { error: "Invalid credentials" };

            if (existingUser.emailVerified) {
                await signIn("credentials", {
                    email: existingUser.email,
                    password: existingUser.password,
                    redirectTo: DEFAULT_LOGIN_REDIRECT
                });
            } else {
                const verificationToken = await generateVerificationToken(email);
                await sendVerificationEmail(email, verificationToken.token);

                return { userId: existingUser.id, success: "Verification email sent" };
            }
        } else { // If the user is signing in for the first time
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await db.user.create({
                data: {
                    email,
                    password: hashedPassword
                }
            });

            const verificationToken = await generateVerificationToken(email);
            await sendVerificationEmail(email, verificationToken.token);

            return { userId: newUser.id, success: "Verification email sent" };
        }
    } catch (error) {
        console.error(error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }
        throw new Error("Something went wrong");
    }
};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
    try {
        const validatedFields = VerifyEmailValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { userId, token } = validatedFields.data;

        const user = await getUserById(userId);
        if (!user) return { error: "User not found" };

        const verificationToken = await getVerificationTokenByEmail(user.email);
        if (!verificationToken) return { error: "Token not found" };

        if (token !== verificationToken.token) {
            return { error: "Token is not matching" };
        }

        const hasExpired = new Date(verificationToken.expiresAt) < new Date();
        if (hasExpired) return { error: "Token has expired" };

        await db.verificationToken.delete({
            where: { id: verificationToken.id }
        });

        await db.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date()
            }
        });

        await signIn("credentials", {
            email: user.email,
            password: user.password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }
        throw new Error("Something went wrong");
    }
};

export const resendToken = async (payload: ResendTokenPayload) => {
    try {
        const validatedFields = ResendTokenValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { userId } = validatedFields.data;

        const user = await getUserById(userId);
        if (!user) return { error: "User not found" };
        if (user.emailVerified) {
            return { error: "Cannot send token to already verified email" };
        }

        const newVerificationToken = await generateVerificationToken(user.email);
        await sendVerificationEmail(user.email, newVerificationToken.token);

        return { success: "Token resended successfully" };
    } catch (error) {
        throw new Error("Something went wrong");
    }
};


export const getUserEmail = async (payload: GetUserEmailPayload) => {
    try {
        const validatedFields = GetUserEmailValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { userId } = validatedFields.data;

        const user = await getUserById(userId);
        if (!user) return { error: "User not found" };

        return { email: user.email, emailVerified: user.emailVerified };
    } catch (error) {
        return { error: "Something went wrong" };
    }
};