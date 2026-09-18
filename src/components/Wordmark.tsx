import Image from "next/image";
import Link from "next/link";
import icon from "@/app/icon.png";
import { cn } from "@/src/lib/cn";

/**
 * The brand lockup: logo plus name, linking home. It stays whole at every
 * width — the name is never dropped to save space — so the mark and the
 * word are always read together.
 */
export const Wordmark = ({ className }: { className?: string }) => (
    <Link
        href="/"
        aria-label="macaroni poker, back to home"
        className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-lg transition-opacity hover:opacity-80 sm:gap-2",
            className,
        )}
    >
        <Image
            src={icon}
            alt=""
            width={24}
            height={24}
            className="size-5 rounded shadow-sm sm:size-6"
        />
        <span className="whitespace-nowrap text-base font-semibold sm:text-lg">
            macaroni poker
        </span>
    </Link>
);
