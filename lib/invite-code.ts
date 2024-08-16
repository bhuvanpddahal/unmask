import crypto from "crypto";

import { db } from "./db";

function generateCode() {
    // Generate 32 cryptographically secure random bytes
    const randomBytes = crypto.randomBytes(32);
    // Convert bytes to a base64 encoded string (human-readable)
    const code = randomBytes.toString("base64");
    return code;
}

export const generateInviteCode = async () => {
    let code: string;
    let hasChannelWithSameInviteCode: { id: string } | null;

    do {
        code = generateCode();
        hasChannelWithSameInviteCode = await db.channel.findUnique({
            where: {
                inviteCode: code
            },
            select: {
                id: true
            }
        });
    } while (hasChannelWithSameInviteCode);

    return code;
};