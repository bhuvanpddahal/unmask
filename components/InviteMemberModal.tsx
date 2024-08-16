"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Copy, RefreshCcw } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/Dialog";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useToast } from "@/hooks/useToast";
import { generateNewInviteCode } from "@/actions/channel";
import { useInviteMemberModal } from "@/hooks/useInviteMemberModal";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

const InviteMemberModal = () => {
    const queryClient = useQueryClient();
    const {
        isOpen,
        channelId,
        inviteCode,
        open,
        close
    } = useInviteMemberModal();
    const { toast } = useToast();
    const [isCopied, setIsCopied] = useState(false);
    const [isPending, startTransition] = useTransition();

    const inviteLink = `${baseUrl}/invite/${inviteCode}`;

    const handleCopy = () => {
        if (isCopied) return;

        navigator.clipboard.writeText(inviteLink);
        setIsCopied(true);
        
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    };

    const generateNewLink = () => {
        startTransition(async () => {
            const data = await generateNewInviteCode({ inviteCode });
            if (data.inviteCode) {
                open(channelId, data.inviteCode);
                queryClient.invalidateQueries({ queryKey: ["topics", channelId] });
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
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                        Send the following link to the person that you want to invite to this channel.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-x-2">
                    <Input
                        value={inviteLink}
                        className="flex-1 bg-muted text-muted-foreground border-none focus-visible:ring-0 focus-visible:ring-transparent"
                        contentEditable={false}
                    />
                    <Button
                        size="lg"
                        variant="ghost"
                        className="size-10 px-0"
                        onClick={handleCopy}
                    >
                        {isCopied ? (
                            <Check className="size-4" />
                        ) : (
                            <Copy className="size-4" />
                        )}
                    </Button>
                </div>
                <Button
                    size="lg"
                    variant="outline"
                    onClick={generateNewLink}
                    isLoading={isPending}
                >
                    {isPending ? "Generating new link" : (
                        <>
                            <RefreshCcw className="size-4" />
                            Generate new link
                        </>
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default InviteMemberModal;