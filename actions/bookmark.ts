"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import {
    PostIdPayload,
    PostIdValidator
} from "@/lib/validators/post";

export const bookmarkOrUnbookmarkPost = async (payload: PostIdPayload) => {
    try {
        const validatedFields = PostIdValidator.safeParse(payload);
        if (!validatedFields.success) throw new Error("Invalid fields");

        const session = await auth();
        if (!session?.user || !session.user.id) throw new Error("Unauthorized");

        const { postId } = validatedFields.data;

        const post = await db.post.findUnique({
            where: {
                id: postId
            }
        });
        if (!post) throw new Error("Post not found");

        const existingBookmark = await db.bookmark.findUnique({
            where: {
                bookmarkerId_postId: {
                    bookmarkerId: session.user.id,
                    postId
                }
            }
        });

        if (existingBookmark) { // If the user has previously bookmarked the post, unbookmark it by deleting the bookmark
            await db.bookmark.delete({
                where: {
                    bookmarkerId_postId: {
                        bookmarkerId: session.user.id,
                        postId
                    }
                }
            });
        } else { // If the user hasn't bookmarked the post yet, bookmark it by creating a new bookmark
            await db.bookmark.create({
                data: {
                    bookmarkerId: session.user.id,
                    postId
                }
            });
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};
