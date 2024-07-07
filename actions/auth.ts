"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { generateUsername } from "unique-username-generator";
import { isRedirectError } from "next/dist/client/components/redirect";

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
    VerifyEmailPayload,
    VerifyEmailValidator
} from "@/lib/validators/auth";
import { signIn } from "@/auth";
import { hashEmail } from "@/lib/utils";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { getUserByEmail, getUserById } from "@/lib/queries/user";
import { getVerificationTokenByEmail } from "@/lib/queries/verification-token";

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
}

// export const signinWithEmail = async (payload: SigninPayload) => {
//     try {
//         const validatedFields = SigninValidator.safeParse(payload);
//         if (!validatedFields.success) return { error: "Invalid fields" };

//         const { email, password } = validatedFields.data;

//         const existingUser = await getUserByEmail(email);

//         if (existingUser) { // If the user has already signed in
//             if (!existingUser.password) {
//                 return { error: "Try signing in with the same provider that you used during your initial sign in" };
//             }

//             const isCorrectPassword = await bcrypt.compare(
//                 password,
//                 existingUser.password
//             );
//             if (!isCorrectPassword) return { error: "Invalid credentials" };

//             if (existingUser.emailVerified) {
//                 await signIn("credentials", {
//                     email: existingUser.email,
//                     password: existingUser.password,
//                     redirectTo: DEFAULT_LOGIN_REDIRECT
//                 });
//             } else {
//                 const verificationToken = await generateVerificationToken(email);
//                 await sendVerificationEmail(email, verificationToken.token);

//                 return { userId: existingUser.id, success: "Verification email sent" };
//             }
//         } else { // If the user is signing in for the first time
//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(password, salt);

//             const newUser = await db.user.create({
//                 data: {
//                     email,
//                     password: hashedPassword
//                 }
//             });

//             const verificationToken = await generateVerificationToken(email);
//             await sendVerificationEmail(email, verificationToken.token);

//             return { userId: newUser.id, success: "Verification email sent" };
//         }
//     } catch (error) {
//         if (isRedirectError(error)) throw error;
//         console.error(error);
//         if (error instanceof AuthError) {
//             switch (error.type) {
//                 case "CredentialsSignin":
//                     return { error: "Invalid credentials" };
//                 default:
//                     return { error: "Something went wrong" };
//             }
//         }
//         throw new Error("Something went wrong");
//     }
// };

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

export const signup = async (payload: SignupPayload) => {
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
            finalizedUsername = generateUsername("", 2, 8);
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
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
    } catch (error) {
        if (isRedirectError(error)) throw error;
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