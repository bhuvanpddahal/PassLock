import {
    BaggageClaim,
    Globe,
    Home,
    Terminal
} from "lucide-react";

const Section2 = () => {
    return (
        <section className="min-h-screen max-w-7xl mx-auto px-8 py-[50px] flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full">
                <h2 className="max-w-lg mx-auto text-[30px] md:text-[35px] xl:text-[40px] font-extrabold text-center text-zinc-700 leading-[38px] md:leading-[45px] xl:leading-[50px]">
                    PassLock has something for each individual.
                </h2>
                <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <li className="flex flex-col items-center gap-y-1">
                        <div className="p-2 rounded-md bg-amber-200">
                            <Home className="h-8 w-8 text-amber-700" />
                        </div>
                        <div className="text-[26px] sm:text-[28px] md:text-[30px] font-extrabold text-zinc-700">
                            Personal
                        </div>
                        <p className="text-zinc-600 font-medium text-base sm:text-[17px] md:text-lg leading-8 text-center">
                            Password management for you and your family, anytime.
                        </p>
                    </li>
                    <li className="flex flex-col items-center gap-y-1">
                        <div className="p-2 rounded-md bg-blue-200">
                            <BaggageClaim className="h-8 w-8 text-blue-700" />
                        </div>
                        <div className="text-[26px] sm:text-[28px] md:text-[30px] font-extrabold text-zinc-700">
                            Business
                        </div>
                        <p className="text-zinc-600 font-medium text-base sm:text-[17px] md:text-lg leading-8 text-center">
                            Secure your business by protecting your people.
                        </p>
                    </li>
                    <li className="flex flex-col items-center gap-y-1">
                        <div className="p-2 rounded-md bg-green-200">
                            <Globe className="h-8 w-8 text-green-700" />
                        </div>
                        <div className="text-[26px] sm:text-[28px] md:text-[30px] font-extrabold text-zinc-700">
                            Enterprise
                        </div>
                        <p className="text-zinc-600 font-medium text-base sm:text-[17px] md:text-lg leading-8 text-center">
                            Get the freedom to make big moves - without big risks.
                        </p>
                    </li>
                    <li className="flex flex-col items-center gap-y-1">
                        <div className="p-2 rounded-md bg-pink-200">
                            <Terminal className="h-8 w-8 text-pink-700" />
                        </div>
                        <div className="text-[26px] sm:text-[28px] md:text-[30px] font-extrabold text-zinc-700">
                            Developer
                        </div>
                        <p className="text-zinc-600 font-medium text-base sm:text-[17px] md:text-lg leading-8 text-center">
                            Streamline your workflow and keep secrets out of code.
                        </p>
                    </li>
                </ul>
                <div className="mt-12 text-center">
                    <p className="text-[20px] sm:text-[24px] xl:text-[28px] font-bold text-zinc-700">
                        We strive to delight users, cherishing every interaction.
                    </p>
                </div>
            </div>
        </section>
    )
};

export default Section2;