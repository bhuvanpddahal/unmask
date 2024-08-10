import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold,
    Italic,
    LinkIcon,
    UnderlineIcon
} from "lucide-react";
import { useCallback } from "react";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface MenuProps {
    disabled: boolean;
}

interface TextEditorProps extends MenuProps {
    content: string;
    onChange: (...event: any[]) => void;
}

const Menu = ({ disabled }: MenuProps) => {
    const { editor } = useCurrentEditor();

    if (!editor) return null;

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({
            href: url,
            target: "_blank",
            class: "text-blue-600 underline cursor-pointer hover:text-blue-500"
        }).run();
    }, [editor]);

    return (
        <div className="flex gap-x-2 mb-4">
            <Button
                type="button"
                variant={editor.isActive("bold") ? "secondary" : "outline"}
                className="size-9 p-0"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={disabled}
            >
                <Bold className="size-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("italic") ? "secondary" : "outline"}
                className="size-9 p-0"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={disabled}
            >
                <Italic className="size-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("underline") ? "secondary" : "outline"}
                className="size-9 p-0"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={disabled}
            >
                <UnderlineIcon className="size-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("link") ? "secondary" : "outline"}
                className="size-9 p-0"
                onClick={setLink}
                disabled={disabled}
            >
                <LinkIcon className="size-4" />
            </Button>
        </div>
    );
};

const TextEditor = ({
    content,
    onChange,
    disabled
}: TextEditorProps) => {
    const extensions = [
        StarterKit,
        Underline,
        Link.configure({
            openOnClick: false,
            autolink: true,
            defaultProtocol: "https"
        }),
        Placeholder.configure({
            placeholder: "Description",
            emptyEditorClass: "cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-2 before:left-3 before:text-muted-foreground before-pointer-events-none"
        })
    ];

    return (
        <EditorProvider
            slotBefore={<Menu disabled={disabled} />}
            extensions={extensions}
            content={content}
            editorProps={{
                attributes: {
                    class: cn(
                        "min-h-[8rem] focus:outline-none",
                        disabled && "opacity-50 pointer-events-none cursor-not-allowed"
                    )
                }
            }}
            onUpdate={(e) => {
                const html = e.editor.getHTML();
                onChange(html);
            }}
            immediatelyRender={false}
        />
    );
};

export default TextEditor;