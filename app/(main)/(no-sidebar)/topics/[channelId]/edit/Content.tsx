"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ChannelForm, { ChannelFormLoader } from "../../ChannelForm";
import { useToast } from "@/hooks/useToast";
import { UpsertChannelPayload } from "@/lib/validators/channel";
import { getChannelToEdit, updateChannel } from "@/actions/channel";

interface EditChannelContentProps {
    channelId: string;
}

const EditChannelContent = ({
    channelId
}: EditChannelContentProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const {
        data,
        isLoading
    } = useQuery({
        queryKey: ["topics", channelId, "edit"],
        queryFn: async () => {
            const payload = { channelId };
            const data = await getChannelToEdit(payload);
            return data;
        }
    });

    if (isLoading) return <ChannelFormLoader />
    if (!data || data.error) return (
        <div className="py-20 flex flex-col items-center justify-center gap-y-2">
            <Image
                src="/error.png"
                alt="Error"
                height={100}
                width={100}
            />
            <p className="text-sm font-medium text-zinc-400">
                {data?.error || "Something went wrong"}
            </p>
        </div>
    );

    const defaultValues = {
        id: channelId,
        name: data.channel?.name || "",
        description: data.channel?.description || "",
        type: data.channel?.type || "general",
        bannerImage: data.channel?.bannerImage || undefined,
        profileImage: data.channel?.profileImage || undefined,
        visibility: data.channel?.visibility || "public"
    };

    const onSubmit = (payload: UpsertChannelPayload) => {
        startTransition(() => {
            updateChannel(payload).then((data) => {
                if (data.success) {
                    toast({
                        title: "Success",
                        description: data.success
                    });
                    queryClient.invalidateQueries({ queryKey: ["/"] });
                    queryClient.invalidateQueries({ queryKey: ["polls"] });
                    queryClient.invalidateQueries({ queryKey: ["topics", channelId] });
                    router.push(`/topics/${channelId}`);
                }
                if (data.error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: data.error
                    });
                }
            });
        });
    };

    return (
        <ChannelForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            isPending={isPending}
            submitBtnText="Edit"
            pendingSubmitBtnText="Editing"
        />
    );
};

export default EditChannelContent;