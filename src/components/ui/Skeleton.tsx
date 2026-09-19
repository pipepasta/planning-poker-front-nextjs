import { cn } from "@/src/lib/cn";

export const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("animate-pulse rounded-lg bg-muted", className)} />
);
