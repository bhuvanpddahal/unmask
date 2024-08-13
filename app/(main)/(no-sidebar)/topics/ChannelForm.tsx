"use client";

import Image from "next/image";
import { ChangeEvent } from "react";
import { ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/Form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import {
    UpsertChannelPayload,
    UpsertChannelValidator
} from "@/lib/validators/channel";
import { channelTypes } from "@/constants";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";

interface ChannelFormProps {
    defaultValues: UpsertChannelPayload;
    onSubmit: (payload: UpsertChannelPayload) => void;
    isPending: boolean;
    submitBtnText: string;
    pendingSubmitBtnText: string;
}

const ChannelForm = ({
    defaultValues,
    onSubmit,
    isPending,
    submitBtnText,
    pendingSubmitBtnText
}: ChannelFormProps) => {
    const form = useForm<UpsertChannelPayload>({
        resolver: zodResolver(UpsertChannelValidator),
        defaultValues
    });

    const handleImgChange = (
        e: ChangeEvent<HTMLInputElement>,
        property: "bannerImage" | "profileImage"
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                form.setValue(property, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetValues = () => {
        form.setValue("name", "");
        form.setValue("description", undefined);
        form.setValue("type", "general");
        form.setValue("bannerImage", undefined);
        form.setValue("profileImage", undefined);
        form.setValue("visibility", "public");
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={isPending}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.entries(channelTypes).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        rows={3}
                                        value={form.getValues("description") || ""}
                                        className="max-h-[200px] bg-white dark:bg-black"
                                        onChange={(e) => field.onChange(e.target.value.length ? e.target.value : undefined)}
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Visibility</FormLabel>
                                <FormControl>
                                    <div className={cn(
                                        "flex items-center justify-between",
                                        isPending && "opacity-50 pointer-events-none cursor-not-allowed"
                                    )}>
                                        <Label
                                            htmlFor="visibility-switch"
                                            className="font-semibold"
                                        >
                                            Private
                                        </Label>
                                        <Switch
                                            id="visibility-switch"
                                            checked={field.value === "private"}
                                            onCheckedChange={(checked) => form.setValue("visibility", checked ? "private" : "public")}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Creating a private channel means only invited members can see and participate in its conversations. Information shared within a private channel is not visible to other team members.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bannerImage"
                        render={() => (
                            <FormItem>
                                <FormLabel className="space-y-1.5">
                                    <p className="inline text-sm font-medium">
                                        Banner Image (Optional)
                                    </p>
                                    <div className={cn(
                                        "relative h-[300px] w-full dark:bg-black border rounded-md cursor-pointer overflow-hidden",
                                        form.getValues("bannerImage") ? "border-solid" : "border-dashed flex items-center justify-center",
                                        isPending && "opacity-50 pointer-events-none cursor-not-allowed"
                                    )}>
                                        {form.getValues("bannerImage") ? (
                                            <Image
                                                src={form.getValues("bannerImage") || ""}
                                                alt="Image"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-y-1 text-zinc-400">
                                                <ImageIcon className="size-5" />
                                                <span className="text-[13px]">
                                                    Click to upload an image
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleImgChange(e, "bannerImage")}
                                        disabled={isPending}
                                        accept="image/*"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="profileImage"
                        render={() => (
                            <FormItem>
                                <FormLabel className="space-y-1.5">
                                    <p className="inline text-sm font-medium">
                                        Profile Image (Optional)
                                    </p>
                                    <div className={cn(
                                        "relative h-[300px] w-full dark:bg-black border rounded-md cursor-pointer overflow-hidden",
                                        form.getValues("profileImage") ? "border-solid" : "border-dashed flex items-center justify-center",
                                        isPending && "opacity-50 pointer-events-none cursor-not-allowed"
                                    )}>
                                        {form.getValues("profileImage") ? (
                                            <Image
                                                src={form.getValues("profileImage") || ""}
                                                alt="Image"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-y-1 text-zinc-400">
                                                <ImageIcon className="size-5" />
                                                <span className="text-[13px]">
                                                    Click to upload an image
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleImgChange(e, "profileImage")}
                                        disabled={isPending}
                                        accept="image/*"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-y-2 mt-5">
                    <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={resetValues}
                        disabled={isPending}
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        isLoading={isPending}
                    >
                        {isPending ? pendingSubmitBtnText : submitBtnText}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ChannelForm;

export const ChannelFormLoader = () => (
    <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-4">
            <div className="pt-[3px] space-y-[7px]">
                <Skeleton className="h-3.5 w-10" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="pt-[3px] space-y-[7px]">
                <Skeleton className="h-3.5 w-8" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="pt-[3px] space-y-[7px]">
                <Skeleton className="h-3.5 w-[149px]" />
                <Skeleton className="h-20 w-full" />
            </div>
            <div className="pt-[3px]">
                <Skeleton className="h-3.5 w-14" />
                <div className="flex items-center justify-between mt-[7px]">
                    <Skeleton className="h-3.5 w-[47px]" />
                    <Skeleton className="h-6 w-11 rounded-full" />
                </div>
                <div className="pt-1.5 pb-0.5 space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <div className="pt-[3px] space-y-[7px]">
                <Skeleton className="h-3.5 w-[163px]" />
                <Skeleton className="h-[300px] w-full" />
            </div>
            <div className="pt-[3px] space-y-[7px]">
                <Skeleton className="h-3.5 w-[158px]" />
                <Skeleton className="h-[300px] w-full" />
            </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-y-2 mt-5">
            <Skeleton className="h-10 w-full sm:w-[102px]" />
            <Skeleton className="h-10 w-full sm:w-[91px]" />
        </div>
    </div>
);