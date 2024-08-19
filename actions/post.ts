"use server";

import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import {
    GetChannelPostsPayload,
    GetChannelPostsValidator,
    GetPostsPayload,
    GetPostsValidator,
    GetPostsWithPollPayload,
    GetPostsWithPollValidator,
    PostIdPayload,
    PostIdValidator,
    UpsertPostPayload,
    UpsertPostValidator
} from "@/lib/validators/post";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createPost = async (payload: UpsertPostPayload) => {
    try {
        const validatedFields = UpsertPostValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { channelId, title, description, image, pollOptions } = validatedFields.data;

        let imageUrl: string | undefined = undefined;
        if (image) imageUrl = (await cloudinary.uploader.upload(image, { overwrite: false })).secure_url;

        const newPost = await db.post.create({
            data: {
                creatorId: session.user.id,
                channelId,
                title,
                description,
                image: imageUrl,
                poll: pollOptions ? {
                    create: {
                        options: {
                            createMany: {
                                data: pollOptions.map((option) => ({
                                    option
                                }))
                            }
                        }
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

        const session = await auth();

        const { page, limit, sort } = validatedFields.data;

        let orderByClause = {};

        if (sort === "hot") {
            orderByClause = [
                { likes: { _count: "desc" } },
                { createdAt: "desc" }
            ];
        } else if (sort === "recent") {
            orderByClause = { createdAt: "desc" };
        } else {
            orderByClause = [
                { views: { _count: "desc" } },
                { createdAt: "desc" }
            ];
        }

        const posts = await db.post.findMany({
            where: {},
            orderBy: orderByClause,
            take: limit,
            skip: (page - 1) * limit,
            include: {
                creator: {
                    select: {
                        username: true,
                        image: true
                    }
                },
                channel: {
                    select: {
                        name: true
                    }
                },
                poll: {
                    select: {
                        options: {
                            select: {
                                _count: {
                                    select: {
                                        votes: true
                                    }
                                }
                            }
                        }
                    }
                },
                likes: {
                    where: {
                        likerId: session?.user.id
                    },
                    select: {
                        likerId: true
                    }
                },
                comments: {
                    select: {
                        _count: {
                            select: {
                                replies: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        views: true
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

export const getPostsWithPoll = async (payload: GetPostsWithPollPayload) => {
    try {
        const validatedFields = GetPostsWithPollValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();

        const { page, limit, sort } = validatedFields.data;

        let orderByClause = {};

        if (sort === "hot") {
            orderByClause = [
                { likes: { _count: "desc" } },
                { createdAt: "desc" }
            ];
        } else if (sort === "recent") {
            orderByClause = { createdAt: "desc" };
        }

        const posts = await db.post.findMany({
            where: {
                poll: {
                    isNot: null
                }
            },
            orderBy: orderByClause,
            take: limit,
            skip: (page - 1) * limit,
            select: {
                id: true,
                creatorId: true,
                channelId: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                creator: {
                    select: {
                        username: true,
                        image: true
                    }
                },
                channel: {
                    select: {
                        name: true
                    }
                },
                poll: {
                    select: {
                        id: true,
                        options: {
                            select: {
                                id: true,
                                option: true,
                                _count: {
                                    select: {
                                        votes: true
                                    }
                                },
                                votes: {
                                    where: {
                                        voterId: session?.user.id
                                    },
                                    select: {
                                        voterId: true
                                    }
                                }
                            }
                        }
                    }
                },
                likes: {
                    where: {
                        likerId: session?.user.id
                    },
                    select: {
                        likerId: true
                    }
                },
                comments: {
                    select: {
                        _count: {
                            select: {
                                replies: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        views: true
                    }
                }
            }
        });

        const totalPosts = await db.post.count({
            where: {
                poll: { isNot: null }
            }
        });
        const hasNextPage = totalPosts > (page * limit);

        return { posts, hasNextPage };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getPost = async (payload: PostIdPayload) => {
    try {
        const validatedFields = PostIdValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { postId } = validatedFields.data;

        const session = await auth();
        const isSignedIn = !!(session?.user && session.user.id);
        const viewerId = isSignedIn ? session.user.id : undefined;
        const viewerIp = isSignedIn ? undefined : headers().get("x-forwarded-for") || "0.0.0.0";

        const post = await db.post.findUnique({
            where: {
                id: postId
            },
            include: {
                creator: {
                    select: {
                        username: true,
                        image: true
                    }
                },
                channel: {
                    select: {
                        name: true
                    }
                },
                bookmarks: {
                    where: {
                        bookmarkerId: session?.user.id
                    },
                    select: {
                        bookmarkerId: true
                    }
                },
                poll: {
                    select: {
                        id: true,
                        options: {
                            select: {
                                id: true,
                                option: true,
                                _count: {
                                    select: {
                                        votes: true
                                    }
                                },
                                votes: {
                                    where: {
                                        voterId: session?.user.id
                                    },
                                    select: {
                                        voterId: true
                                    }
                                }
                            }
                        }
                    }
                },
                likes: {
                    where: {
                        likerId: session?.user.id
                    },
                    select: {
                        likerId: true
                    }
                },
                comments: {
                    select: {
                        _count: {
                            select: {
                                replies: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        views: true
                    }
                }
            }
        });
        if (!post) return { error: "Post not found" };

        const alreadyViewed = await db.view.findFirst({
            where: {
                postId,
                viewerId,
                viewerIp
            }
        });
        if (!alreadyViewed) {
            await db.view.create({
                data: {
                    postId,
                    viewerId,
                    viewerIp
                }
            });
        }

        return { post };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getPostMetadata = async (payload: PostIdPayload) => {
    try {
        const validatedFields = PostIdValidator.safeParse(payload);
        if (!validatedFields.success) return { title: "❌ Invalid fields", description: undefined };

        const { postId } = validatedFields.data;

        const post = await db.post.findUnique({
            where: {
                id: postId
            },
            select: {
                title: true,
                description: true
            }
        });
        if (!post) return { title: "❌ Post not found", description: undefined };

        return { title: post.title, description: post.description };
    } catch (error) {
        console.error(error);
        return { title: "❗⚠️ Server error", description: undefined };
    }
};

export const likeOrUnlikePost = async (payload: PostIdPayload) => {
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

        const existingLike = await db.postLike.findUnique({
            where: {
                likerId_postId: {
                    likerId: session.user.id,
                    postId
                }
            }
        });

        if (existingLike) { // If the user has previously liked the post, unlike it by deleting the post like
            await db.postLike.delete({
                where: {
                    likerId_postId: {
                        likerId: session.user.id,
                        postId
                    }
                }
            });
        } else { // If the user hasn't liked the post yet, like it by creating a new post like
            await db.postLike.create({
                data: {
                    postId,
                    likerId: session.user.id
                }
            });
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const getPostToEdit = async (payload: PostIdPayload) => {
    try {
        const validatedFields = PostIdValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { postId } = validatedFields.data;

        const post = await db.post.findUnique({
            where: {
                id: postId
            },
            select: {
                creatorId: true,
                title: true,
                description: true,
                image: true,
                channel: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                poll: {
                    select: {
                        options: {
                            select: {
                                option: true
                            }
                        }
                    }
                }
            }
        });
        if (!post) return { error: "Post not found" };
        if (post.creatorId !== session.user.id) return { error: "Unpermitted" };

        return { post };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const editPost = async (payload: UpsertPostPayload) => {
    try {
        const validatedFields = UpsertPostValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { id, title, description, image } = validatedFields.data;

        const post = await db.post.findUnique({
            where: {
                id
            }
        });
        if (!post) return { error: "Post not found" };
        if (post.creatorId !== session.user.id) return { error: "Unpermitted" };

        let imageUrl: string | null = null;
        if (image) imageUrl = (await cloudinary.uploader.upload(image, { overwrite: false })).secure_url;

        await db.post.update({
            where: {
                id
            },
            data: {
                title,
                description,
                image: imageUrl
            }
        });

        return { success: "Post updated successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const deletePost = async (payload: PostIdPayload) => {
    try {
        const validatedFields = PostIdValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { postId } = validatedFields.data;

        const post = await db.post.findUnique({
            where: {
                id: postId
            }
        });
        if (!post) return { error: "Post not found" };
        if (post.creatorId !== session.user.id) return { error: "Not permitted" };

        await db.post.delete({
            where: {
                id: postId
            }
        });

        return { success: "Post deleted successfully" };
    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong");
    }
};


export const getChannelPosts = async (payload: GetChannelPostsPayload) => {
    try {
        const validatedFields = GetChannelPostsValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();

        const { channelId, page, limit, sort } = validatedFields.data;

        const channel = await db.channel.findUnique({
            where: {
                id: channelId
            },
            select: {
                visibility: true,
                follows: {
                    where: {
                        followerId: session?.user.id
                    },
                    select: {
                        followerId: true
                    }
                }
            }
        });
        if (!channel) return { error: "Channel not found" };

        const isFollowed = channel.follows[0] && channel.follows[0].followerId === session?.user.id;
        if (channel.visibility === "private" && !isFollowed) return { error: "Not allowed to view posts from this channel" };

        let orderByClause = {};

        if (sort === "hot") {
            orderByClause = [
                { likes: { _count: "desc" } },
                { createdAt: "desc" }
            ];
        } else if (sort === "recent") {
            orderByClause = { createdAt: "desc" };
        }

        const posts = await db.post.findMany({
            where: {
                channelId
            },
            orderBy: orderByClause,
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
                        options: {
                            select: {
                                _count: {
                                    select: {
                                        votes: true
                                    }
                                }
                            }
                        }
                    }
                },
                likes: {
                    where: {
                        likerId: session?.user.id
                    },
                    select: {
                        likerId: true
                    }
                },
                comments: {
                    select: {
                        _count: {
                            select: {
                                replies: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        views: true
                    }
                }
            }
        });

        const totalPosts = await db.post.count({
            where: { channelId }
        });
        const hasNextPage = totalPosts > (page * limit);

        return { posts, hasNextPage };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};