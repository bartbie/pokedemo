import { type Actions, fail } from "@sveltejs/kit";
import { getToken, login, redirectLogged, signup } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";
// import { setError, superValidate } from "sveltekit-superforms/server";
import { Errors } from "@pokedemo/api";
import { apiClient } from "$lib/api";
import { setError, superValidate } from "sveltekit-superforms/server";
import { pokemonAddSchema } from "./form";

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    const form = await superValidate(pokemonAddSchema);

    const api = apiClient(fetch);
    const { data: myPokemons } = await api<API["/me"]["/pokemons"]["GET"]>("/api/me/pokemons", {
        method: "GET",
        auth: getToken(cookies)
    });
    const { data: allPokemons } = await api<API["/pokemons"]["GET"]>("/api/pokemons", {
        method: "GET"
    });

    const myPokemonsIds = myPokemons.map((e) => e.pokemon.id);
    const availablePokemons = allPokemons.filter(({ id }) => myPokemonsIds.includes(id));

    return { form, availablePokemons };
};

export const actions: Actions = {
    default: async ({ request, fetch, cookies }) => {
        // TODO finish this

        // form
        const form = await superValidate(request, pokemonAddSchema);
        if (!form.valid) return fail(400, { form });

        // api check
        const api = apiClient(fetch);
        const result = await api<API["/me"]["/pokemons"]["PUT"]>("/api/me/pokemons", {
            method: "POST",
            auth: getToken(cookies),
            body: form.data
        });
        if (!result.success) {
            switch (
                result.error.message as Exclude<
                    typeof result.error.message,
                    (typeof Errors)["wrongBody"]
                >
            ) {
                case "ID doesn't exist!":
                    //         case Errors.emailNotExist:
                    //             return setError(form, "email", result.error);
                    //         case Errors.wrongPassword:
                    //             return setError(form, "password", result.error);
                    return setError(form, "pokemons", result.error);
            }
        }
        return { form };
    }
};
