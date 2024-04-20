import Image from "next/image";

const NoSearchResults = () => {
    return (
        <div className="flex-1 p-3 pl-4 flex flex-col items-center justify-center">
            <Image
                src="/not-found.png"
                alt="Pyro"
                height={100}
                width={100}
            />
            <div className="mt-2">
                <h2 className="text-lg font-bold text-zinc-800 text-center">
                    No items found!
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg text-center">
                    Try searching for site name or the email associated with it.
                </p>
            </div>
        </div>
    )
};

export default NoSearchResults;