"use client";

import ReusedPasswords from "./reused-passwords";
import UnsecuredWebsites from "./unsecured-websites";
import VulnerablePasswords from "./vulnerable-passwords";

const Notifications = () => {
    return (
        <div className="border-r border-zinc-300 h-full w-[280px] flex flex-col text-sm">
            <h3 className="p-3 pl-6">
                10 notifications
            </h3>
            <div className="h-[calc(100vh-124px)] overflow-y-auto space-y-3">
                <VulnerablePasswords />
                <ReusedPasswords />
                <UnsecuredWebsites />
            </div>
        </div>
    )
};

export default Notifications;