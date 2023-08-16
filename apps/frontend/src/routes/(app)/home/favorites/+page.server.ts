import { getToken } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";
import { apiClient } from "$lib/api";

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    const api = apiClient(fetch);
    const { data: pokemons } = await api<API["/me"]["/pokemons"]["/favorites"]["GET"]>(
        "/api/me/pokemons/favorites",
        {
            method: "GET",
            auth: getToken(cookies)
        }
    );
    return { pokemons };
};
