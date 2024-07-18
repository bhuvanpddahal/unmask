"use client";

import { Dot } from "lucide-react";
import { useTransition } from "react";
import { formatRelative } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

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
import { deleteComment } from "@/actions/comment";
import { Button, buttonVariants } from "./ui/Button";
import { useDeleteCommentModal } from "@/hooks/useDeleteCommentModal";

const DeleteCommentModal = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { isOpen, comment, close } = useDeleteCommentModal();
    const [isLoading, startTransition] = useTransition();

    const handleDelete = () => {
        const payload = { commentId: comment.id };

        startTransition(() => {
            deleteComment(payload).then((data) => {
                if (data.success) {
                    close();
                    toast({
                        title: "Success",
                        description: data.success
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["posts", comment.postId]
                    });
                }
                if (data.error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: data.error
                    });
                }
            }).catch(() => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Something went wrong"
                });
            });
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={close}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-bold tracking-tight">
                        Delete Comment?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the following comment and the replies on this comment.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="bg-accent w-full p-4 border rounded-md rounded-ss-none">
                    <div className="text-xs flex items-center gap-0.5">
                        <span className="text-zinc-500 font-semibold hover:underline">
                            {comment.commenterUsername}
                        </span>
                        <Dot className="size-4 text-zinc-800" />
                        <span className="capitalize text-zinc-400 font-semibold">
                            {formatRelative(comment.commentedAt, new Date())}
                            {comment.isEdited && " (Edited)"}
                        </span>
                    </div>
                    <p className="text-sm text-zinc-800 font-medium mt-0.5 line-clamp-3">
                        {comment.comment}
                    </p>
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

export default DeleteCommentModal;