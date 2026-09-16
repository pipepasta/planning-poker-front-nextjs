"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NICKNAME_MAX, resolveRedirectTarget } from "@/src/lib/auth";
import { createServerSupabase } from "@/src/lib/supabase/server";

export async function signInAnonymously(
    _prev: { message: string },
    formData: FormData,
) {
    const supabase = await createServerSupabase();
    const target = resolveRedirectTarget(formData.get("next") as string | null);

    const { data } = await supabase.auth.getSession();
    if (data.session) redirect(target);

    const nickname = String(formData.get("nickname") ?? "").trim();
    if (nickname.length < 1 || nickname.length > NICKNAME_MAX) {
        return { message: `Nickname must be 1–${NICKNAME_MAX} characters.` };
    }

    const { error } = await supabase.auth.signInAnonymously();
    if (error) return { message: error.message };
    await supabase.auth.updateUser({ data: { display_name: nickname } });

    revalidatePath("/", "layout");
    redirect(target);
}
