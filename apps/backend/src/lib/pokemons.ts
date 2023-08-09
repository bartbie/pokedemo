import { Pokemon } from "@pokedemo/api";
import { sql } from "./db";

export const findPokemon = async (
    id: number
): Promise<Required<Pokemon> | undefined> => {
    return (
        await sql<
            Required<Pokemon>[]
        >`SELECT * FROM pokemons WHERE id = ${id} LIMIT 1`
    ).at(0);
};

export const fixArrayEnum = (pokemon: { type?: Pokemon["type"] }) => {
    if ("type" in pokemon) {
        pokemon.type = `{${pokemon.type}}` as any;
    }
    return pokemon;
};
