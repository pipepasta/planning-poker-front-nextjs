export const NICKNAME_MAX = 24;

/**
 * Accepts only same-origin absolute paths. Anything whose second character is
 * `/` or `\` is protocol-relative once the browser normalises the Location
 * header, so it is rejected outright; the rest is normalised through `URL` to
 * strip dot segments and any embedded credentials.
 *
 * Dot-segment normalisation can *manufacture* a protocol-relative path that
 * the input did not have (`/..//evil.com` -> `//evil.com`), so the normalised
 * result is guarded again before it is handed to `redirect()`.
 */
export const resolveRedirectTarget = (next: string | null): string => {
    if (!next || !next.startsWith("/") || /^\/[\\/]/.test(next)) return "/";
    try {
        const url = new URL(next, "http://localhost");
        const path = `${url.pathname}${url.search}${url.hash}`;
        if (!path.startsWith("/") || /^\/[\\/]/.test(path)) return "/";
        return path;
    } catch {
        return "/";
    }
};
