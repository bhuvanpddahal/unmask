"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import PostForm from "../../PostForm";
import Navbar, { NavbarLoader } from "../../Navbar";
import { useToast } from "@/hooks/useToast";
import { editPost, getPostToEdit } from "@/actions/post";
import { UpsertPostPayload } from "@/lib/validators/post";

interface PostEditContentProps {
    postId: string;
}

const PostEditContent = ({
    postId
}: PostEditContentProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [hasPoll, setHasPoll] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const [isPending, startTransition] = useTransition();

    const {
        data,
        isLoading
    } = useQuery({
        queryKey: ["posts", postId, "edit"],
        queryFn: async () => {
            const payload = { postId };
            const data = await getPostToEdit(payload);
            return data;
        }
    });

    useEffect(() => {
        if (data?.post?.poll) setHasPoll(true);
        if (data?.post?.image) setHasImage(true);
    }, [data]);

    if (isLoading) return (
        <>
            <NavbarLoader />
        </>
    )
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
    )

    const defaultValues = {
        id: postId,
        title: data.post?.title || "",
        description: data.post?.description || "",
        image: data.post?.image || undefined,
        pollOptions: data.post?.poll?.options.map((option) => option.option)
    };

    const onSubmit = (payload: UpsertPostPayload) => {
        startTransition(() => {
            editPost(payload).then((data) => {
                if (data.success) {
                    toast({
                        title: "Success",
                        description: data.success
                    });
                    queryClient.invalidateQueries({ queryKey: ["/"] });
                    queryClient.invalidateQueries({ queryKey: ["polls"] });
                    queryClient.invalidateQueries({ queryKey: ["posts", postId] });
                    router.push(`/posts/${postId}`);
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
                hasImage={hasImage}
                hasPoll={hasPoll}
                setHasPoll={setHasPoll}
            />
            <div className="max-w-[1400px] w-full mx-auto px-6 pt-4 pb-2">
                <PostForm
                    setHasImage={setHasImage}
                    hasPoll={hasPoll}
                    setHasPoll={setHasPoll}
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    isPending={isPending}
                    submitBtnText="Update Post"
                    pendingSubmitBtnText="Updating Post"
                />
            </div>
        </>
    )
};

export default PostEditContent;