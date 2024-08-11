import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";
import { LinkIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import { cn, setLink } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { replyOnComment } from "@/actions/reply";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSigninModal } from "@/hooks/useSigninModal";

interface ReplyInputProps {
    postId: string;
    commentId: string;
    setIsReplyOpen: Dispatch<SetStateAction<boolean>>;
}

const ReplyInput = ({
    postId,
    commentId,
    setIsReplyOpen
}: ReplyInputProps) => {
    const user = useCurrentUser();
    const queryClient = useQueryClient();
    const isSignedIn = !!(user && user.id);
    const { toast } = useToast();
    const { open, setPathToRedirect } = useSigninModal();

    const {
        mutate: handleReply,
        isPending
    } = useMutation({
        mutationFn: async () => {
            const payload = { commentId, reply: editor?.getHTML() || "" };
            const data = await replyOnComment(payload);
            return data;
        },
        onSuccess: (data) => {
            setIsReplyOpen(false);
            toast({
                title: "Success",
                description: data.success
            });
            queryClient.invalidateQueries({
                queryKey: ["posts", postId]
            });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Failed to reply",
                description: error.message
            });
        }
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https"
            }),
            Placeholder.configure({
                placeholder: "Add a reply",
                emptyEditorClass: "cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-2 before:left-3 before:text-muted-foreground before-pointer-events-none"
            })
        ],
        editorProps: {
            attributes: {
                class: cn(
                    "min-h-[64px] max-h-[20rem] text-sm leading-6 font-medium px-3 py-2 overflow-y-auto focus:outline-0",
                    isPending && "opacity-50 pointer-events-none cursor-not-allowed"
                )
            }
        }
    });

    if (!editor) return null;

    const commentText = editor.getText();

    return (
        <div className="ml-[92px] mt-3 bg-zinc-50 dark:bg-zinc-900 border rounded-md">
            <EditorContent editor={editor} />
            <div className="flex justify-between p-2">
                <Button
                    variant={editor.isActive("link") ? "secondary" : "outline"}
                    className="size-9 p-0"
                    onClick={() => setLink(editor)}
                    disabled={isPending}
                >
                    <LinkIcon className="size-4" />
                </Button>
                <div>
                    <Button
                        variant="ghost"
                        disabled={isPending || !commentText.length}
                        onClick={() => editor.commands.clearContent()}
                    >
                        Clear
                    </Button>
                    <Button
                        isLoading={isPending}
                        disabled={isPending || commentText.length < 3}
                        onClick={() => {
                            if (isSignedIn) handleReply();
                            else {
                                setPathToRedirect(`/post/${postId}`);
                                open();
                            }
                        }}
                    >
                        {isPending ? "Replying" : "Reply"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReplyInput;