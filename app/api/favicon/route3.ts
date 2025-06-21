import { NextRequest, NextResponse } from "next/server";

const MAX_AGE = 60 * 60 * 24 * 7;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const siteLink = searchParams.get("siteLink");

    if (!siteLink) {
        return NextResponse.json({ error: "siteLink query parameter is required" }, { status: 400 });
    }

    try {
        const url = new URL(siteLink);
        const faviconUrl = `https://icons.duckduckgo.com/ip3/${url.host}.ico`;

        const response = await fetch(faviconUrl);

        if (!response.ok) {
            return new NextResponse(null, {
                status: response.status,
                headers: {
                    "Cache-Control": `public, max-age=${MAX_AGE}, immutable`,
                    "Content-Type": "application/json"
                }
            });
        }

        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get("Content-Type") || "image/x-icon";

        const headers = {
            "Cache-Control": `public, max-age=${MAX_AGE}, immutable`,
            "Content-Type": contentType,
            "Content-Length": Buffer.byteLength(Buffer.from(imageBuffer)).toString(),
        };

        return new NextResponse(Buffer.from(imageBuffer), { headers });

    } catch (error) {
        console.error("Error fetching favicon:", error);
        return NextResponse.json({ error: "Failed to fetch favicon" }, { status: 500 });
    }
}