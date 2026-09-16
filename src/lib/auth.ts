export const NICKNAME_MAX = 24;

export const resolveRedirectTarget = (next: string | null): string =>
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
