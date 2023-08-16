import { goto } from "$app/navigation";
import type { Navigation } from "@sveltejs/kit";

export const createGoBack = (nav: Navigation | null) => {
    const from = nav?.from?.url.pathname;
    return async () => {
        if (!from) {
            return await goto("/");
        }
        goto(from);
    };
};
