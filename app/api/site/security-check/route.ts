import tls from "tls";
import https from "https";
import { URL } from "url";
import { NextRequest, NextResponse } from "next/server";

export type SimplifiedCertificateDetails =
    Partial<
        Pick<
            tls.PeerCertificate,
            "subject" |
            "issuer" |
            "valid_from" |
            "valid_to" |
            "fingerprint" |
            "serialNumber"
        >
    >;

export interface SiteSecurityCheckResponse {
    hostname: string;
    isSecured: boolean;
    securityIssues: string[];
    certificate: SimplifiedCertificateDetails | null;
}

interface ErrorResponse {
    error: string;
}

const API_RESPONSE_CACHE_MAX_AGE = 60 * 60 * 24; // Cache results for 1 day

export async function GET(req: NextRequest): Promise<
    NextResponse<SiteSecurityCheckResponse | ErrorResponse>
> {
    const { searchParams } = new URL(req.url);
    const requestedHostname = searchParams.get("hostname");

    if (!requestedHostname) {
        return NextResponse.json(
            { error: "'requestedHostname' query parameter is required" },
            { status: 400 }
        );
    }

    let siteSecurityIssues: string[] = [];
    let certificateDetails: SimplifiedCertificateDetails | null = null;
    let isHttpsConnectionTrusted = false;

    try {
        await new Promise<void>((resolve) => {
            console.log('inside promise');
            const httpsCheckOptions = {
                hostname: requestedHostname,
                port: 443,
                method: "HEAD", // Only get headers, no body needed
                rejectUnauthorized: false, // Do not reject self-signed for initial inspection, we check `socket.authorized` manually
                timeout: 5000 // 5 seconds timeout for the connection
            };

            const request = https.request(httpsCheckOptions, (res) => {
                console.log('inside request');
                const socket = res.socket as tls.TLSSocket;
                const cert = socket.getPeerCertificate(true); // Get the full certificate chain

                if (!cert) {
                    console.log('inside not cert');
                    siteSecurityIssues.push("No SSL/TLS certificate found on HTTPS port.");
                    isHttpsConnectionTrusted = false;
                } else {
                    console.log('inside else');
                    certificateDetails = {
                        subject: cert.subject,
                        issuer: cert.issuer,
                        valid_from: cert.valid_from,
                        valid_to: cert.valid_to,
                        fingerprint: cert.fingerprint,
                        serialNumber: cert.serialNumber
                    };
                    console.log({ certificateDetails });

                    const now = new Date();
                    const validFrom = new Date(cert.valid_from);
                    const validTo = new Date(cert.valid_to);

                    if (cert.fingerprint === "") {
                        siteSecurityIssues.push("SSL/TLS certificate appears to be invalid or self-signed.");
                    }
                    if (now < validFrom || now > validTo) {
                        siteSecurityIssues.push("SSL/TLS certificate is expired or not yet valid.");
                    }

                    // This is the most crucial check for certificate trust chain
                    if (!socket.authorized) {
                        siteSecurityIssues.push(
                            "SSL/TLS certificate is not trusted by system CAs or has an invalid chain."
                        );
                        isHttpsConnectionTrusted = false;
                    } else {
                        // If all checks pass up to here and Node.js authorized it, it's generally trusted
                        isHttpsConnectionTrusted = true;
                    }
                }

                // Check for HSTS (HTTP Strict Transport Security) header
                const hstsHeader = res.headers["strict-transport-security"];
                if (!hstsHeader) {
                    siteSecurityIssues.push(
                        "HSTS (HTTP Strict Transport Security) header is missing. Potential for downgrade attacks."
                    );
                }

                resolve();
            });

            request.on("timeout", () => {
                request.destroy();
                siteSecurityIssues.push("HTTPS connection timed out.");
                isHttpsConnectionTrusted = false;
                resolve();
            });

            request.on("error", (e) => {
                console.error(`Security Check: HTTPS request error for ${requestedHostname}:`, e.message);
                siteSecurityIssues.push(`HTTPS connection failed: ${e.message}.`);
                isHttpsConnectionTrusted = false;
                resolve();
            });

            request.end();
        });
    } catch (sslCheckError: unknown) {
        console.error(`Security Check: Error during SSL check for ${requestedHostname}:`, sslCheckError);
        if (sslCheckError instanceof Error) {
            siteSecurityIssues.push(`Failed to perform SSL check: ${sslCheckError.message}`);
        } else {
            siteSecurityIssues.push(`Failed to perform SSL check: ${String(sslCheckError)}`);
        }
        isHttpsConnectionTrusted = false;
    }

    const isSiteFullySecured = isHttpsConnectionTrusted && siteSecurityIssues.length === 0;

    const headers = {
        "Cache-Control": `public, max-age=${API_RESPONSE_CACHE_MAX_AGE}`,
        "Content-Type": "application/json"
    };

    return NextResponse.json(
        {
            hostname: requestedHostname,
            isSecured: isSiteFullySecured,
            securityIssues: siteSecurityIssues,
            certificate: certificateDetails
        },
        { status: 200, headers }
    );
}