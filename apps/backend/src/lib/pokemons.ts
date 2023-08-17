import {
    CustomPokemon,
    ExistingPokemon,
    PatchPokemon,
    Pokemon,
    PokemonId,
} from "@pokedemo/api";
import { sql } from "./db";
import { logger } from "./utils/log";
import { err, exclude, ok } from "@pokedemo/utils";

export const findPokemon = async (
    id: number
): Promise<Required<Pokemon> | undefined> => {
    return (
        await sql<
            Required<Pokemon>[]
        >`SELECT * FROM pokemons WHERE id = ${id} LIMIT 1`
    ).at(0);
};

export const fixArrayEnum = <T extends { types?: Pokemon["types"] }>(
    pokemon: T
) => {
    if ("types" in pokemon) {
        pokemon.types = convertTypes(pokemon.types as Pokemon["types"]) as any;
    }
    return pokemon;
};

const convertTypes = (types: Pokemon["types"]) => "{" + types + "}";
// .map((e) => `"${e}"`)

export const patchPokemon = async (id: PokemonId, pokemon: PatchPokemon) => {
    try {
        const updatedPokemon = await sql.begin(async (sql) => {
            const types = pokemon.types && convertTypes(pokemon.types);

            await sql`UPDATE pokemons SET ${sql(
                exclude(pokemon, ["id", "pokeId", "custom", "types", "sprite"])
            )} WHERE id = ${id}`;

            if (types) {
                return (
                    await sql.unsafe<ExistingPokemon[]>(
                        `UPDATE pokemons SET types = '${types}' WHERE id = ${id} RETURNING *;`
                    )
                )[0];
            } else {
                return (
                    await sql<
                        ExistingPokemon[]
                    >`SELECT * FROM pokemons WHERE id = ${id};`
                )[0];
            }
        });
        return ok(updatedPokemon);
    } catch (e) {
        logger.error(e);
        return err();
    }
};

export const addPokemon = async (pokemon: CustomPokemon) => {
    try {
        const types = convertTypes(pokemon.types);
        const pok = exclude(pokemon, ["id", "types"]);
        const newPokemon = await sql.begin(async (sql) => {
            const { id } = (
                await sql<ExistingPokemon[]>`INSERT INTO pokemons ${sql(
                    pok
                )} RETURNING *;`
            )[0];

            return (
                await sql.unsafe<ExistingPokemon[]>(
                    `UPDATE pokemons SET types = '${types}' WHERE id = ${id} RETURNING *;`
                )
            )[0];
        });
        return ok(newPokemon);
    } catch (e) {
        logger.error(e);
        return err();
    }
};
