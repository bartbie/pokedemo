import { getToken } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";
// import { apiClient } from "$lib/api";
// import { error, type Actions, fail, redirect } from "@sveltejs/kit";
// import {
//     pokemonIdSchema,
//     pokemonTypeSchema,
//     pokemonTypesArr,
//     pokemonTypesArrLowerCase,
//     type PokemonType
// } from "@pokedemo/api";
// import { setError, superValidate } from "sveltekit-superforms/server";
// import { pokemonBaseSchema } from "@pokedemo/api";
// import { z } from "zod";

// const typeSchema = pokemonTypeSchema.or(z.enum(pokemonTypesArrLowerCase));
//
// const correctTypesSchema = z
//     .tuple([pokemonTypeSchema])
//     .or(z.tuple([pokemonTypeSchema, pokemonTypeSchema]));
//
// const typesSchema = z
//     .tuple([typeSchema])
//     .or(z.tuple([typeSchema, typeSchema]))
//     .optional()
//     .default(["NORMAL"])
//     .transform(
//         (val) =>
//             val.map((e) => e.toUpperCase() as PokemonType) as z.infer<typeof correctTypesSchema>
//     );
//
// const updateFormSchema = z.object({
//     name: z.string().nonempty(),
//     height: z.number().positive(),
//     // pokemon weight can be negative, why not
//     weight: z.number(),
//     types: z.string()
// });

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
    return { token: getToken(cookies) };
};
