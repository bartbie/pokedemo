import { getToken } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";
import { apiClient } from "$lib/api";
import { error, type Actions, fail, redirect } from "@sveltejs/kit";
import {
    pokemonIdSchema,
    pokemonTypeSchema,
    pokemonTypesArr,
    pokemonTypesArrLowerCase,
    type PokemonType
} from "@pokedemo/api";
import { setError, superValidate } from "sveltekit-superforms/server";
import { pokemonBaseSchema } from "@pokedemo/api";
import { z } from "zod";

const typeSchema = pokemonTypeSchema.or(z.enum(pokemonTypesArrLowerCase));

const correctTypesSchema = z
    .tuple([pokemonTypeSchema])
    .or(z.tuple([pokemonTypeSchema, pokemonTypeSchema]));

const typesSchema = z
    .tuple([typeSchema])
    .or(z.tuple([typeSchema, typeSchema]))
    .optional()
    .default(["NORMAL"])
    .transform(
        (val) =>
            val.map((e) => e.toUpperCase() as PokemonType) as z.infer<typeof correctTypesSchema>
    );

const updateFormSchema = z.object({
    name: z.string().nonempty(),
    height: z.number().positive(),
    // pokemon weight can be negative, why not
    weight: z.number(),
    types: z.string()
});

const parseTypes = (s: string) => {
    console.log("PARSING", S);
    try {
        const x = JSON.parse(s);
        return typesSchema.parse(x);
    } catch {
        return null;
    }
};

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
    const form = await superValidate(updateFormSchema);
    return { form };
};

export const actions: Actions = {
    default: async ({ fetch, request, cookies }) => {
        // form
        const form = await superValidate(request, updateFormSchema);
        if (!form.valid) return fail(400, { form });
        const { data } = form;
        console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa", data);

        // verify types
        const types = parseTypes(data.types);
        console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa", types);
        if (types == null) {
            return setError(form, "types", "Wrong pokemon types!");
        }

        // api check
        const api = apiClient(fetch);
        const { data: pokemons } = await api<API["/pokemons"]["GET"]>("/api/pokemons");
        if (pokemons.some(({ name }) => data.name && data.name === name)) {
            return setError(form, "name", "Name already taken!");
        }

        // patch the pokemon
        const res = await api<API["/pokemons"]["POST"]>(`/api/pokemons`, {
            method: "POST",
            body: { ...data, types },
            auth: getToken(cookies)
        });
        console.log(res);

        return { form };
    }
};
