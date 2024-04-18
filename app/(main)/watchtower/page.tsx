import { CircleAlert } from "lucide-react";

import Notifications from "./notifications";

const WatchtowerPage = () => {
    return (
        <div className="flex-1 flex">
            <Notifications />
            <div className="flex-1">
                <div className="m-3 bg-destructive text-destructive-foreground rounded-md p-3 text-sm flex gap-3">
                    <CircleAlert className="h-5 w-5 shrink-0" />
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, cupiditate. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet earum cumque vel deleniti. Commodi labore consectetur quaerat voluptatibus velit cum.
                    </p>
                </div>
            </div>
        </div>
    )
};

export default WatchtowerPage;