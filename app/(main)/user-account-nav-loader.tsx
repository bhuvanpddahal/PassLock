const UserAccountNavLoader = () => {
    return (
        <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-zinc-500 animate-pulse" />
                <div className="h-[10.5px] w-[75px] bg-zinc-500 rounded-full animate-pulse" />
            </div>
            <div className="h-5 w-5 bg-zinc-500 rounded-full animate-pulse" />
        </div>
    )
};

export default UserAccountNavLoader;