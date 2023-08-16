import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { redirectLogged } from "$lib/server/auth";

export const load = (({ locals: { user }, cookies }) => {
    if (user) {
        redirectLogged(user.role);
    }
}) satisfies PageServerLoad;
