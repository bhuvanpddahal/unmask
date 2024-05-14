"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import {
    SigninPayload,
    SigninValidator
} from "@/lib/validators/auth";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signinWithEmail } from "@/actions/auth";

const LogInForm = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, startTransition] = useTransition();

    const form = useForm<SigninPayload>({
        resolver: zodResolver(SigninValidator),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (payload: SigninPayload) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            signinWithEmail(payload).then((data) => {
                if (data?.success) {
                    setSuccess(data.success);
                    if (data?.userId) {
                        router.push(`/verify-email?userId=${data.userId}`);
                    } else {
                        router.push("/dashboard");
                    }
                    form.reset();
                }
                if (data?.error) {
                    setError(data.error);
                }
            }).catch(() => {
                setError("Something went wrong");
            });
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 mt-4"
            >
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="example@mail.com"
                                        type="email"
                                        disabled={isLoading}
                                        autoComplete="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="*****"
                                        type="password"
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormError message={error} />
                <FormSuccess message={success} />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    {isLoading ? "Signing in" : "Sign in"}
                </Button>
            </form>
        </Form>
    )
};

export default LogInForm;