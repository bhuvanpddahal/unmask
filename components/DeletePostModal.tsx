"use client";

import { Dot } from "lucide-react";
import { useTransition } from "react";
import { formatRelative } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/AlertDialog";
import { useToast } from "@/hooks/useToast";
import { deletePost } from "@/actions/post";
import { Button, buttonVariants } from "./ui/Button";
import { useDeletePostModal } from "@/hooks/useDeletePostModal";

const DeletePostModal = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { isOpen, post, close } = useDeletePostModal();
    const [isLoading, startTransition] = useTransition();

    const handleDelete = () => {
        const payload = { postId: post.id };

        startTransition(() => {
            deletePost(payload).then((data) => {
                if (data.success) {
                    close();
                    toast({
                        title: "Success",
                        description: data.success
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["posts", post.id]
                    });
                }
                if (data.error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: data.error
                    });
                }
            }).catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message
                });
            });
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={close}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-bold tracking-tight">
                        Delete Post?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the following post and all the comments associated with it.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="w-full border rounded-md">
                    <div className="flex items-center gap-2 p-4">
                        <UserAvatar
                            image={post.creatorImage}
                            username={post.creatorUsername}
                        />
                        <p className="text-[13px] flex items-center gap-0.5">
                            <div className="text-accent-foreground font-semibold">
                                {post.creatorUsername}
                            </div>
                            <Dot className="size-4" />
                            <span className="text-xs capitalize text-zinc-400 font-semibold">
                                {formatRelative(post.createdAt, new Date())}
                                {post.isEdited && " (Edited)"}
                            </span>
                        </p>
                    </div>
                    <div className="px-4 pt-0 pb-4">
                        <h3 className="font-semibold text-base text-black mb-2 line-clamp-1">
                            {post.title}
                        </h3>
                        <p className="text-sm leading-6 font-medium text-zinc-800 line-clamp-3">
                            {post.description}
                        </p>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel className={cn(buttonVariants({
                        size: "lg",
                        variant: "outline"
                    }))}>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        size="lg"
                        onClick={handleDelete}
                        isLoading={isLoading}
                    >
                        {isLoading ? "Deleting" : "Confirm"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default DeletePostModal;