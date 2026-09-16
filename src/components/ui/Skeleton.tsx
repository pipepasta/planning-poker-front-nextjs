import { cn } from "@/src/lib/cn";

export const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("animate-pulse rounded-xl bg-ink/10", className)} />
);
