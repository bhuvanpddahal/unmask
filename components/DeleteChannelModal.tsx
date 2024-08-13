"use client";

import { Dot } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { deleteChannel } from "@/actions/channel";
import { Button, buttonVariants } from "./ui/Button";
import { useDeleteChannelModal } from "@/hooks/useDeleteChannelModal";

const consequences = [
    "All of your channel's posts will be unlinked from the channel.",
    "Your channel's information, including its name, description, and images, will be permanently deleted.",
    "All the followers will be removed from your channel.",
    "Your channel's followers will no longer be able to see or interact with your channel."
];

const DeleteChannelModal = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { isOpen, channelId, close } = useDeleteChannelModal();
    const [isLoading, startTransition] = useTransition();

    const handleDelete = () => {
        const payload = { channelId: channelId || "" };

        startTransition(() => {
            deleteChannel(payload).then((data) => {
                if (data.success) {
                    close();
                    toast({
                        title: "Success",
                        description: data.success
                    });
                    queryClient.invalidateQueries({ queryKey: ["/"] });
                    queryClient.invalidateQueries({ queryKey: ["polls"] });
                    queryClient.invalidateQueries({ queryKey: ["topics"] });
                    router.push("/topics");
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
        <AlertDialog open={isOpen} onOpenChange={close}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-bold tracking-tight">
                        Delete Channel?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Deleting your channel is permanent and cannot be undone. All your followers and channel information will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <h3 className="text-sm font-semibold">
                        Consequences of deleting your channel:
                    </h3>
                    <ul className="mt-3 space-y-1">
                        {consequences.map((consequence) => (
                            <li key={consequence} className="flex gap-x-2">
                                <Dot className="shrink-0 size-4" />
                                <span className="text-sm">{consequence}</span>
                            </li>
                        ))}
                    </ul>
                    <AlertDialogDescription className="mt-3">
                        Please be aware that this action is irreversible.
                    </AlertDialogDescription>
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
    );
};

export default DeleteChannelModal;