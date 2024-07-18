"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/Form";
import {
    SigninPayload,
    SigninValidator
} from "@/lib/validators/auth";
import { signin } from "@/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const LogInForm = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, startTransition] = useTransition();

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
            signin(payload).then((data) => {
                if (data?.error) {
                    setError(data.error);
                } else {
                    setSuccess("Signed in successfully");
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
                className="space-y-5 my-4"
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
                                        disabled={isPending}
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
                                        placeholder="********"
                                        type="password"
                                        disabled={isPending}
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
                    size="lg"
                    className="w-full"
                    disabled={isPending}
                    isLoading={isPending}
                >
                    {isPending ? "Signing in" : "Sign in"}
                </Button>
            </form>
        </Form>
    )
};

export default LogInForm;