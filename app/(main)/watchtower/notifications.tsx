import { Dispatch, SetStateAction } from "react";

import ReusedPasswords from "./reused-passwords";
import UnsecuredWebsites from "./unsecured-websites";
import VulnerablePasswords from "./vulnerable-passwords";
import type { Active, Data } from "./page";

interface NotificationsProps {
    active: Active;
    setActive: Dispatch<SetStateAction<Active>>;
    data: Data;
    setData: Dispatch<SetStateAction<Data>>;
}

const Notifications = ({
    active,
    setActive,
    data,
    setData
}: NotificationsProps) => {
    const notificationsCount = data.reusedPasswords.length
        + data.unsecuredWebsites.length
        + data.vulnerablePasswords.length;

    return (
        <div className="sticky top-[68px] border-r border-zinc-300 w-[280px] flex flex-col text-sm">
            <h3 className="p-3 pl-6">
                {notificationsCount > 0
                    ? notificationsCount === 1 ? "1 notification" : `${notificationsCount} notifications`
                    : "No notifications"
                }
            </h3>
            <div className="h-[calc(100vh-124px)] overflow-y-auto space-y-3">
                <VulnerablePasswords
                    active={active}
                    setActive={setActive}
                    notificationsData={data}
                    setData={setData}
                />
                <ReusedPasswords
                    active={active}
                    setActive={setActive}
                    notificationsData={data}
                    setData={setData}
                />
                <UnsecuredWebsites
                    active={active}
                    setActive={setActive}
                    notificationsData={data}
                    setData={setData}
                />
            </div>
        </div>
    )
};

export default Notifications;