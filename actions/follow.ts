"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export const getUserFollows = async () => {
    try {
        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const follows = await db.follow.findMany({
            where: {
                followerId: session.user.id
            },
            select: {
                channel: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return { follows };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};