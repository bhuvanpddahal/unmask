import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";
import { LinkIcon } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";

import { cn, setLink } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { commentOnPost } from "@/actions/comment";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSigninModal } from "@/hooks/useSigninModal";

interface CommentInputProps {
    postId: string;
}

const CommentInput = ({
    postId
}: CommentInputProps) => {
    const user = useCurrentUser();
    const queryClient = useQueryClient();
    const isSignedIn = !!(user && user.id);
    const { toast } = useToast();
    const { open, setPathToRedirect } = useSigninModal();

    const {
        mutate: handleComment,
        isPending
    } = useMutation({
        mutationFn: async () => {
            const payload = { postId, comment: editor?.getHTML() || "" };
            const data = await commentOnPost(payload);
            return data;
        },
        onSuccess: (data) => {
            editor?.destroy();
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
                title: "Failed to comment",
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
                placeholder: "Add a comment",
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
        <Card className="sticky bottom-0 p-4 mt-5">
            <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-md">
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
                                if (isSignedIn) handleComment();
                                else {
                                    setPathToRedirect(`/post/${postId}`);
                                    open();
                                }
                            }}
                        >
                            {isPending ? "Posting" : "Post"}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CommentInput;

export const CommentInputLoader = () => (
    <Card className="sticky bottom-0 p-4 mt-5">
        <Skeleton className="bg-zinc-100 dark:bg-zinc-900 w-full">
            <div className="h-[64px] w-full" />
            <div className="flex justify-between p-2">
                <Skeleton className="bg-slate-200/50 dark:bg-slate-800/50 inline-block h-9 w-9" />
                <div className="h-9">
                    <Skeleton className="bg-slate-200/50 dark:bg-slate-800/50 inline-block h-9 w-[65px]" />
                    <Skeleton className="bg-slate-200/50 dark:bg-slate-800/50 inline-block h-9 w-[60px]" />
                </div>
            </div>
        </Skeleton>
    </Card>
);