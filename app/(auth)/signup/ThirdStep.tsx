import {
    Dispatch,
    SetStateAction,
    useState,
    useTransition
} from "react";
import { useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

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
    ThirdStepPayload,
    ThirdStepValidator
} from "@/lib/validators/auth";
import { signup } from "@/actions/auth";
import { useSignup } from "@/context/Signup";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

interface ThirdStepProps {
    setStep: Dispatch<SetStateAction<number>>;
}

const ThirdStep = ({
    setStep
}: ThirdStepProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo");
    const {
        email,
        password,
        setPassword,
        username,
        setUsername
    } = useSignup();
    const { update } = useSession();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<ThirdStepPayload>({
        resolver: zodResolver(ThirdStepValidator),
        defaultValues: {
            password,
            confirmPassword: "",
            username
        }
    });

    const onSubmit = (payload: ThirdStepPayload) => {
        setError("");
        setPassword(payload.password);
        setUsername(payload.username || "");

        const values = {
            email,
            password: payload.password,
            username: payload.username
        };

        startTransition(() => {
            signup(values).then((data) => {
                if (data.user) {
                    update({ ...data.user });
                    setSuccess("Signed up sucessfully");
                    router.push(redirectTo || DEFAULT_LOGIN_REDIRECT);
                }
                if (data.error) {
                    setError(data.error);
                }
            }).catch(() => {
                setError("Something went wrong");
            });
        });
    };

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setStep(1)}
            >
                <ChevronLeft className="size-4 text-zinc-700" />
                Change Email
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-2">
                Create your account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Create a strong password! Hacked accounts cannot be recovered.
            </p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 my-4"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="********"
                                            disabled={isPending}
                                            autoComplete="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="********"
                                            disabled={isPending}
                                            autoComplete="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Nwtb25"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormSuccess message={success} />
                    <FormError message={error} />

                    <Button
                        type="submit"
                        size="lg"
                        isLoading={isPending}
                        className="w-full"
                    >
                        {isPending ? "Creating account" : "Join Unmask"}
                    </Button>
                </form>
            </Form>
        </>
    )
};

export default ThirdStep;