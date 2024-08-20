import crypto from "crypto";

import {
    TOKEN_EXPIRY_TIME_IN_MIN,
    VERIFICATION_TOKEN_LENGTH
} from "@/constants";
import { db } from "./db";
import { getVerificationTokenByEmail } from "./queries/verification-token";

function generateCode() {
    let code = "";

    do {
        // Generate a random string (longer to ensure enough numbers)
        const buffer = crypto.randomBytes(4); // 4 bytes for more options
        const hex = buffer.toString("hex").toUpperCase();

        // Filter out non-numeric characters and add it to the code
        code += hex.replace(/\D/g, "");
    } while (code.length < VERIFICATION_TOKEN_LENGTH);

    return code.slice(0, VERIFICATION_TOKEN_LENGTH); // Truncate to ensure exactly the required digits
}

export const generateVerificationToken = async (email: string) => {
    const expiresAt = new Date(
        new Date().getTime() + TOKEN_EXPIRY_TIME_IN_MIN * 60 * 1000  // Calculate expiry date (in milliseconds)
    );

    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        await db.verificationToken.delete({
            where: { id: existingToken.id }
        });
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token: generateCode(),
            expiresAt
        }
    });
    return verificationToken;
};