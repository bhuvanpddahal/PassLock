import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useNewItem } from "@/hooks/use-new-item-modal";

const NewUser = () => {
    const { open } = useNewItem();

    return (
        <div className="flex-1 p-3 pl-4 flex flex-col items-center justify-center">
            <Image
                src="/fireworks.png"
                alt="Pyro"
                height={100}
                width={100}
            />
            <div>
                <h2 className="text-lg font-bold text-zinc-800 text-center">
                    Welcome to PassLock!
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg text-center">
                    Setup your journey of managing your passwords the correct way.
                </p>
            </div>
            <div className="relative mt-[60px]">
                <div className="absolute -top-10 left-12 text-sm bg-slate-800 text-zinc-100 px-3 py-2.5 rounded-sm animate-bounce">
                    Click Here
                    <div
                        className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-slate-800 transform -translate-x-1/2"
                    />
                </div>
                <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                    onClick={open}
                >
                    Create My First Item
                </Button>
            </div>
        </div>
    )
};

export default NewUser;