import path from "path";
import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";

const SUCCESS_AND_404_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const hostname = searchParams.get("hostname");

    const servePadlock = async (cache: boolean = false) => {
        try {
            const fallbackPath = path.join(process.cwd(), "public", "padlock.png");
            const fallbackImageBuffer = await fs.readFile(fallbackPath);
            const headers: HeadersInit = {
                "Content-Type": "image/png",
                "Content-Length": Buffer.byteLength(fallbackImageBuffer).toString(),
            };
            if (cache) {
                headers["Cache-Control"] = `public, max-age=${SUCCESS_AND_404_MAX_AGE}, immutable`;
            } else {
                headers["Cache-Control"] = "no-store, no-cache, must-revalidate, proxy-revalidate";
                headers["Pragma"] = "no-cache";
                headers["Expires"] = "0";
            }
            return new NextResponse(fallbackImageBuffer, { status: 200, headers });
        } catch (readError) {
            console.error("Failed to read padlock.png:", readError);
            return NextResponse.json({ error: "Internal server error: Could not load fallback image" }, { status: 500 });
        }
    };

    if (!hostname) {
        // If hostname is missing, this is a client-side error, return padlock without caching
        return servePadlock(false);
    }

    const faviconUrl = `https://icons.duckduckgo.com/ip3/${hostname}.ico`;

    try {
        const response = await fetch(faviconUrl);

        if (!response.ok) {
            console.warn(`DuckDuckGo returned ${response.status} for ${faviconUrl}. Serving padlock.`);
            // DuckDuckGo returned a bad response (e.g., 404, 500), serve padlock and cache it
            return servePadlock(true);
        }

        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get("Content-Type") || "image/x-icon";

        const headers: HeadersInit = {
            "Cache-Control": `public, max-age=${SUCCESS_AND_404_MAX_AGE}, immutable`,
            "Content-Type": contentType,
            "Content-Length": Buffer.byteLength(Buffer.from(imageBuffer)).toString(),
        };

        return new NextResponse(Buffer.from(imageBuffer), { status: 200, headers });

    } catch (error) {
        console.error("Runtime error fetching favicon from DuckDuckGo:", faviconUrl, error);
        // Any other runtime error (network, DNS, etc.), serve padlock without caching
        return servePadlock(false);
    }
}