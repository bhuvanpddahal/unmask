import Link from "next/link";
import {
    Dispatch,
    SetStateAction,
    useState,
    useTransition
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormError from "@/components/FormError";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/Form";
import {
    FirstStepPayload,
    FirstStepValidator
} from "@/lib/validators/auth";
import { useSignup } from "@/context/Signup";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";
import { checkEmailAvailability } from "@/actions/auth";

interface FirstStepProps {
    setStep: Dispatch<SetStateAction<number>>;
}

const FirstStep = ({
    setStep
}: FirstStepProps) => {
    const [error, setError] = useState("");
    const { email, setEmail } = useSignup();
    const [isLoading, startTransition] = useTransition();

    const form = useForm<FirstStepPayload>({
        resolver: zodResolver(FirstStepValidator),
        defaultValues: {
            email
        }
    });

    const onSubmit = (payload: FirstStepPayload) => {
        setError("");
        setEmail(payload.email);

        startTransition(() => {
            checkEmailAvailability(payload).then((data) => {
                if (data.success) {
                    setStep(2);
                }
                if (data.error) {
                    setError(data.error);
                }
            });
        });
    };

    return (
        <>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Join the Unmask community
            </h1>
            <p className="text-sm text-slate-500 font-medium">
                To protect anonymity, we do not store emails.
            </p>
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
                                            type="email"
                                            placeholder="example@mail.com"
                                            autoComplete="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormError message={error} />

                    <Button
                        type="submit"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        {isLoading ? "Validating" : "Continue"}
                    </Button>
                </form>
            </Form>
            <Separator />
            <p className="text-sm font-medium text-center mt-4">
                Already a member?
                <Link href="/signin" className="text-primary hover:underline"> Sign in</Link>
            </p>
        </>
    )
};

export default FirstStep;

export const FirstStepLoader = () => {
    return (
        <>
            <Skeleton className="h-5 sm:h-6 w-[250px] sm:w-[320px] my-1 rounded-md" />
            <Skeleton className="h-3.5 w-[300px] my-[3px] rounded-md" />
            <div className="space-y-5 my-4">
                <div className="space-y-1">
                    <Skeleton className="h-3.5 w-10 my-[3px] rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <Separator />
            <div className="flex justify-center mt-4">
                <Skeleton className="h-3.5 w-[130px] my-[3px] rounded-md" />
            </div>
        </>
    )
};