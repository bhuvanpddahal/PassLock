"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { useCookies } from "next-client-cookies";
import { PostHogProvider } from "posthog-js/react";

interface Props {
    children: React.ReactNode;
}

if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    });
}

export function CSPostHogProvider({ children }: Props) {
    return (
        <PostHogProvider client={posthog}>
            <PostHogAuthWrapper>
                {children}
            </PostHogAuthWrapper>
        </PostHogProvider>
    )
}

function PostHogAuthWrapper({ children }: Props) {
    const cookies = useCookies();
    const userString = cookies.get("user");

    useEffect(() => {
        if (userString) {
            const user = JSON.parse(userString);
            posthog.identify(user.id, {
                name: user.name,
                email: user.email
            });
        } else {
            posthog.reset();
        }
    });

    return children;
}