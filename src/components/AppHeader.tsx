import type { ReactNode } from "react";
import { Wordmark } from "@/src/components/Wordmark";

/**
 * The one bar every page wears. It owns the chrome — the dark themed band, the
 * sticky behaviour, the height, the `max-w-5xl` row and its padding — and the
 * lockup that starts it; each page passes only the controls it actually has.
 *
 * `header-chrome` re-points the ordinary colour tokens at their dark-bar values
 * for everything inside, so controls need no variant of their own.
 *
 * `flex-wrap` is the guarantee that nothing here can ever push the page wider
 * than the viewport: a row that cannot fit takes a second line instead of
 * overflowing. The pages choose their breakpoints so that it does not come to
 * that in practice — but a long room id or a long name cannot break the page.
 */
export const AppHeader = ({ children }: { children?: ReactNode }) => (
    <header className="header-chrome sticky top-0 z-30 bg-header text-header-foreground">
        {/* min-h-14 is the bar's height wherever a page has no 40px control
            to set it — login, which carries only the swatches — so all three
            bars stand the same 56px tall. */}
        <div className="mx-auto flex min-h-14 max-w-5xl flex-wrap items-center gap-x-1.5 px-2 py-2 sm:gap-x-3 sm:px-3">
            <Wordmark />
            {children}
        </div>
    </header>
);
