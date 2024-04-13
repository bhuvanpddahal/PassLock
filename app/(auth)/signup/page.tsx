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
    SignupPayload,
    SignupValidator
} from "@/lib/validators/auth";
import { signUp } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignupPage = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, startTransition] = useTransition();

    const form = useForm<SignupPayload>({
        resolver: zodResolver(SignupValidator),
        defaultValues: {
            name: "",
            email: "",
            masterPassword: ""
        }
    });

    const onSubmit = (payload: SignupPayload) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            signUp(payload).then((data) => {
                if (data?.error) {
                    setError(data.error);
                }
                if (data?.success) {
                    form.reset();
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
                <h2 className="text-2xl font-bold text-zinc-800">Create your account</h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                    >
                        <div className='flex flex-col gap-y-6'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <h3>Name</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                {isLoading ? "Signing up" : "Sign up"}
                            </Button>
                        </div>
                    </form>
                </Form>
                <p className="text-sm text-zinc-600">
                    If you already have an account, try to
                    <Link href="/login" className="text-primary ml-1 hover:underline">Sign in</Link>.
                </p>
            </div>
        </div>
    )
};

export default SignupPage;