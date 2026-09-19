"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "@/src/lib/toast";

export const CopyLink = ({ roomId }: { roomId: string }) => {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        // Denied permission, an insecure origin, or no Clipboard API at all.
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch {
            toast("Could not copy the link", "error");
            return;
        }
        setCopied(true);
        toast("Link copied", "success");
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            type="button"
            onClick={copy}
            aria-label="Copy room link"
            className="inline-flex h-8 items-center gap-2 rounded-lg px-1.5 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground sm:h-10 sm:px-2 sm:text-base"
        >
            <span className="max-w-32 truncate max-md:hidden">{roomId}</span>
            {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
    );
};
