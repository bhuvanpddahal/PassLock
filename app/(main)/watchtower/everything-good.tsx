import Image from "next/image";

const EverythingGood = () => {
    return (
        <div className="h-full p-3 pl-4 flex flex-col items-center justify-center gap-y-2">
            <Image
                src="/all-good.png"
                alt="Error"
                height={60}
                width={60}
            />
            <div>
                <h2 className="text-lg font-bold text-zinc-800 text-center">
                    All good!
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg text-center">
                    Everything is fine. We'll notify you if anything goes wrong.
                </p>
            </div>
        </div>
    )
};

export default EverythingGood;