import Image from "next/image";
import Link from "next/link";
import icon from "@/app/icon.png";
import { cn } from "@/src/lib/cn";

/**
 * The brand lockup: logo plus name, linking home. On its own it stays whole at
 * every width, so the mark and the word are always read together.
 *
 * `compact` drops the word below `sm`, and only the room bar asks for it: that
 * bar also carries the timer and every room and personal control, and measured
 * at 390px the word is the one 120px in it that is decoration rather than a
 * control. The mark still links home and still names the page to assistive
 * tech, so nothing is lost but the reading.
 */
export const Wordmark = ({
    className,
    compact,
}: {
    className?: string;
    compact?: boolean;
}) => (
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
        <span
            className={cn(
                "whitespace-nowrap text-base font-semibold sm:text-lg",
                compact && "max-sm:sr-only",
            )}
        >
            macaroni poker
        </span>
    </Link>
);
