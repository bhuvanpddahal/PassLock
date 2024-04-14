import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const cookie = req.cookies.get("user");
    const response = NextResponse.next();

    if (!cookie) {
        return NextResponse.redirect(
            new URL("/signin", req.url)
        );
    }

    return response;
}

export const config = {
    matcher: [
        "/dashboard"
    ]
};