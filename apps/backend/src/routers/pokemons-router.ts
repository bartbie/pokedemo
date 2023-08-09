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
import { makeEndpoint, makeGetEndpoint } from "$lib/utils/endpoint";
import { sql } from "$lib/db";
import { pokemonIdMiddleware } from "~/middleware";
import { findPokemon } from "$lib/pokemons";

type PokeApi = Omit<API["/pokemons"], "/custom">; // remove custom so autocmp is less cluttered
type PokeIdApi = PokeApi["/:id"];
type CustomApi = API["/pokemons"]["/custom"];

// TODO fix pokemonTypes insertion into db
// TODO add authMiddleware
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
                const newPokemon = (
                    await sql<
                        Required<Pokemon>[]
                    >`INSERT INTO pokemons VALUES ${sql(pokemon)} RETURNING *;`
                )[0];
                return res.status(200).json(ok(newPokemon));
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
    .use("/:id", pokemonIdMiddleware)
    .get(
        "/:id",
        makeGetEndpoint<PokeIdApi["GET"]>(async (req, res) => {
            const id = req.params.id as number;
            const pokemon = req.context?.id?.pokemon as Required<Pokemon>;
            res.status(200).json(ok(pokemon));
        })
    )
    .delete(
        "/:id",
        makeEndpoint<PokeIdApi["DELETE"]>(null, async (req, res) => {
            const id = req.params.id as number;
            const pokemon = req.context?.id?.pokemon as Required<Pokemon>;
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
                const _pokemon = req.context?.id?.pokemon as Required<Pokemon>;

                const newPokemon = exclude(req.body, ["id"]);
                try {
                    const updatedPokemon = (
                        await sql<
                            Required<Pokemon>[]
                        >`UPDATE pokemons SET ${sql(
                            newPokemon
                        )} WHERE id = ${id} RETURNING *;`
                    )[0];
                    return res.status(200).json(ok(updatedPokemon));
                } catch (e) {
                    req.log.error(e);
                    return res.status(400).json(err(Errors.wrongId));
                }
            }
        )
    );
