"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function loginAnonymously(
    _prevState: { message: string },
    formData: FormData,
) {
    const supabase = await createClient();

    const { data } = await supabase.auth.getSession();
    if (data.session) {
        redirect("/");
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
    redirect("/");
}
