import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { apiClient } from "$lib/api";

export const load: PageServerLoad = async ({ locals, fetch, cookies }) => {
    if (!locals.user) {
        throw redirect(303, "/");
    }
    const api = apiClient(fetch);
    const { data: pokemons } = await api<API["/pokemons"]["GET"]>("/api/pokemons", {
        method: "GET"
    });
    console.log(pokemons);
    return { pokemons };
};
