import Image from "next/image";

const Section3 = () => {
    return (
        <section className="min-h-screen max-w-7xl mx-auto px-8 py-[50px] flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full">
                <h2 className="max-w-lg mx-auto text-[30px] md:text-[35px] xl:text-[40px] font-extrabold text-center text-zinc-700 leading-[38px] md:leading-[45px] xl:leading-[50px]">
                    See what we offer.
                </h2>
                <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <li>
                        <div className="bg-gradient-to-bl from-[#a3def0] via-[#e3f8ff] to-[#c9f3fd] flex items-center justify-center px-2 py-5 md:py-8 rounded-lg">
                            <Image
                                src="/secure-password.png"
                                alt="Secure Password"
                                height={100}
                                width={100}
                            />
                        </div>
                        <div className="text-[22px] sm:text-[24px] md:text-[26px] font-extrabold text-zinc-700 mt-1">
                            Secure by Design
                        </div>
                        <p className="text-zinc-600 font-medium text-base sm:text-[17px] md:text-lg leading-8">
                            Safely store and manage all your passwords in one secure vault.
                        </p>
                    </li>
                    <li>
                        <div className="bg-gradient-to-bl from-[#a3def0] via-[#e3f8ff] to-[#c9f3fd] flex items-center justify-center px-2 py-5 md:py-8 rounded-lg">
                            <Image
                                src="/password-strength.png"
                                alt="Password Strength"
                                height={100}
                                width={100}
                            />
                        </div>
                        <div className="text-[22px] sm:text-[24px] md:text-[26px] font-extrabold text-zinc-700 mt-1">
                            Strength Assesment
                        </div>
                        <p className="text-zinc-600 font-medium text-base sm:text-[17px] md:text-lg leading-8">
                            Receive real-time feedback on password strength, ensuring robust account security.
                        </p>
                    </li>
                    <li>
                        <div className="bg-gradient-to-bl from-[#a3def0] via-[#e3f8ff] to-[#c9f3fd] flex items-center justify-center px-2 py-5 md:py-8 rounded-lg">
                            <Image
                                src="/clean-ui.png"
                                alt="Clean UI"
                                height={100}
                                width={100}
                            />
                        </div>
                        <div className="text-[22px] sm:text-[24px] md:text-[26px] font-extrabold text-zinc-700 mt-1">
                            Friendly UI
                        </div>
                        <p className="text-zinc-600 font-medium text-base sm:text-[17px] md:text-lg leading-8">
                            Enjoy an intuitive and easy-to-use interface for effortless password management and peace of mind.
                        </p>
                    </li>
                </ul>
            </div>
        </section>
    )
};

export default Section3;