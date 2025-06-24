import { Site } from "@prisma/client";
import { AnimatePresence, motion } from "motion/react";

import ViewCertificate from "./view-certificate";
import { SimplifiedCertificateDetails } from "../api/site/security-check/route";

interface SiteSecurityDetailsProps {
    site: Site;
    show: boolean;
}

const SiteSecurityDetails = ({ site, show }: SiteSecurityDetailsProps) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{
                        height: 0,
                        opacity: 0,
                        marginTop: 0,
                        marginBottom: 0
                    }}
                    animate={{
                        height: "auto",
                        opacity: 1,
                        marginTop: "0.75rem",
                        marginBottom: "0.25rem",
                        transition: { duration: 0.3 }
                    }}
                    exit={{
                        height: 0,
                        opacity: 0,
                        marginTop: 0,
                        marginBottom: 0
                    }}
                    className="w-full bg-zinc-100 border-t rounded-b-lg"
                >
                    <div className="max-w-lg w-full bg-background mx-auto p-5 pt-4 border-b border-zinc-100">
                        <h3 className="text-base font-semibold">
                            Security issues for {site.hostname}
                        </h3>
                        {site.securityIssues.length ? (
                            <ul className="mt-5 mb-6 list-disc list-inside space-y-1.5 text-destructive">
                                {site.securityIssues.map((issue, index) => (
                                    <li key={index} className="text-sm">
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-5 mb-6 text-sm text-green-600">
                                No specific issues detected.
                            </p>
                        )}
                        <ViewCertificate
                            hostname={site.hostname}
                            certificateDetails={site.certificateDetails as SimplifiedCertificateDetails | null}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SiteSecurityDetails;