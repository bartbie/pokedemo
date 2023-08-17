import { getToken } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";
import { apiClient } from "$lib/api";
import { error, type Actions, fail, redirect } from "@sveltejs/kit";
import { pokemonIdSchema } from "@pokedemo/api";
import { setError, superValidate } from "sveltekit-superforms/server";
import { pokemonBaseSchema } from "@pokedemo/api";

const updateFormSchema = pokemonBaseSchema.omit({ id: true }).partial();

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
    // parse id
    const { id: unparsedId } = params;
    const id_res = pokemonIdSchema.safeParse(unparsedId);
    if (!id_res.success) {
        throw error(404, { message: "Pokemon not found!" });
    }
    const id = id_res.data;

    // find pokemon
    const token = getToken(cookies);
    const api = apiClient(fetch);
    const result = await api<API["/pokemons"]["/:id"]["GET"]>(`/api/pokemons/${id}`, {
        method: "GET",
        auth: token
    });
    if (!result.success) {
        throw error(404, { message: "Pokemon not found!" });
    }
    const form = await superValidate(updateFormSchema);
    return { pokemon: result.data, form };
};

export const actions: Actions = {
    default: async ({ params, fetch, request, cookies }) => {
        // parse id just in case
        const { id: unparsedId } = params;
        const id_res = pokemonIdSchema.safeParse(unparsedId);
        if (!id_res.success) {
            throw error(404, { message: "Pokemon not found!" });
        }
        const id = id_res.data;

        // form
        const form = await superValidate(request, updateFormSchema);
        if (!form.valid) return fail(400, { form });
        const { data } = form;
        console.log(data);
        // api check
        const api = apiClient(fetch);
        const { data: pokemons } = await api<API["/pokemons"]["GET"]>("/api/pokemons");
        if (pokemons.some(({ name }) => data.name && data.name === name)) {
            return setError(form, "name", "Name already taken!");
        }
        // patch the pokemon
        const res = await api<API["/pokemons"]["/:id"]["PATCH"]>(`/api/pokemons/${id}`, {
            method: "PATCH",
            body: form.data,
            auth: getToken(cookies)
        });

        return { form };
    }
};
