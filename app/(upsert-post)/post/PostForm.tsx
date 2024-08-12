import Image from "next/image";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect
} from "react";
import { TriangleAlert, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";

import TextEditor from "./TextEditor";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/Form";
import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/Alert";
import {
    UpsertPostPayload,
    UpsertPostValidator
} from "@/lib/validators/post";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface PostFormProps {
    setHasImage: Dispatch<SetStateAction<boolean>>;
    hasPoll: boolean;
    setHasPoll: Dispatch<SetStateAction<boolean>>;
    channelId?: string;
    defaultValues: UpsertPostPayload;
    onSubmit: (payload: UpsertPostPayload) => void;
    isPending: boolean;
    submitBtnText: string;
    pendingSubmitBtnText: string;
}

const PostForm = ({
    setHasImage,
    hasPoll,
    setHasPoll,
    channelId,
    defaultValues,
    onSubmit,
    isPending,
    submitBtnText,
    pendingSubmitBtnText
}: PostFormProps) => {
    const form = useForm<UpsertPostPayload>({
        resolver: zodResolver(UpsertPostValidator),
        defaultValues
    });

    const handleImgChange = (
        e: ChangeEvent<HTMLInputElement>,
        form: UseFormReturn<UpsertPostPayload, any, undefined>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setHasImage(true);
                form.setValue("image", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetValues = () => {
        setHasImage(false);
        setHasPoll(false);
        form.setValue("title", "");
        form.setValue("description", "");
        form.setValue("image", undefined);
        if (!defaultValues.id) form.setValue("pollOptions", undefined);
    };

    const addNewOption = () => {
        form.setValue("pollOptions", [
            ...(form.getValues("pollOptions") ?? []),
            ""
        ]);
    };

    const removeOption = (index: number) => {
        const filteredOptions = (form.getValues("pollOptions") ?? [])
            .filter((_, i) => i !== index);
        form.setValue("pollOptions", filteredOptions);
    };

    const updateOption = (index: number, value: string) => {
        const updatedOptions = (form.getValues("pollOptions") ?? [])
            .map((option, i) => i === index ? value : option);
        form.setValue("pollOptions", updatedOptions);
    };

    useEffect(() => {
        if (hasPoll) {
            if (!form.getValues("pollOptions")) {
                form.setValue("pollOptions", ["", ""]);
            }
        }
        if (channelId) {
            form.setValue("channelId", channelId);
        }
    }, [hasPoll, channelId, form]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="my-4"
            >
                <div>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Title"
                                        className="bg-transparent dark:bg-transparent h-20 text-3xl px-0 border-0 focus-visible:ring-0"
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="mt-4">
                                <FormControl>
                                    <TextEditor
                                        content={field.value}
                                        onChange={field.onChange}
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={() => (
                            <FormItem className="relative mt-12">
                                {form.getValues("image") && (
                                    <>
                                        <div
                                            className="bg-border absolute bottom-full right-0 p-1 rounded-t-md cursor-pointer hover:bg-accent"
                                            onClick={() => {
                                                setHasImage(false);
                                                form.setValue("image", undefined);
                                            }}
                                        >
                                            <X className="size-5" />
                                        </div>
                                        <FormLabel>
                                            <div className="relative h-[300px] w-full border rounded-md rounded-se-none cursor-pointer overflow-hidden">
                                                <Image
                                                    src={form.getValues("image") || ""}
                                                    alt="Image"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </FormLabel>
                                    </>
                                )}
                                <FormControl>
                                    <Input
                                        id="image-input"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleImgChange(e, form)}
                                        disabled={isPending}
                                        accept="image/*"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {hasPoll && (
                        <FormField
                            control={form.control}
                            name="pollOptions"
                            render={() => (
                                <FormItem className="mt-12">
                                    <FormControl>
                                        <div className={cn(
                                            "relative border rounded-md p-4",
                                            !!defaultValues.id && "opacity-50 cursor-not-allowed pointer-events-none"
                                        )}>
                                            {!defaultValues.id && (
                                                <>
                                                    <div
                                                        className="bg-border absolute bottom-full right-0 p-1 rounded-t-md cursor-pointer hover:bg-accent"
                                                        onClick={() => {
                                                            setHasPoll(false);
                                                            form.setValue("pollOptions", undefined);
                                                        }}
                                                    >
                                                        <X className="size-5" />
                                                    </div>
                                                    <Alert className="bg-yellow-200 mb-3 dark:text-black">
                                                        <TriangleAlert className="h-5 w-5 dark:text-black" />
                                                        <AlertTitle>Heads Up: Poll Can&apos;t Be Edited After Posting!</AlertTitle>
                                                        <AlertDescription>
                                                            This is a friendly reminder that once you create a poll in your Unmask post, you won&apos;t be able to edit it afterwards. So for best results, take your time crafting your poll to avoid any need for edits later.
                                                        </AlertDescription>
                                                    </Alert>
                                                </>
                                            )}
                                            <ul className="space-y-3">
                                                {form.getValues("pollOptions")?.map((option, index) => (
                                                    <li key={index} className="bg-white dark:bg-black flex items-center gap-x-2 border rounded-sm px-4">
                                                        <X
                                                            className={cn(
                                                                "size-8 p-2 rounded-full cursor-pointer hover:bg-muted",
                                                                (form.getValues("pollOptions")?.length ?? 0) < 3 && "opacity-50 pointer-events-none"
                                                            )}
                                                            onClick={() => removeOption(index)}
                                                        />
                                                        <Input
                                                            type="text"
                                                            value={option}
                                                            placeholder={`Option ${index + 1}`}
                                                            className="h-[50px] text-lg px-0 border-0 focus-visible:ring-0"
                                                            onChange={(e) => updateOption(index, e.target.value)}
                                                        />
                                                    </li>
                                                ))}
                                                <FormMessage />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="w-full h-[50px] shadow"
                                                    onClick={addNewOption}
                                                    disabled={(form.getValues("pollOptions")?.length ?? 0) === 6}
                                                >
                                                    Add Option
                                                </Button>
                                            </ul>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <div className="sticky bottom-0 bg-background flex flex-col-reverse sm:flex-row sm:justify-between gap-y-2 mt-5 py-5 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-[45px] sm:h-[50px] w-full sm:w-[200px] text-[15px]"
                        onClick={resetValues}
                        disabled={isPending}
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        className="h-[45px] sm:h-[50px] w-full sm:w-[200px] text-[15px]"
                        disabled={isPending}
                        isLoading={isPending}
                    >
                        {isPending ? pendingSubmitBtnText : submitBtnText}
                    </Button>
                </div>
            </form>
        </Form>
    )
};

export default PostForm;