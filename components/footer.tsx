import Link from "next/link";
import { GithubIcon } from "lucide-react";

const Footer = () => {
    return (
        <footer className="border-t border-zinc-300 px-2 py-4 bg-white">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div className="text-[13px] text-zinc-600">
                    <p>© 2024 PassLock. All rights reserved.</p>
                    <p>4711 Yonge St, 10th Floor, Toronto, Ontario, M2N 6K8, Canada.</p>
                </div>
                <Link href="https://github.com/BhuvanPdDahal/PassLock">
                    <GithubIcon
                        className="h-6 w-6 bg-slate-800 text-white rounded-full p-0.5 cursor-pointer hover:bg-slate-700"
                    />
                </Link>
            </div>
        </footer>
    )
};

export default Footer;