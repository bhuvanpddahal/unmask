import {
    Dispatch,
    SetStateAction,
    useCallback,
    useState,
    useTransition
} from "react";
import { ChevronLeft } from "lucide-react";

import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { cn } from "@/lib/utils";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from "@/components/ui/InputOTP";
import { useSignup } from "@/context/Signup";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { resendToken, verifyEmail } from "@/actions/auth";

interface SecondStepProps {
    setStep: Dispatch<SetStateAction<number>>;
}

const SecondStep = ({
    setStep
}: SecondStepProps) => {
    const { email } = useSignup();
    const [value, setValue] = useState("");
    const [resendError, setResendError] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const [resendSuccess, setResendSuccess] = useState("");
    const [confirmSuccess, setConfirmSuccess] = useState("");
    const [isResendLoading, startResendTransition] = useTransition();
    const [isConfirmLoading, startConfirmTransition] = useTransition();

    const handleConfirm = useCallback(() => {
        setConfirmError("");
        setConfirmSuccess("");
        const payload = { email, token: value };

        startConfirmTransition(() => {
            verifyEmail(payload).then((data) => {
                if (data.success) {
                    setConfirmSuccess(data.success);
                    setStep(3);
                }
                if (data.error) {
                    setConfirmError(data.error);
                }
            }).catch(() => {
                setConfirmError("Something went wrong");
            });
        });
    }, [email, value, setStep]);

    const handleResendEmail = useCallback(() => {
        setResendError("");
        setResendSuccess("");
        const payload = { email };

        startResendTransition(() => {
            resendToken(payload).then((data) => {
                if (data.success) {
                    setResendSuccess(data.success);
                }
                if (data.error) {
                    setResendError(data.error);
                }
            }).catch(() => {
                setResendError("Something went wrong");
            });
        });
    }, [email]);

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setStep(1)}
            >
                <ChevronLeft className="size-4 text-zinc-700 mr-1" />
                Back
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-2">
                Verify your email
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Please enter the code below to verify your email.
            </p>
            <div className="flex justify-center mt-4 mb-5">
                <InputOTP
                    maxLength={6}
                    value={value}
                    onChange={setValue}
                    disabled={isConfirmLoading || isResendLoading}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                        <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                        <InputOTPSlot index={4} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>

            <FormSuccess message={confirmSuccess} className="mb-5" />
            <FormError message={confirmError} className="mb-5" />

            <Button
                size="lg"
                className="w-full"
                onClick={handleConfirm}
                disabled={isConfirmLoading || isResendLoading}
                isLoading={isConfirmLoading}
            >
                {isConfirmLoading ? "Verifying" : "Confirm"}
            </Button>
            <Separator className="mt-4" />
            <p className="text-sm font-medium text-center mt-4">
                Didn&apos;t receive an email?{" "}
                <span
                    className={cn(
                        "text-primary",
                        (isConfirmLoading || isResendLoading) ? "text-zinc-600 pointer-events-none" : "cursor-pointer hover:underline"
                    )}
                    onClick={handleResendEmail}
                >
                    {isResendLoading ? "Resending..." : "Resend Code"}
                </span>
            </p>
            {resendSuccess && (
                <p className="text-emerald-500 italic text-center text-[13px]">
                    {resendSuccess}
                </p>
            )}
            {resendError && (
                <p className="text-destructive italic text-center text-[13px]">
                    {resendError}
                </p>
            )}
        </>
    )
};

export default SecondStep;