import { getToken } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";
import { apiClient } from "$lib/api";
import { error } from "@sveltejs/kit";
import { pokemonIdSchema } from "@pokedemo/api";

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
    return { pokemon: result.data, token: getToken(cookies) };
};
