"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

function resolveRedirectTarget(next: string | null): string {
    if (!next || !next.startsWith("/") || next.startsWith("//")) {
        return "/";
    }
    return next;
}

export async function loginAnonymously(
    _prevState: { message: string },
    formData: FormData,
) {
    const supabase = await createClient();

    const redirectTo = resolveRedirectTarget(
        formData.get("next") as string | null,
    );

    const { data } = await supabase.auth.getSession();
    if (data.session) {
        redirect(redirectTo);
    }

    const input = {
        display_name: formData.get("nickname") as string,
    };

    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
        return { message: error.message };
    }
    await supabase.auth.updateUser({
        data: input,
    });

    revalidatePath("/", "layout");
    redirect(redirectTo);
}
