import Image from "next/image";
import Link from "next/link";
import type React from "react";
import localImage from "@/app/icon.png";

interface Props {
    children?: React.ReactNode;
}
const Header = (props: Props) => {
    return (
        <nav className="bg-zinc-800 h-20 sm:h-16 p-2 sm:p-4 text-white flex">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex gap-2">
                    <Image
                        width={30}
                        height={30}
                        src={localImage}
                        alt="macaroni poker icon"
                    />
                    <Link
                        href="/"
                        className="text-xl font-semibold whitespace-nowrap"
                    >
                        macaroni poker
                    </Link>
                </div>
                <div className="flex gap-4">{props.children}</div>
            </div>
        </nav>
    );
};

export default Header;
