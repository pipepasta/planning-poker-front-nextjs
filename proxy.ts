import type { NextRequest } from "next/server";
import { updateSession } from "@/src/lib/supabase/proxy";

export const proxy = (request: NextRequest) => updateSession(request);

export const config = {
    matcher: [
        "/((?!login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
