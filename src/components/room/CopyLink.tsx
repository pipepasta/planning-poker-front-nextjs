"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "@/src/lib/toast";

export const CopyLink = ({ roomId }: { roomId: string }) => {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast("Link copied", "success");
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            type="button"
            onClick={copy}
            aria-label="Copy room link"
            className="inline-flex h-10 items-center gap-2 rounded-xl px-2 font-display text-lg font-bold hover:bg-ink/10"
        >
            <span className="max-md:hidden">{roomId}</span>
            {copied ? (
                <Check size={18} className="text-success" />
            ) : (
                <Copy size={18} />
            )}
        </button>
    );
};
