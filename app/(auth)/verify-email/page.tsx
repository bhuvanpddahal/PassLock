"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import OTPInputForm from "./otp-input-form";
import { getUserEmail } from "@/actions/auth";

type Data = {
    error: string;
    email?: undefined;
} | {
    email: string;
    error?: undefined;
};

const VerifyEmailPage = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    if (!userId) return (
        <div className="flex flex-col items-center gap-y-2">
            <Image
                src="/error.png"
                alt="Error"
                height={100}
                width={100}
            />
            <h2 className="text-lg font-bold text-zinc-800 text-center">
                Missing User Id!
            </h2>
        </div>
    )

    const {
        data,
        status
    } = useQuery({
        queryKey: ["verify-email", { userId }],
        queryFn: async () => {
            const payload = { userId };
            const data = await getUserEmail(payload);
            return data as Data;
        }
    });

    if (status === "pending") return (
        <Loader2
            className="h-6 w-6 text-primary animate-spin"
        />
    )
    if (!data || data.error) return (
        <div className="flex flex-col items-center gap-y-2">
            <Image
                src="/error.png"
                alt="Error"
                height={100}
                width={100}
            />
            <div>
                <h2 className="text-lg font-bold text-zinc-800 text-center">
                    Something went wrong!
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg text-center">
                    Try refreshing the page. If the error still persists, try signing in.
                </p>
            </div>
        </div>
    )

    return (
        <div className="max-w-xl w-full flex flex-col items-center shadow-md p-5 rounded-lg bg-white">
            <div className="flex items-center gap-3 mb-1">
                <Image
                    src="/logo.png"
                    alt="PassLock Logo"
                    height={40}
                    width={40}
                />
                <h3 className="font-bold text-zinc-800">
                    VERIFY YOUR EMAIL
                </h3>
            </div>

            <p className="text-zinc-500 text-center text-[13px] mb-4">
                We have already sent a code to <span className="font-medium">{data.email}</span>, please check your inbox and insert the code in form below to verify your email.
            </p>

            <OTPInputForm
                userId={userId}
            />

            <p className="text-zinc-500 text-center text-[13px] mb-3">
                Don't worry, it&apos;s only one time. Once your email is verified, you don&apos;t need to do this anymore :)
            </p>
        </div>
    )
};

export default VerifyEmailPage;