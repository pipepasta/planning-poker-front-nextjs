import type * as React from "react";

import { cn } from "@/lib/utils";

const Card = ({
    className,
    ref,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) => (
    <div
        ref={ref}
        className={cn(
            "rounded-xl border bg-card text-card-foreground shadow-sm",
            className,
        )}
        {...props}
    />
);

const CardHeader = ({
    className,
    ref,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
);

const CardTitle = ({
    className,
    ref,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) => (
    <div
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
);

const CardContent = ({
    className,
    ref,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;

const CardFooter = ({
    className,
    ref,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
);

export { Card, CardHeader, CardFooter, CardTitle, CardContent };
