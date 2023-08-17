import type { PageServerLoad } from "./$types";
import { redirectLogged } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, "/");
    }

    redirectLogged(locals.user.role);
};
