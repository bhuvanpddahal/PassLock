import {
    format,
    differenceInDays,
    differenceInMonths,
    differenceInYears
} from "date-fns";
import type { Certificate } from "tls";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SimplifiedCertificateDetails } from "@/app/api/site/security-check/route";

interface ViewCertificateProps {
    hostname: string;
    certificateDetails: SimplifiedCertificateDetails | null;
}

const ViewCertificate = ({
    hostname,
    certificateDetails
}: ViewCertificateProps) => {
    const getValidityPeriod = () => {
        const validToDate = certificateDetails?.valid_to;
        if (!validToDate) return "N/A";

        const now = new Date();
        const daysRemaining = differenceInDays(validToDate, now);

        if (daysRemaining < 0) {
            return `Expired ${format(validToDate, "MMM dd, yyyy")}`;
        } else if (daysRemaining <= 30) {
            return `Expires in ${daysRemaining} days`;
        } else {
            const monthsRemaining = differenceInMonths(validToDate, now);
            const yearsRemaining = differenceInYears(validToDate, now);

            if (yearsRemaining >= 1) {
                return `Valid for coming ${yearsRemaining} year${yearsRemaining !== 1 ? "s" : ""}`;
            } else if (monthsRemaining >= 1) {
                return `Valid for coming ${monthsRemaining} month${monthsRemaining !== 1 ? "s" : ""}`;
            } else {
                return `Valid for coming ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`;
            }
        }
    };

    const formatCertName = (certName: Certificate | undefined) => {
        if (!certName) return "N/A";

        const cn = Array.isArray(certName.CN) ? certName.CN[0] : certName.CN;
        const o = Array.isArray(certName.O) ? certName.O[0] : certName.O;

        if (cn && o) return `${cn} (${o})`;
        if (cn) return cn;
        if (o) return o;

        return "N/A";
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    View certificate
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Certificate Details - {hostname}</SheetTitle>
                    <SheetDescription>
                        Detailed information about the SSL/TLS certificate.
                    </SheetDescription>
                </SheetHeader>
                {/* Failed to load the site certificate details. Either we
                were unable to fetch the certificate for this site, or
                were expecting more information in it. */}
                {!certificateDetails ? (
                    <p className="mt-14 text-sm text-center text-muted-foreground font-mono">
                        No certificate information available for this site.
                    </p>
                ) : (
                    <ul className="space-y-5 mt-6 mb-4">
                        <li className="space-y-1.5">
                            <h4 className="font-semibold text-base">Issued To:</h4>
                            <p className="text-sm text-gray-700 font-mono font-medium">
                                {formatCertName(certificateDetails.subject)}
                            </p>
                            {typeof certificateDetails.subject?.CN === "string" && (
                                <p className="text-sm text-muted-foreground font-mono">
                                    CN: {certificateDetails.subject.CN}
                                </p>
                            )}
                            {Array.isArray(certificateDetails.subject?.OU) && certificateDetails.subject.OU.length > 0 && (
                                <p className="text-sm text-muted-foreground font-mono">
                                    OU: {certificateDetails.subject.OU.join(", ")}
                                </p>
                            )}
                        </li>
                        <li className="space-y-1.5">
                            <h4 className="font-semibold text-base">Issued By:</h4>
                            <p className="text-sm text-gray-700 font-mono font-medium">
                                {formatCertName(certificateDetails.issuer)}
                            </p>
                            {typeof certificateDetails?.issuer?.CN === "string" && (
                                <p className="text-sm text-muted-foreground font-mono">
                                    CN: {certificateDetails.issuer.CN}
                                </p>
                            )}
                            {Array.isArray(certificateDetails.issuer?.O) && certificateDetails.issuer.O.length > 0 && (
                                <p className="text-sm text-muted-foreground font-mono">
                                    O: {certificateDetails.issuer.O.join(", ")}
                                </p>
                            )}
                        </li>
                        <li className="space-y-1.5">
                            <h4 className="font-semibold text-base">Validity Period:</h4>
                            <p className="text-sm font-mono">
                                <span className="text-gray-700">From:</span>{" "}
                                <span className="text-muted-foreground">
                                    {certificateDetails.valid_from
                                        ? format(certificateDetails?.valid_from, "MMM dd, yyyy hh:mm a")
                                        : "N/A"
                                    }
                                </span>
                            </p>
                            <p className="text-sm font-mono">
                                <span className="text-gray-700">To:</span>{" "}
                                <span className="text-muted-foreground">
                                    {certificateDetails.valid_from
                                        ? `${format(certificateDetails?.valid_from, "MMM dd, yyyy hh:mm a")} (${getValidityPeriod()})`
                                        : "N/A"
                                    }
                                </span>
                            </p>
                        </li>
                        <li className="space-y-1.5">
                            <h4 className="font-semibold text-base">Fingerprint (SHA1):</h4>
                            <p className="text-sm text-gray-700 font-mono break-all">
                                {certificateDetails.fingerprint ?? "N/A"}
                            </p>
                        </li>
                        <li className="space-y-1.5">
                            <h4 className="font-semibold text-base">Serial Number:</h4>
                            <p className="text-sm text-gray-700 font-mono font- break-all">
                                {certificateDetails.serialNumber ?? "N/A"}
                            </p>
                        </li>
                    </ul>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default ViewCertificate;