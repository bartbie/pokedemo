import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getToken } from "$lib/server/auth";

export const load = (async ({ cookies, locals: { user } }) => {
    if (!user) {
        throw redirect(303, "/");
    }
    return { user, token: getToken(cookies) };
}) satisfies LayoutServerLoad;
