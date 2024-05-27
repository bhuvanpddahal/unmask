import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot
} from "@/components/ui/InputOTP";
import { Button } from "@/components/ui/Button";
import { resendToken, verifyEmail } from "@/actions/auth";

interface VerificationFormProps {
    userId: string;
}

const VerificationForm = ({ userId }: VerificationFormProps) => {
    const router = useRouter();
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isResendLoading, startResendTransition] = useTransition();
    const [isConfirmLoading, startConfirmTransition] = useTransition();

    const handleConfirm = useCallback(() => {
        setError("");
        setSuccess("");
        const payload = { userId, token: value };

        startConfirmTransition(() => {
            verifyEmail(payload).then((data) => {
                if (data?.error) {
                    setError(data.error);
                }
            }).catch(() => {
                setError("Something went wrong");
            });
        });
    }, [userId, value, router]);

    const handleResendEmail = useCallback(() => {
        setError("");
        setSuccess("");
        const payload = { userId };

        startResendTransition(() => {
            resendToken(payload).then((data) => {
                if (data.success) {
                    setSuccess(data.success);
                }
                if (data.error) {
                    setError(data.error);
                }
            }).catch(() => {
                setError("Something went wrong");
            });
        });
    }, [userId]);

    return (
        <>
            <div className="flex justify-center">
                <InputOTP
                    maxLength={6}
                    value={value}
                    onChange={(value) => setValue(value)}
                    disabled={isConfirmLoading || isResendLoading}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>

            <FormSuccess message={success} className="mt-4" />
            <FormError message={error} className="mt-4" />

            <div className="space-y-3">
                <Button
                    className="w-full"
                    onClick={handleConfirm}
                    disabled={isConfirmLoading || isResendLoading}
                    isLoading={isConfirmLoading}
                >
                    {isConfirmLoading ? "Confirming" : "Confirm"}
                </Button>
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={isConfirmLoading || isResendLoading}
                    isLoading={isResendLoading}
                >
                    {isResendLoading ? "Resending email" : "Resend email"}
                </Button>
            </div>
        </>
    )
};

export default VerificationForm;