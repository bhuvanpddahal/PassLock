import Image from "next/image";

const NoFavorites = () => {
    return (
        <div className="flex-1 p-3 pl-4 flex flex-col items-center justify-center">
            <Image
                src="/no-star.png"
                alt="No Favorites"
                height={100}
                width={100}
            />
            <div className="mt-2">
                <h2 className="text-lg font-bold text-zinc-800 text-center">
                    No favorites found!
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg text-center">
                    Try creating an item as your favorite or edit an existing one as your favorite.
                </p>
            </div>
        </div>
    )
};

export default NoFavorites;