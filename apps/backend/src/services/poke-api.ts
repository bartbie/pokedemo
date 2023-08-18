import { sql } from "$lib/db";
import { ExistingPokemon } from "@pokedemo/api";
import { exclude } from "@pokedemo/utils";
import fetch, { Response } from "node-fetch";
import { z } from "zod";

const fetchAll = async () => {
    const index = (await (
        await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=3000")
    ).json()) as {
        count: number;
        next: null;
        previous: null;
        results: { name: string; url: string }[];
    };
    const promises = index.results.map(({ url }) => fetch(url));
    const results = await Promise.allSettled(promises);
    const errors = results.filter((r) => r.status == "rejected");
    const successes = results
        .filter(
            (r): r is PromiseFulfilledResult<Response> =>
                r.status === "fulfilled"
        )
        .map((r) => r.value);
    if (errors.length) console.error("Coudn't fetch these:", errors);
    return successes;
};

// schema to strip to only elements we care about
// PERF: idc
const apiPokemonSchema = z
    .object({
        id: z.number(),
        name: z.string(),
        weight: z.number(),
        height: z.number(),
        sprites: z
            .object({
                front_default: z.string().nullish(),
            })
            .transform((e) => e.front_default),
        types: z
            .array(z.object({ type: z.object({ name: z.string() }) }))
            .transform((i) => i.map((e) => e.type.name.toUpperCase()))
            .transform((e) => `{${e}}`),
    })
    .transform((e) =>
        exclude({ ...e, pokeId: e.id, custom: false, sprite: e.sprites }, [
            "id",
            "sprites",
        ])
    );

export const getAll = async () => {
    const promises = (await fetchAll()).map((e) => e.json());
    const results = (await Promise.all(promises)) as unknown[];
    return results
        .map((e) => apiPokemonSchema.parse(e))
        .filter((e) => e.sprite != null);
};

export const populate = async () => {
    const apiPokemons = await getAll();
    console.debug(apiPokemons);
    await sql`insert into pokemons ${sql(apiPokemons)}`;
};
