"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { v2 as cloudinary } from "cloudinary";
import { generateUsername } from "unique-username-generator";

import { db } from "@/lib/db";
import {
    FirstStepPayload,
    FirstStepValidator,
    ResendTokenPayload,
    ResendTokenValidator,
    SigninPayload,
    SigninValidator,
    SignupPayload,
    SignupValidator,
    UpdateUserPayload,
    UpdateUserValidator,
    VerifyEmailPayload,
    VerifyEmailValidator
} from "@/lib/validators/auth";
import { auth, signIn } from "@/auth";
import { hashEmail } from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/mail";
import { getUserByEmail } from "@/lib/queries/user";
import { generateVerificationToken } from "@/lib/token";
import { getVerificationTokenByEmail } from "@/lib/queries/verification-token";
import { User } from "@prisma/client";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const checkEmailAvailability = async (payload: FirstStepPayload) => {
    try {
        const validatedFields = FirstStepValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { email } = validatedFields.data;

        const hashedEmail = await hashEmail(email);
        if (!hashedEmail) return { error: "Server configuration error" };

        const existingUser = await db.user.findUnique({
            where: {
                email: hashedEmail
            }
        });
        if (existingUser) return { error: "This email is already taken" };

        const verificationToken = await generateVerificationToken(hashedEmail);
        await sendVerificationEmail(email, verificationToken.token);

        return { success: "Verification email sent" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
    try {
        const validatedFields = VerifyEmailValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { email, token } = validatedFields.data;

        const hashedEmail = await hashEmail(email);
        if (!hashedEmail) return { error: "Server configuration error" };

        const verificationToken = await getVerificationTokenByEmail(hashedEmail);
        if (!verificationToken) return { error: "Token not found" };

        if (token !== verificationToken.token) {
            return { error: "Token is not matching" };
        }

        const hasExpired = new Date(verificationToken.expiresAt) < new Date();
        if (hasExpired) return { error: "Token has expired" };

        await db.verificationToken.delete({
            where: { id: verificationToken.id }
        });

        return { success: "Email verified" };
    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong");
    }
};

export const resendToken = async (payload: ResendTokenPayload) => {
    try {
        const validatedFields = ResendTokenValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { email } = validatedFields.data;

        const hashedEmail = await hashEmail(email);
        if (!hashedEmail) return { error: "Server configuration error" };

        const newVerificationToken = await generateVerificationToken(hashedEmail);
        await sendVerificationEmail(email, newVerificationToken.token);

        return { success: "Token resended successfully" };
    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong");
    }
};

export const checkUsernameAvailability = async (username: string) => {
    try {
        const existingUser = await db.user.findUnique({
            where: {
                username
            }
        });
        if (existingUser) return { error: "Username is not available" };

        return { success: "Username is available" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

type SignupResponse =
    { success: string; error?: undefined; } |
    { success?: undefined; error: string; };

export const signup = async (payload: SignupPayload): Promise<SignupResponse> => {
    try {
        const validatedFields = SignupValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { email, password, username } = validatedFields.data;

        let finalizedUsername = "";
        if (username) {
            const result = await checkUsernameAvailability(username);
            if (result.error) return result;

            finalizedUsername = username;
        } else {
            finalizedUsername = generateUsername("", 2, 10);
        }

        const hashedEmail = await hashEmail(email);
        if (!hashedEmail) return { error: "Server configuration error" };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.user.create({
            data: {
                username: finalizedUsername,
                email: hashedEmail,
                password: hashedPassword
            }
        });

        await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        return { success: "Signed up successfully" };
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

export const signin = async (payload: SigninPayload) => {
    try {
        const validatedFields = SigninValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);
        if (!user) return { error: "Invalid credentials" };

        const isCorrectPassword = await bcrypt.compare(
            password,
            user.password
        );
        if (!isCorrectPassword) return { error: "Invalid credentials" };

        await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        return { success: "Signed in successfully" };
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

export const updateUser = async (payload: UpdateUserPayload) => {
    try {
        const validatedFields = UpdateUserValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { username, image, newPassword } = validatedFields.data;

        const user = await db.user.findUnique({
            where: {
                id: session.user.id
            }
        });
        if (!user) return { error: "User not found" };

        const isSameUsername = user.username === username;
        if (!isSameUsername) { // If the user has changed their username
            const existingUserWithSameUsername = await db.user.findUnique({
                where: {
                    username
                }
            });
            if (existingUserWithSameUsername) return { error: "Username already taken" };
        }

        let imageUrl: string | null;
        if (image) imageUrl = (await cloudinary.uploader.upload(image, { overwrite: false })).secure_url;
        else imageUrl = user.image;

        let hashedPassword = user.password;
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(newPassword, salt);
        }

        await db.user.update({
            where: {
                id: user.id
            },
            data: {
                username,
                image: imageUrl,
                password: hashedPassword
            }
        });

        return { success: "Profile updated" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
}