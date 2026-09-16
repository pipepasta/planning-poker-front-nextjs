import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (
    request: NextRequest,
): Promise<NextResponse> => {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (toSet) => {
                    for (const { name, value } of toSet)
                        request.cookies.set(name, value);
                    response = NextResponse.next({ request });
                    for (const { name, value, options } of toSet)
                        response.cookies.set(name, value, options);
                },
            },
        },
    );
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims && !request.nextUrl.pathname.startsWith("/login")) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.search = "";
        url.searchParams.set(
            "next",
            `${request.nextUrl.pathname}${request.nextUrl.search}`,
        );
        return NextResponse.redirect(url);
    }
    return response;
};
