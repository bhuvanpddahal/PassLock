"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    SigninPayload,
    SigninValidator
} from "@/lib/validators/auth";
import { signIn } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignupPage = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, startTransition] = useTransition();

    const form = useForm<SigninPayload>({
        resolver: zodResolver(SigninValidator),
        defaultValues: {
            email: "",
            masterPassword: ""
        }
    });

    const onSubmit = (payload: SigninPayload) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            signIn(payload).then((data) => {
                if (data?.error) {
                    setError(data.error);
                }
                if (data?.success) {
                    setSuccess(data.success);
                    router.push("/dashboard");
                }
            }).catch(() => {
                setError("Something went wrong");
            });
        });
    };

    return (
        <div className="flex-1 px-2 py-7 flex items-center justify-center">
            <div className="flex flex-col items-center gap-y-3 shadow-md rounded-lg p-6 bg-white max-w-xl w-full">
                <h2 className="text-2xl font-bold text-zinc-800">Sign in to PassLock</h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                    >
                        <div className='flex flex-col gap-y-6'>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <h3>Email</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="masterPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <h3>Master password</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormError message={error} />
                            <FormSuccess message={success} />

                            <Button
                                type="submit"
                                disabled={isLoading}
                                isLoading={isLoading}
                            >
                                {isLoading ? "Signing in" : "Sign in"}
                            </Button>
                        </div>
                    </form>
                </Form>
                <p className="text-sm text-zinc-600">
                    If you don't have an account,
                    <Link href="/signup" className="text-primary ml-1 hover:underline">create a new one</Link>.
                </p>
            </div>
        </div>
    )
};

export default SignupPage;