"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import ChannelForm from "../ChannelForm";
import { useToast } from "@/hooks/useToast";
import { createChannel } from "@/actions/channel";
import { UpsertChannelPayload } from "@/lib/validators/channel";

const ChannelCreationContent = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const defaultValues = {
        id: undefined,
        name: "",
        description: undefined,
        type: "general" as const,
        bannerImage: undefined,
        profileImage: undefined,
        visibility: "public" as const
    };

    const onSubmit = (payload: UpsertChannelPayload) => {
        startTransition(async () => {
            const data = await createChannel(payload);
            if (data.success) {
                toast({
                    title: "Success",
                    description: data.success
                });
                router.push(`/topics/${data.channelId}`);
            }
            if (data.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.error
                });
            }
        });
    };

    return (
        <ChannelForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            isPending={isPending}
            submitBtnText="Create"
            pendingSubmitBtnText="Creating"
        />
    );
};

export default ChannelCreationContent;