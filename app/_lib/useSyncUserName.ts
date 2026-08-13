import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { nameNotSet, userNameAtom } from "@/app/_lib/atoms";
import { createClient } from "@/utils/supabase/client";

export const useSyncUserName = () => {
    const setUserName = useSetAtom(userNameAtom);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then((user) => {
            if (user) {
                setUserName(
                    user.data.user?.user_metadata.display_name || nameNotSet,
                );
            }
        });
    }, []);
};
