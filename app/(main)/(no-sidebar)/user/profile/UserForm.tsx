"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { ChangeEvent, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/Form";
import {
    UpdateUserPayload,
    UpdateUserValidator
} from "@/lib/validators/auth";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { updateUser } from "@/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const UserForm = () => {
    const { toast } = useToast();
    const { data, update } = useSession();
    const [isPending, startTransition] = useTransition();

    const user = data?.user;

    const form = useForm<UpdateUserPayload>({
        resolver: zodResolver(UpdateUserValidator),
        defaultValues: {
            username: user?.username || "",
            image: undefined,
            newPassword: undefined
        }
    });

    const handleImgChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                form.setValue("image", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetValues = () => {
        form.setValue("username", user?.username || "");
        form.setValue("image", undefined);
        form.setValue("newPassword", undefined);
    };

    const onSubmit = (payload: UpdateUserPayload) => {
        startTransition(() => {
            updateUser(payload).then((data) => {
                if (data.success) {
                    update({
                        ...user,
                        username: payload.username,
                        image: payload.image || user?.image
                    });
                    toast({
                        title: "Success",
                        description: data.success
                    });
                    resetValues();
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
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
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
                        name="image"
                        render={() => (
                            <FormItem>
                                <FormLabel className="space-y-1.5">
                                    <p className="inline text-sm font-medium">
                                        Image
                                    </p>
                                    <div className={cn(
                                        "relative h-[300px] w-full border rounded-md cursor-pointer overflow-hidden",
                                        form.getValues("image") || user?.image
                                            ? "border-solid"
                                            : "border-dashed flex items-center justify-center"
                                    )}>
                                        {form.getValues("image") || user?.image ? (
                                            <Image
                                                src={form.getValues("image") || user?.image || ""}
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
                                        onChange={handleImgChange}
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
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        value={form.getValues("newPassword") || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length) {
                                                form.setValue("newPassword", value);
                                            } else {
                                                form.setValue("newPassword", undefined);
                                            }
                                        }}
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                                <p className="text-xs text-zinc-500 mt-1">
                                    Make sure you remember the new password if you want to change the current one.
                                </p>
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
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        isLoading={isPending}
                    >
                        {isPending ? "Saving" : "Save"}
                    </Button>
                </div>
            </form>
        </Form>
    )
};

export default UserForm;