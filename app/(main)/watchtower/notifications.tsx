import { Dispatch, SetStateAction } from "react";

import ReusedPasswords from "./reused-passwords";
import UnsecuredWebsites from "./unsecured-websites";
import VulnerablePasswords from "./vulnerable-passwords";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Active, Data, NotificationStatus } from "./content";

interface NotificationsProps {
    active: Active;
    setActive: Dispatch<SetStateAction<Active>>;
    data: Data;
    setData: Dispatch<SetStateAction<Data>>;
    notificationStatus: NotificationStatus;
    setNotificationStatus: Dispatch<SetStateAction<NotificationStatus>>;
}

const Notifications = ({
    active,
    setActive,
    data,
    setData,
    notificationStatus,
    setNotificationStatus
}: NotificationsProps) => {
    const notificationsCount = data.reusedPasswords.length
        + data.unsecuredWebsites.length
        + data.vulnerablePasswords.length;

    return (
        <div className="sticky top-[calc(4rem+1px)] border-r border-zinc-300 h-[calc(100vh-4rem-1px)] w-[280px] flex flex-col text-sm">
            <h3 className="p-3 pl-6">
                {notificationsCount > 0
                    ? notificationsCount === 1 ? "1 notification" : `${notificationsCount} notifications`
                    : "No notifications"
                }
            </h3>
            <ScrollArea className="h-[calc(100vh-160px)] space-y-3">
                <VulnerablePasswords
                    active={active}
                    setActive={setActive}
                    notificationsData={data}
                    setData={setData}
                    notificationStatus={notificationStatus}
                    setNotificationStatus={setNotificationStatus}
                />
                <ReusedPasswords
                    active={active}
                    setActive={setActive}
                    notificationsData={data}
                    setData={setData}
                    notificationStatus={notificationStatus}
                    setNotificationStatus={setNotificationStatus}
                />
                <UnsecuredWebsites
                    active={active}
                    setActive={setActive}
                    notificationsData={data}
                    setData={setData}
                    notificationStatus={notificationStatus}
                    setNotificationStatus={setNotificationStatus}
                />
            </ScrollArea>
            <p className="text-muted-foreground text-[0.6875rem] mt-3.5 text-center">
                Your passwords are encrypted before storing.
            </p>
        </div>
    )
};

export default Notifications;