"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import PostForm from "../PostForm";
import Navbar, { NavbarLoader } from "../Navbar";
import { useToast } from "@/hooks/useToast";
import { createPost } from "@/actions/post";
import { getUserFollows } from "@/actions/follow";
import { UpsertPostPayload } from "@/lib/validators/post";

const PostCreationContent = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [hasPoll, setHasPoll] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [channelId, setChannelId] = useState<string | undefined>(undefined);

    const {
        data,
        isLoading
    } = useQuery({
        queryKey: ["post", "create"],
        queryFn: async () => {
            const data = await getUserFollows();
            return data;
        }
    });

    if (isLoading) return <NavbarLoader />
    if (!data || data.error) return (
        <div className="py-20 flex flex-col items-center justify-center gap-y-1">
            <Image
                src="/error.svg"
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
        id: undefined,
        title: "",
        description: "",
        image: undefined,
        pollOptions: undefined,
        channelId: undefined
    };

    const onSubmit = (payload: UpsertPostPayload) => {
        startTransition(() => {
            createPost(payload).then((data) => {
                if (data.success) {
                    toast({
                        title: "Success",
                        description: data.success
                    });
                    queryClient.invalidateQueries({ queryKey: ["/"] });
                    queryClient.invalidateQueries({ queryKey: ["polls"] });
                    router.push(`/post/${data.postId}`);
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
        <>
            <Navbar
                mode="create"
                hasImage={hasImage}
                hasPoll={hasPoll}
                setHasPoll={setHasPoll}
                follows={data?.follows || []}
                channelId={channelId}
                setChannelId={setChannelId}
            />
            <div className="max-w-[1400px] w-full mx-auto px-6 pt-4 pb-2">
                <PostForm
                    setHasImage={setHasImage}
                    hasPoll={hasPoll}
                    setHasPoll={setHasPoll}
                    channelId={channelId}
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    isPending={isPending}
                    submitBtnText="Create Post"
                    pendingSubmitBtnText="Creating Post"
                />
            </div>
        </>
    );
};

export default PostCreationContent;