import Image from "next/image";

const FetchError = () => {
    return (
        <div className="flex-1 p-3 pl-4 flex flex-col items-center justify-center gap-y-2">
            <Image
                src="/error.png"
                alt="Error"
                height={60}
                width={60}
            />
            <div>
                <h2 className="text-lg font-bold text-zinc-800 text-center">
                    An error occurred!
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg text-center">
                    Oops, something went wrong while trying to get the data. Please refresh the site to try again.
                </p>
            </div>
        </div>
    )
};

export default FetchError;