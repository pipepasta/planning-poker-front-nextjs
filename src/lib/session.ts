"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "./supabase/client";

export interface Session {
    status: "loading" | "ready";
    userId: string | null;
    displayName: string;
    getToken: () => Promise<string | null>;
    rename: (name: string) => Promise<void>;
}

export const useSession = (): Session => {
    const supabase = useMemo(() => createClient(), []);
    const [status, setStatus] = useState<"loading" | "ready">("loading");
    const [userId, setUserId] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        let cancelled = false;
        supabase.auth.getUser().then(({ data }) => {
            if (cancelled) return;
            setUserId(data.user?.id ?? null);
            setDisplayName(
                String(data.user?.user_metadata?.display_name ?? "").trim(),
            );
            setStatus("ready");
        });
        return () => {
            cancelled = true;
        };
    }, [supabase]);

    const getToken = useCallback(async () => {
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token ?? null;
    }, [supabase]);

    const rename = useCallback(
        async (name: string) => {
            const trimmed = name.trim();
            await supabase.auth.updateUser({ data: { display_name: trimmed } });
            setDisplayName(trimmed);
        },
        [supabase],
    );

    return { status, userId, displayName, getToken, rename };
};
