import type {
    ExistingPokemon,
    PokemonId,
    User,
    UserId,
    UserPokemon,
    UserPokemonId,
} from "@pokedemo/api";
import { sql } from "./db";
import { exclude } from "@pokedemo/utils";

type SqlPokemon = ExistingPokemon & { favorite: boolean };

const convert = (sqlPokemon: SqlPokemon): UserPokemon =>
    ({
        favorite: sqlPokemon.favorite,
        pokemon: exclude(sqlPokemon, ["favorite"]),
    } as UserPokemon);

const convertToTable = (userId: UserId, { id, favorite }: UserPokemonId) => ({
    pokemon_id: id,
    user_id: userId,
    favorite,
});

export const findMyPokemon = async (pokeId: PokemonId, userId: UserId) => {
    const userPokemon = (
        await sql<SqlPokemon[]>`
        SELECT pokemons.*, favorite
        FROM users_pokemons
        LEFT JOIN pokemons
        ON pokemons.id = users_pokemons.pokemon_id
        WHERE
        users_pokemons.user_id = ${userId}
        AND pokemons.id = ${pokeId}`
    ).at(0);
    return userPokemon && convert(userPokemon);
};

export const getMyPokemons = async (userId: UserId) => {
    const myPokemons = await sql<SqlPokemon[]>`
        SELECT pokemons.*, favorite
        FROM users_pokemons
        LEFT JOIN pokemons
        ON pokemons.id = users_pokemons.pokemon_id
        WHERE users_pokemons.user_id = ${userId}`;
    return myPokemons.map(convert);
};

export const getMyFavPokemons = async (userId: UserId) => {
    return await sql<ExistingPokemon[]>`
        SELECT pokemons.*
        FROM users_pokemons
        LEFT JOIN pokemons
        ON pokemons.id = users_pokemons.pokemon_id
        WHERE users_pokemons.user_id = ${userId}
        AND users_pokemons.favorite = true`;
};

export const addOneToMyPokemons = async (
    userId: UserId,
    userPokemonId: UserPokemonId
) => {
    try {
        await sql`INSERT INTO users_pokemons ${sql(
            convertToTable(userId, userPokemonId)
        )}`;
        return true;
    } catch (e) {
        return false;
    }
};

export const addManyToMyPokemons = async (
    userId: UserId,
    userPokemonIds: UserPokemonId[]
) => {
    try {
        await sql`INSERT INTO users_pokemons ${sql(
            userPokemonIds.map((e) => convertToTable(userId, e))
        )}`;
        return true;
    } catch (e) {
        return false;
    }
};

export const deleteManyFromMyPokemons = async (
    userId: UserId,
    pokemonIds: PokemonId[]
) => {
    try {
        await sql`
        DELETE FROM users_pokemons
        WHERE user_id = ${userId}
        AND pokemon_id IN ${sql(pokemonIds)}`;
        return true;
    } catch (e) {
        return false;
    }
};

const changeManyFav = async (
    userId: UserId,
    pokemonIds: PokemonId[],
    favorite: boolean
) => {
    try {
        await sql`
        UPDATE users_pokemons SET favorite = ${favorite}
        WHERE user_id = ${userId}
        AND pokemon_id IN ${sql(pokemonIds)}`;
        return true;
    } catch (e) {
        return false;
    }
};

export const addManyToFav = async (userId: UserId, pokemonIds: PokemonId[]) =>
    changeManyFav(userId, pokemonIds, true);

export const deleteManyFromFav = async (
    userId: UserId,
    pokemonIds: PokemonId[]
) => changeManyFav(userId, pokemonIds, false);

export const addToFav = async (userId: UserId, pokemonId: PokemonId) =>
    addManyToFav(userId, [pokemonId]);
export const deleteFromFav = async (userId: UserId, pokemonId: PokemonId) =>
    deleteManyFromFav(userId, [pokemonId]);
