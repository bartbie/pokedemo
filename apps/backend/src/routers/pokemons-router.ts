import { Router } from "express";
import { err, exclude, ok } from "@pokedemo/utils";
import {
    pokemonSchema,
    type API,
    Pokemon,
    Errors,
    CustomPokemon,
    patchPokemonSchema,
} from "@pokedemo/api";
import { makeEndpoint, makeGetEndpoint } from "$lib/endpoint";
import { sql } from "$lib/db";
import { IdParseMiddleware } from "~/middleware";

const findPokemon = async (
    id: number
): Promise<Required<Pokemon> | undefined> => {
    return (
        await sql<
            Required<Pokemon>[]
        >`SELECT * FROM pokemons WHERE id = ${id} LIMIT 1`
    ).at(0);
};

type PokeApi = Omit<API["/pokemons"], "/custom">; // remove custom so autocmp is less cluttered
type PokeIdApi = PokeApi["/:id"];
type CustomApi = API["/pokemons"]["/custom"];

// TODO fix pokemonTypes insertion into db
export const pokemonRouter = Router()
    .get(
        "/",
        makeGetEndpoint<PokeApi["GET"]>(async (req, res) => {
            const params = `SELECT * FROM pokemons`;
            req.log.info(params);
            const result = await sql.unsafe<Required<Pokemon>[]>(params);
            res.status(200).json(ok(result));
        })
    )
    .post(
        "/",
        makeEndpoint<PokeApi["POST"]>(pokemonSchema, async (req, res) => {
            const pokemon = exclude(req.body, ["id"]);
            try {
                await sql`INSERT INTO pokemons VALUES ${sql(pokemon)};`;
                return res.status(200).json(ok());
            } catch (e) {
                req.log.error(e);
                return res.status(200).json(err(Errors.wrongBody));
            }
        })
    )
    .get(
        "/custom",
        makeGetEndpoint<CustomApi["GET"]>(async (req, res) => {
            const customs = await sql<
                Required<CustomPokemon>[]
            >`SELECT * from pokemons where "pokeId" IS NULL`;
            return res.status(200).json(ok(customs));
        })
    )
    .use("/:id", IdParseMiddleware)
    .get(
        "/:id",
        makeGetEndpoint<PokeIdApi["GET"]>(async (req, res) => {
            const id = req.params.id as number;
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
            const id = req.params.id as number;
            const pokemon = await findPokemon(id);
            if (pokemon == undefined) {
                return res.status(400).json(err(Errors.wrongId));
            }
            try {
                await sql`DELETE FROM pokemons id LIKE ${id}`;
                return res.status(200).json(ok());
            } catch (e) {
                req.log.error(e);
                return res.status(400).json(err(Errors.wrongId));
            }
        })
    )
    .patch(
        "/:id",
        makeEndpoint<PokeIdApi["PATCH"]>(
            patchPokemonSchema,
            async (req, res) => {
                const id = req.params.id as number;
                const pokemon = exclude(req.body, ["id"]);
                try {
                    await sql`UPDATE pokemons SET ${sql(
                        pokemon
                    )} WHERE id = ${id}`;
                    return res.status(200).json(ok());
                } catch (e) {
                    req.log.error(e);
                    return res.status(400).json(err(Errors.wrongId));
                }
            }
        )
    );
