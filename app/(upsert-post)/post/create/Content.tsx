"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";

import Navbar from "../Navbar";
import PostForm from "../PostForm";
import { useToast } from "@/hooks/useToast";
import { createPost } from "@/actions/post";
import { UpsertPostPayload } from "@/lib/validators/post";

const PostCreationContent = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [hasPoll, setHasPoll] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const [isPending, startTransition] = useTransition();

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
                    router.push(`/posts/${data.postId}`);
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
                    onSubmit={onSubmit}
                    isPending={isPending}
                    submitBtnText="Create Post"
                    pendingSubmitBtnText="Creating Post"
                />
            </div>
        </>
    )
};

export default PostCreationContent;