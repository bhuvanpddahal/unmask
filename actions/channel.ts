"use server";

import { v2 as cloudinary } from "cloudinary";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import {
    ChannelIdPayload,
    ChannelIdValidator,
    GetTopicChannelsPayload,
    GetTopicChannelsValidator,
    UpsertChannelPayload,
    UpsertChannelValidator
} from "@/lib/validators/channel";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createChannel = async (payload: UpsertChannelPayload) => {
    try {
        const validatedFields = UpsertChannelValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { name, description, type, bannerImage, profileImage, visibility } = validatedFields.data;

        const existingChannelWithSameName = await db.channel.findUnique({
            where: { name }
        });
        if (existingChannelWithSameName) return { error: "This channel name is already taken" };

        let bannerImageUrl: string | undefined = undefined;
        let profileImageUrl: string | undefined = undefined;

        if (bannerImage) bannerImageUrl = (await cloudinary.uploader.upload(bannerImage, { overwrite: false })).secure_url;
        if (profileImage) profileImageUrl = (await cloudinary.uploader.upload(profileImage, { overwrite: false })).secure_url;

        const newChannel = await db.channel.create({
            data: {
                name,
                description,
                type,
                bannerImage: bannerImageUrl,
                profileImage: profileImageUrl,
                visibility
            },
            select: {
                id: true
            }
        });

        return { success: "Channel created successfully", channelId: newChannel.id };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getChannelInfo = async (payload: ChannelIdPayload) => {
    try {
        const validatedFields = ChannelIdValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();

        const { channelId } = validatedFields.data;

        const channel = await db.channel.findUnique({
            where: {
                id: channelId
            },
            select: {
                name: true,
                description: true,
                bannerImage: true,
                profileImage: true,
                visibility: true,
                follows: {
                    where: {
                        followerId: session?.user.id
                    },
                    select: {
                        followerId: true
                    }
                },
                _count: {
                    select: {
                        follows: true
                    }
                }
            }
        });
        if (!channel) return { error: "Channel not found" };

        return { channel };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getTopicChannels = async (payload: GetTopicChannelsPayload) => {
    try {
        const validatedFields = GetTopicChannelsValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { channelType, page, limit } = validatedFields.data;

        const channels = await db.channel.findMany({
            where: {
                type: channelType
            },
            orderBy: {
                follows: {
                    _count: "desc"
                }
            },
            take: limit,
            skip: (page - 1) * limit,
            select: {
                id: true,
                name: true,
                profileImage: true,
                _count: {
                    select: {
                        follows: true
                    }
                }
            }
        });

        const totalChannels = await db.channel.count({
            where: { type: channelType }
        });
        const hasNextPage = totalChannels > (page * limit);

        return { channels, hasNextPage };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const followOrUnfollowChannel = async (payload: ChannelIdPayload) => {
    try {
        const validatedFields = ChannelIdValidator.safeParse(payload);
        if (!validatedFields.success) throw new Error("Invalid fields");

        const session = await auth();
        if (!session?.user || !session.user.id) throw new Error("Unauthorized");

        const { channelId } = validatedFields.data;

        const channel = await db.channel.findUnique({
            where: {
                id: channelId
            }
        });
        if (!channel) throw new Error("Channel not found");

        const existingFollow = await db.follow.findUnique({
            where: {
                followerId_channelId: {
                    followerId: session.user.id,
                    channelId
                }
            }
        });

        if (existingFollow) { // If the user has previously followed the channel, unfollow it by deleting the follow
            await db.follow.delete({
                where: {
                    followerId_channelId: {
                        followerId: existingFollow.followerId,
                        channelId: existingFollow.channelId
                    }
                }
            });
        } else { // If the user hasn't followed the channel, follow it by creating a new follow
            await db.follow.create({
                data: {
                    followerId: session.user.id,
                    channelId
                }
            });
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};