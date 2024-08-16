"use server";

import { v2 as cloudinary } from "cloudinary";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import {
    ChannelIdPayload,
    ChannelIdValidator,
    GetTopicChannelsPayload,
    GetTopicChannelsValidator,
    InviteCodePayload,
    InviteCodeValidator,
    UpsertChannelPayload,
    UpsertChannelValidator
} from "@/lib/validators/channel";
import { generateInviteCode } from "@/lib/invite-code";

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

        const inviteCode = await generateInviteCode();

        const newChannel = await db.channel.create({
            data: {
                creatorId: session.user.id,
                name,
                description,
                type,
                bannerImage: bannerImageUrl,
                profileImage: profileImageUrl,
                visibility,
                inviteCode,
                follows: {
                    create: {
                        followerId: session.user.id
                    }
                }
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
                creatorId: true,
                name: true,
                description: true,
                bannerImage: true,
                profileImage: true,
                visibility: true,
                inviteCode: true,
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

        return {
            channel: {
                ...channel,
                inviteCode: channel.creatorId === session?.user.id ? channel.inviteCode : null
            }
        };
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
            if (channel.creatorId === session.user.id) { // If the user is the creator of the channel, then they cannot unfollow
                throw new Error("Cannot unfollow own's channel");
            }
            await db.follow.delete({
                where: {
                    followerId_channelId: {
                        followerId: existingFollow.followerId,
                        channelId: existingFollow.channelId
                    }
                }
            });
        } else { // If the user hasn't followed the channel, follow it by creating a new follow
            if (channel.visibility === "private") { // If the channel is private, inform the user that they can only follow it by using invitation link
                throw new Error("This channel can only be followed using invitation link");
            }
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

export const getChannelMetadata = async (payload: ChannelIdPayload) => {
    try {
        const validatedFields = ChannelIdValidator.safeParse(payload);
        if (!validatedFields.success) return { name: "❌ Invalid fields", description: undefined };

        const { channelId } = validatedFields.data;

        const channel = await db.channel.findUnique({
            where: {
                id: channelId
            },
            select: {
                name: true,
                description: true
            }
        });
        if (!channel) return { name: "❌ Channel not found", description: undefined };

        return { name: channel.name, description: channel.description };
    } catch (error) {
        console.error(error);
        return { name: "❗⚠️ Server error", description: undefined };
    }
};

export const getChannelToEdit = async (payload: ChannelIdPayload) => {
    try {
        const validatedFields = ChannelIdValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { channelId } = validatedFields.data;

        const channel = await db.channel.findUnique({
            where: {
                id: channelId
            },
            select: {
                creatorId: true,
                name: true,
                description: true,
                type: true,
                bannerImage: true,
                profileImage: true,
                visibility: true
            }
        });
        if (!channel) return { error: "Channel not found" };
        if (channel.creatorId !== session.user.id) return { error: "Unpermitted" };

        return {
            channel: {
                name: channel.name,
                description: channel.description,
                type: channel.type,
                bannerImage: channel.bannerImage,
                profileImage: channel.profileImage,
                visibility: channel.visibility
            }
        };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const updateChannel = async (payload: UpsertChannelPayload) => {
    try {
        const validatedFields = UpsertChannelValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { id, name, description, type, bannerImage, profileImage, visibility } = validatedFields.data;

        const channel = await db.channel.findUnique({
            where: { id }
        });
        if (!channel) return { error: "Channel not found" };
        if (channel.creatorId !== session.user.id) return { error: "Not allowed" };

        if (channel.name !== name) {
            const existingChannelWithSameName = await db.channel.findUnique({
                where: { name }
            });
            if (existingChannelWithSameName) return { error: "This channel name is already taken" };
        }

        let bannerImageUrl = channel.bannerImage || undefined;
        let profileImageUrl = channel.profileImage || undefined;

        if (bannerImageUrl !== bannerImage) {
            bannerImageUrl = bannerImage ? (await cloudinary.uploader.upload(bannerImage, { overwrite: false })).secure_url : undefined;
        }
        if (profileImageUrl !== profileImage) {
            profileImageUrl = profileImage ? (await cloudinary.uploader.upload(profileImage, { overwrite: false })).secure_url : undefined;
        }

        await db.channel.update({
            where: { id },
            data: {
                name,
                description,
                type,
                bannerImage: bannerImageUrl,
                profileImage: profileImageUrl,
                visibility
            }
        });

        return { success: "Channel updated successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const deleteChannel = async (payload: ChannelIdPayload) => {
    try {
        const validatedFields = ChannelIdValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { channelId } = validatedFields.data;

        const channel = await db.channel.findUnique({
            where: {
                id: channelId
            }
        });
        if (!channel) return { error: "Channel not found" };
        if (channel.creatorId !== session.user.id) return { error: "Not allowed" };

        await db.channel.delete({
            where: {
                id: channelId
            }
        });

        return { success: "Channel deleted successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const acceptInvitation = async (payload: InviteCodePayload) => {
    try {
        const validatedFields = InviteCodeValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { inviteCode } = validatedFields.data;

        const channel = await db.channel.findUnique({
            where: { inviteCode }
        });
        if (!channel) return { error: "Invalid request" };

        const alreadyFollowed = await db.follow.findUnique({
            where: {
                followerId_channelId: {
                    followerId: session.user.id,
                    channelId: channel.id
                }
            }
        });
        if (alreadyFollowed) return { channelId: channel.id };

        await db.follow.create({
            data: {
                followerId: session.user.id,
                channelId: channel.id
            }
        });

        return { channelId: channel.id };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const generateNewInviteCode = async (payload: InviteCodePayload) => {
    try {
        const validatedFields = InviteCodeValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { inviteCode } = validatedFields.data;

        const channel = await db.channel.findUnique({
            where: { inviteCode }
        });
        if (!channel) return { error: "Channel not found" };
        if (channel.creatorId !== session.user.id) return { error: "Not allowed" };

        const newInviteCode = await generateInviteCode();

        await db.channel.update({
            where: {
                id: channel.id
            },
            data: {
                inviteCode: newInviteCode
            }
        });

        return { inviteCode: newInviteCode };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};