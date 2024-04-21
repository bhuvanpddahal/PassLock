"use client";

import Link from "next/link";
import Image from "next/image";
import { useCookies } from "next-client-cookies";

const HeroSection = () => {
    const cookies = useCookies();
    const userString = cookies.get("user");

    return (
        <section className="bg-gradient-to-bl from-[#a3def0] via-[#e3f8ff] to-[#f5f9fa] min-h-[calc(100vh-77px)]">
            <div className="max-w-7xl mx-auto px-8 pt-[100px] pb-3 flex flex-col lg:flex-row items-center gap-8">
                <div className="w-full lg:w-[40%] pb-5">
                    <h1 className="text-[30px] md:text-[35px] xl:text-[40px] font-extrabold text-zinc-700 leading-[38px] md:leading-[45px] xl:leading-[50px]">
                        Lock in Your Peace
                    </h1>
                    <p className="text-zinc-600 mt-5 mb-11 font-medium text-base sm:text-[17px] md:text-lg leading-7 md:leading-8">
                        Your secure vault for peace of mind. Simplify and safeguard with our intuitive password manager.
                    </p>
                    {userString ? (
                        <Link
                            href="/dashboard"
                            className="sm:text-[17px] px-5 py-3 border-2 border-primary bg-primary font-bold text-zinc-100 rounded-full transition-colors hover:bg-transparent hover:text-primary"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/signin"
                            className="sm:text-[17px] px-5 py-3 border-2 border-primary bg-primary font-bold text-zinc-100 rounded-full transition-colors hover:bg-transparent hover:text-primary"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
                <div className="relative w-full lg:w-[60%]">
                    <Image
                        src="/dashboard-page.png"
                        alt="Dashboard Page"
                        width={-1}
                        height={-1}
                        layout="responsive"
                        className="w-full h-auto rounded-md shadow-md"
                    />
                </div>
            </div>
        </section>
    )
};

export default HeroSection;