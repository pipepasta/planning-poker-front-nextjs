export const NICKNAME_MAX = 24;

/**
 * Accepts only same-origin absolute paths. Anything whose second character is
 * `/` or `\` is protocol-relative once the browser normalises the Location
 * header, so it is rejected outright; the rest is normalised through `URL` to
 * strip dot segments and any embedded credentials.
 */
export const resolveRedirectTarget = (next: string | null): string => {
    if (!next || !next.startsWith("/") || /^\/[\\/]/.test(next)) return "/";
    try {
        const url = new URL(next, "http://localhost");
        return `${url.pathname}${url.search}`;
    } catch {
        return "/";
    }
};
