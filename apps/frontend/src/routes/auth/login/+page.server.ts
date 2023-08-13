import { type Actions, fail } from "@sveltejs/kit";
import { login, redirectLogged } from "$lib/server/auth";
import type { PageServerLoad } from "../$types";
import { authForm } from "../form";
import { setError, superValidate } from "sveltekit-superforms/server";
import { Errors } from "@pokedemo/api";
// import { validate, fail } from "$lib/forms";

export const load: PageServerLoad = async ({ locals }) => {
    const form = await superValidate(authForm);
    return { form };
};

// TODO finish this
export const actions: Actions = {
    default: async ({ request, fetch, cookies }) => {
        const form = await superValidate(request, authForm);
        if (!form.valid) return fail(400, { form });
        const result = await login(fetch, cookies, form.data);
        if (!result.success) {
            switch (result.error) {
                case Errors.emailNotExist:
                    return setError(form, "email", result.error);
                case Errors.wrongPassword:
                    return setError(form, "password", result.error);
            }
        }
        redirectLogged(result.data.role);
        return { form };
    }
};
