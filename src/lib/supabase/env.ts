/**
 * Supabase config is required at every entry point (browser client, server
 * client, proxy). Falling back to "" only defers the failure into an opaque
 * fetch error, so fail loudly and name the variable instead.
 *
 * The `process.env.X` reads stay literal: Next inlines NEXT_PUBLIC_* by
 * textual substitution, so a dynamic `process.env[name]` lookup would be
 * undefined in the browser bundle.
 */
const required = (name: string, value: string | undefined): string => {
    if (!value) throw new Error(`${name} is not set`);
    return value;
};

export const supabaseUrl = (): string =>
    required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const supabasePublishableKey = (): string =>
    required(
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    );
