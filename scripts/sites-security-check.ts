import { PrismaClient } from "@prisma/client";

import { SecurityInfo } from "@/actions/site";

const db = new PrismaClient();

const APP_URL = process.env.APP_BASE_URL;

async function runSitesSecurityCheck() {
    if (!APP_URL) {
        console.error("No 'APP_BASE_URL' env secret set.");
        return;
    }
    console.log("Starting daily security checks...");

    try {
        const sites = await db.site.findMany({
            select: {
                id: true,
                canonicalHostname: true
            }
        });
        if (!sites.length) {
            console.log("No sites found in the database to check.");
            return;
        }

        console.log(`Found ${sites.length} sites. Processing...`);

        const results = await Promise.allSettled(sites.map(async (site) => {
            console.log(`- Checking: ${site.canonicalHostname}`);
            try {
                const response = await fetch(`${APP_URL}/api/site/security-check?hostname=${encodeURIComponent(site.canonicalHostname)}`, {
                    method: "GET",
                    cache: "no-store"
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API responded with status ${response.status}: ${errorText.substring(0, 200)}`);
                }

                const securityInfo: SecurityInfo = await response.json();

                await db.site.update({
                    where: { id: site.id },
                    data: {
                        isSecured: securityInfo.isSecured,
                        securityIssues: securityInfo.securityIssues,
                        certificateDetails: securityInfo.certificate,
                        lastCheckedAt: new Date()
                    }
                });

                console.log(`  Successfully updated security for ${site.canonicalHostname}`);
                return { status: "fulfilled", site: site.canonicalHostname };
            } catch (siteError) {
                const errorMessage = siteError instanceof Error ? siteError.message : String(siteError);
                console.error(`  Error checking or updating ${site.canonicalHostname}: ${errorMessage}`);

                await db.site.update({
                    where: { id: site.id },
                    data: {
                        securityIssues: ["Failed to perform security check: " + errorMessage.substring(0, 200)],
                        isSecured: false,
                        lastCheckedAt: new Date()
                    }
                });
                return { status: "rejected", site: site.canonicalHostname, error: errorMessage };
            }
        }));

        const fulfilledCount = results.filter(r => r.status === "fulfilled").length;
        const rejectedCount = results.filter(r => r.status === "rejected").length;

        console.log(`Daily security checks completed: ${fulfilledCount} successful, ${rejectedCount} failed.`);
    } catch (error) {
        console.error("An unrecoverable error occurred during daily security checks:", error);
        process.exit(1);
    }
}

runSitesSecurityCheck();