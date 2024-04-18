import { LucideIcon } from "lucide-react";

interface NotificationsErrorProps {
    title: string;
    Icon: LucideIcon;
    message?: string;
}

const NotificationsError = ({
    title,
    Icon,
    message = "An error occurred."
}: NotificationsErrorProps) => {
    return (
        <div>
            <h4 className="flex items-center justify-between bg-zinc-100 px-3 py-1">
                <div className="flex items-center gap-1 text-slate-700">
                    <Icon className="h-4 w-4" />
                    <div className="text-[13px] font-semibold">
                        {title}
                    </div>
                </div>
                <div className="w-[29px] h-[22px] opacity-0 pointer-events-none" />
            </h4>
            <div className="p-3">
                <p className="text-muted-foreground text-[13px] px-3">
                    {message}
                </p>
            </div>
        </div>
    )
};

export default NotificationsError;