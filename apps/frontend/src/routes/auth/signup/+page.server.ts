import { fail, type Actions } from "@sveltejs/kit";
import { login, redirectLogged } from "$lib/server/auth";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        redirectLogged(locals.user.role);
    }
};

// TODO finish this
export const actions: Actions = {
    default: async ({ fetch, cookies, request }) => {
        const credentials = await parseCredentials(request);
        if (!credentials.success) {
            return fail(400, { message: credentials.error } as const);
        }
        const result = await login(fetch, cookies, credentials.data);
        if (!result.success) {
            return fail(400, { message: result.error } as const);
        }
        redirectLogged(result.data.role);
        // return { success: true } as const;
    }
};
