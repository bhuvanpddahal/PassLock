"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

import { SiteSecurityCheckResponse } from "@/app/api/site/security-check/route";

export interface SecurityInfo extends Omit<SiteSecurityCheckResponse, "certificate"> {
    certificate: Prisma.InputJsonValue | null;
}

export const createSite = async (canonicalHostname: string) => {
    try {
        const securityCheckUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/site/security-check?hostname=${encodeURIComponent(canonicalHostname)}`;

        const response = await fetch(securityCheckUrl, {
            cache: "no-store"
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Unknown API error" }));
            console.error(`Failed to get security info for ${canonicalHostname}:`, response.status, errorData);
            const newSite = await db.site.create({
                data: {
                    canonicalHostname,
                    isSecured: false,
                    securityIssues: [`Failed to verify security: API error (${response.status})`],
                    lastCheckedAt: new Date()
                }
            });
            return { siteId: newSite.id };
        }

        const securityInfo: SecurityInfo = await response.json();
        console.log({ securityInfo });

        const newSite = await db.site.create({
            data: {
                canonicalHostname,
                isSecured: securityInfo.isSecured,
                securityIssues: securityInfo.securityIssues,
                certificateDetails: securityInfo.certificate,
                lastCheckedAt: new Date()
            }
        });

        console.log(`New Site created for hostname: ${canonicalHostname} with ID: ${newSite.id}`);
        return { siteId: newSite.id };
    } catch (error) {
        console.error(`createSite: Unexpected server error for ${canonicalHostname}:`, error);
        throw new Error(`Failed to create site entry: ${error instanceof Error ? error.message : String(error)}`);
    }
};