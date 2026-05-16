import { cn } from "@/lib/utils";

interface Props {
    innerText?: string;
    className?: string;
}

const HorizontalLine = (props: Props) => (
    <div
        className={cn(
            "flex items-center justify-center w-full",
            props.className,
        )}
    >
        <div className="h-1 w-full border-b border-b-zinc-300 flex justify-center" />
        <div className="mx-1 text-zinc-400">{props.innerText}</div>
        <div className="h-1 w-full border-b border-b-zinc-300 flex justify-center" />
    </div>
);

export default HorizontalLine;
