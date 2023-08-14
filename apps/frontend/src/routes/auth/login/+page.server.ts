import { type Actions, fail } from "@sveltejs/kit";
import { login, redirectLogged, signup } from "$lib/server/auth";
import type { PageServerLoad } from "../$types";
import { loginSchema, signupSchema } from "./form";
import { setError, superValidate } from "sveltekit-superforms/server";
import { Errors } from "@pokedemo/api";

export const load: PageServerLoad = async () => {
    const loginForm = await superValidate(loginSchema);
    const signupForm = await superValidate(signupSchema);
    return { loginForm, signupForm };
};

export const actions: Actions = {
    login: async ({ request, fetch, cookies }) => {
        // form
        const loginForm = await superValidate(request, loginSchema);
        if (!loginForm.valid) return fail(400, { loginForm });

        // api check
        const result = await login(fetch, cookies, loginForm.data);
        if (!result.success) {
            switch (result.error) {
                case Errors.emailNotExist:
                    return setError(loginForm, "email", result.error);
                case Errors.wrongPassword:
                    return setError(loginForm, "password", result.error);
            }
        }
        redirectLogged(result.data.role);
        return { loginForm };
    },
    signup: async ({ request, fetch, cookies }) => {
        // form
        const signupForm = await superValidate(request, signupSchema);
        if (!signupForm.valid) return fail(400, { signupForm });
        const { data } = signupForm;
        if (data.password != data.confirmPassword) {
            return setError(signupForm, "confirmPassword", "Passwords don't match!");
        }

        // api check
        const result = await signup(fetch, cookies, data);
        if (!result.success) {
            switch (result.error) {
                case Errors.emailTaken:
                    return setError(signupForm, "email", result.error);
            }
        }
        redirectLogged(result.data.role);
        return { signupForm };
    }
};
