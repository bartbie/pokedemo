import { getToken } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";
import { apiClient } from "$lib/api";
import { error } from "@sveltejs/kit";
import { pokemonIdSchema } from "@pokedemo/api";

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
    // parse id
    const { id: unparsedId } = params;
    const result = pokemonIdSchema.safeParse(unparsedId);
    if (!result.success) {
        throw error(404, { message: "Pokemon not found!" });
    }
    const id = result.data;

    // find pokemon
    const token = getToken(cookies);
    const api = apiClient(fetch);
    const { data: pokemons } = await api<API["/me"]["/pokemons"]["GET"]>("/api/me/pokemons/", {
        method: "GET",
        auth: token
    });
    const pokemon = pokemons.find((e) => e.pokemon.id === id);
    if (!pokemon) {
        throw error(404, { message: "Pokemon not found!" });
    }
    return { pokemon, token };
};
