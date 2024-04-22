import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { resendToken, verifyEmail } from "@/actions/auth";


interface OTPInputFormProps {
    userId: string;
}

const OTPInputForm = ({ userId }: OTPInputFormProps) => {
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
        console.log(payload);

        startConfirmTransition(() => {
            verifyEmail(payload).then((data) => {
                if (data.error) {
                    setError(data.error);
                }
                if (data.success) {
                    setSuccess(data.success);
                    router.push("/dashboard");
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
                if (data.error) {
                    setError(data.error);
                }
                if (data.success) {
                    setSuccess(data.success);
                }
            }).catch(() => {
                setError("Something went wrong");
            });
        });
    }, [userId]);

    return (
        <>
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

            <FormSuccess message={success} className="mt-4" />
            <FormError message={error} className="mt-4" />

            <Button
                className="w-full mt-5 mb-3"
                onClick={handleConfirm}
                isLoading={isConfirmLoading}
            >
                {isConfirmLoading ? "Confirming" : "Confirm"}
            </Button>
            <Button
                className="w-full mb-4"
                variant="outline"
                onClick={handleResendEmail}
                isLoading={isResendLoading}
            >
                {isResendLoading ? "Resending email" : "Resend email"}
            </Button>
        </>
    )
};

export default OTPInputForm;