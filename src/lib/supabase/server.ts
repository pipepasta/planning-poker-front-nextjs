import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabasePublishableKey, supabaseUrl } from "./env";

export const createServerSupabase = async () => {
    const cookieStore = await cookies();
    return createServerClient(supabaseUrl(), supabasePublishableKey(), {
        cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: (toSet) => {
                try {
                    for (const { name, value, options } of toSet)
                        cookieStore.set(name, value, options);
                } catch {
                    // called from a Server Component; proxy.ts refreshes sessions instead
                }
            },
        },
    });
};
