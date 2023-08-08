import { Router, Request } from "express";
import { err, exclude, ok } from "@pokedemo/utils";
import {
    pokemonSchema,
    type API,
    Pokemon,
    pokemonIdSchema,
    Errors,
} from "@pokedemo/api";
import { makeEndpoint, makeGetEndpoint } from "$lib/endpoint";
import { sql } from "$lib/db";

const findPokemon = async (
    id: number
): Promise<Required<Pokemon> | undefined> => {
    return (
        await sql<
            Required<Pokemon>[]
        >`SELECT * FROM pokemons WHERE id LIKE ${id} LIMIT 1`
    ).at(0);
};

type PokeApi = Omit<API["/pokemons"], "/custom">; // remove custom so autocmp is less cluttered
export const pokemonRouter = Router()
    .get(
        "/",
        makeGetEndpoint<PokeApi["GET"]>(async (req, res) => {
            const query = `SELECT * FROM pokemons`;
            req.log.info(query);
            const result = await sql.unsafe<Required<Pokemon>[]>(query);
            res.status(200).json(ok(result));
        })
    )
    .post(
        "/",
        makeEndpoint<PokeApi["POST"]>(pokemonSchema, async (req, res) => {
            const pokemon = req.body;
            // TODO
        })
    );

type PokeIdApi = PokeApi["/:id"];
const pokemonIdRouter = Router()
    .use((req, res, next) => {
        const id = pokemonIdSchema.safeParse(req.query["id"]);
        if (!id.success) {
            return res.status(400).json(err(Errors.wrongId));
        }
        next();
    })
    .get(
        "/:id",
        makeGetEndpoint<PokeIdApi["GET"]>(async (req, res) => {
            const id = req.query.id as any as number;
            const pokemon = await findPokemon(id);
            if (pokemon == undefined) {
                return res.status(400).json(err(Errors.wrongId));
            }
            res.status(200).json(ok(pokemon));
        })
    )
    .delete(
        "/:id",
        makeEndpoint<PokeIdApi["DELETE"]>(null, async (req, res) => {
            const id = req.query.id as any as number;
            const pokemon = await findPokemon(id);
            if (pokemon == undefined) {
                return res.status(400).json(err(Errors.wrongId));
            }
            try {
                await sql`DELETE FROM pokemons id LIKE ${id}`;
            } catch (e) {
                req.log.error(e);
            }
            res.status(200).json(ok());
        })
    )
    .patch(
        "/:id",
        makeEndpoint<PokeIdApi["PATCH"]>(pokemonSchema, async (req, res) => {
            const id = req.query.id as any as number;
            const pokemon = exclude(req.body, ["id"]);
            try {
                await sql`UPDATE pokemons SET ${sql(pokemon)} WHERE id = ${id}`;
            } catch (e) {
                req.log.error(e);
            }
        })
    );

type CustomApi = API["/pokemons"]["/custom"];
const customRouter = Router().get(
    "/",
    makeGetEndpoint<CustomApi["GET"]>(async (req, res) => {
        const pokemons = await sql<
            Pokemon[]
        >`SELECT * from pokemons where "pokeId" IS NULL`;
    })
);

pokemonRouter.use(pokemonIdRouter);
pokemonRouter.use(customRouter);
/*
    `SELECT pokemons.*, favorite LEFT FROM users_pokemons LEFT JOIN pokemons ON
 pokemons.id = users_pokemons.pokemon_id WHERE users_pokemons.user_id = 1`;
 */
