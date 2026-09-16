"use client";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signInAnonymously } from "@/app/login/actions";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Panel } from "@/src/components/ui/Panel";
import { NICKNAME_MAX } from "@/src/lib/auth";

export const LoginForm = () => {
    const [state, action, pending] = useActionState(signInAnonymously, {
        message: "",
    });
    const next = useSearchParams().get("next");
    return (
        <Panel className="w-full max-w-sm p-6">
            <h1 className="mb-1 font-display text-3xl font-extrabold">
                macaroni poker
            </h1>
            <p className="mb-5 text-sm text-ink-soft">
                Pick a nickname and pull up a chair.
            </p>
            <form action={action} className="flex flex-col gap-3">
                {next && <input type="hidden" name="next" value={next} />}
                <label htmlFor="nickname" className="text-sm font-bold">
                    Nickname
                </label>
                <Input
                    id="nickname"
                    name="nickname"
                    maxLength={NICKNAME_MAX}
                    placeholder="Ravioli"
                    required
                    autoFocus
                    invalid={!!state.message}
                />
                {state.message && (
                    <p
                        role="alert"
                        className="text-sm font-semibold text-danger"
                    >
                        {state.message}
                    </p>
                )}
                <Button
                    type="submit"
                    size="lg"
                    disabled={pending}
                    className="mt-2 w-full"
                >
                    Join the table
                </Button>
            </form>
        </Panel>
    );
};
