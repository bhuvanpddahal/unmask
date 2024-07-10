import Image from "next/image";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useTransition
} from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/Form";
import {
    CreatePostPayload,
    CreatePostValidator
} from "@/lib/validators/post";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { createPost } from "@/actions/post";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface PostFormProps {
    setHasImage: Dispatch<SetStateAction<boolean>>;
    hasPoll: boolean;
    setHasPoll: Dispatch<SetStateAction<boolean>>;
}

const PostForm = ({
    setHasImage,
    hasPoll,
    setHasPoll
}: PostFormProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, startTransition] = useTransition();

    const form = useForm<CreatePostPayload>({
        resolver: zodResolver(CreatePostValidator),
        defaultValues: {
            title: "",
            description: "",
            image: undefined,
            pollOptions: undefined
        }
    });

    const handleImgChange = (
        e: ChangeEvent<HTMLInputElement>,
        form: UseFormReturn<CreatePostPayload, any, undefined>
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
        form.setValue("pollOptions", undefined);
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
        console.log({ filteredOptions });
        form.setValue("pollOptions", filteredOptions);
    };

    const updateOption = (index: number, value: string) => {
        const updatedOptions = (form.getValues("pollOptions") ?? [])
            .map((option, i) => i === index ? value : option);
        form.setValue("pollOptions", updatedOptions);
    };

    const onSubmit = (payload: CreatePostPayload) => {
        startTransition(() => {
            createPost(payload).then((data) => {
                if (data.success) {
                    toast({
                        title: "Success",
                        description: data.success
                    });
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

    useEffect(() => {
        if (hasPoll) {
            form.setValue("pollOptions", ["", ""]);
        }
    }), [hasPoll];

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
                                        className="h-20 text-3xl px-0 border-0 focus-visible:ring-0"
                                        disabled={isLoading}
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
                                    <Textarea
                                        {...field}
                                        placeholder="Description"
                                        rows={16}
                                        className="text-lg px-0 border-0 focus-visible:ring-0"
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
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
                                            <div className="relative h-[300px] w-full border rounded-md rounded-se-none cursor-pointer">
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
                                        disabled={isLoading}
                                        accept="image/*"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {form.getValues("pollOptions") && (
                        <FormField
                            control={form.control}
                            name="pollOptions"
                            render={() => (
                                <FormItem className="mt-12">
                                    <FormControl>
                                        <div className="relative border rounded-md p-4">
                                            <div
                                                className="bg-border absolute bottom-full right-0 p-1 rounded-t-md cursor-pointer hover:bg-accent"
                                                onClick={() => {
                                                    setHasPoll(false);
                                                    form.setValue("pollOptions", undefined);
                                                }}
                                            >
                                                <X className="size-5" />
                                            </div>
                                            <ul className="space-y-3">
                                                {form.getValues("pollOptions")?.map((option, index) => (
                                                    <li key={index} className="flex items-center gap-x-2 border rounded-sm px-4">
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
                        className="h-[50px] w-[200px] text-[15px]"
                        onClick={resetValues}
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        className="h-[50px] w-[200px] text-[15px]"
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        {isLoading ? "Creating Post" : "Create Post"}
                    </Button>
                </div>
            </form>
        </Form>
    )
};

export default PostForm;