"use server";

import { v2 as cloudinary } from "cloudinary";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import {
    CreatePostPayload,
    CreatePostValidator,
    GetPostsPayload,
    GetPostsValidator
} from "@/lib/validators/post";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createPost = async (payload: CreatePostPayload) => {
    try {
        const validatedFields = CreatePostValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { title, description, image, pollOptions } = validatedFields.data;

        let imageUrl: string | undefined = undefined;
        if (image) imageUrl = (await cloudinary.uploader.upload(image, { overwrite: false })).secure_url;

        const newPost = await db.post.create({
            data: {
                creatorId: session.user.id,
                title,
                description,
                image: imageUrl,
                poll: pollOptions ? {
                    create: {
                        options: pollOptions
                    }
                } : undefined
            },
            select: {
                id: true
            }
        });

        return { success: "New post created", postId: newPost.id };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getPosts = async (payload: GetPostsPayload) => {
    try {
        const validatedFields = GetPostsValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { page, limit, sort } = validatedFields.data;

        const posts = await db.post.findMany({
            where: {},
            orderBy: {
                createdAt: "desc"
            },
            take: limit,
            skip: (page - 1) * limit,
            include: {
                creator: {
                    select: {
                        username: true,
                        image: true
                    }
                },
                poll: {
                    select: {
                        _count: {
                            select: {
                                votes: true
                            }
                        }
                    }
                }
            }
        });

        const totalPosts = await db.post.count({
            where: {}
        });
        const hasNextPage = totalPosts > (page * limit);

        return { posts, hasNextPage };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};