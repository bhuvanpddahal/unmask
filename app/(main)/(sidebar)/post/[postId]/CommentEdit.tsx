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
import { editComment } from "@/actions/comment";

interface CommentEditProps {
    postId: string;
    commentId: string;
    currentComment: string;
    setIsEditOpen: Dispatch<SetStateAction<boolean>>;
}

const CommentEdit = ({
    postId,
    commentId,
    currentComment,
    setIsEditOpen
}: CommentEditProps) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const {
        mutate: handleEditComment,
        isPending
    } = useMutation({
        mutationFn: async () => {
            const payload = { commentId, editedComment: editor?.getHTML() || "" };
            const data = await editComment(payload);
            return data;
        },
        onSuccess: (data) => {
            setIsEditOpen(false);
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
                title: "Failed to edit comment",
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
                placeholder: "Edit comment",
                emptyEditorClass: "cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-2 before:left-3 before:text-muted-foreground before-pointer-events-none"
            })
        ],
        content: currentComment,
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
        <div className="mt-3 bg-white dark:bg-card border rounded-md">
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
                        onClick={() => handleEditComment()}
                    >
                        {isPending ? "Editing" : "Edit"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CommentEdit;