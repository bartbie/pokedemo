import { Router } from "express";
import { err, exclude, ok } from "@pokedemo/utils";
import {
    pokemonSchema,
    type API,
    Errors,
    CustomPokemon,
    patchPokemonSchema,
    ExistingPokemon,
    customPokemonSchema,
    pokemonBaseSchema,
} from "@pokedemo/api";
import { makeEndpoint, makeGetEndpoint } from "$lib/utils/endpoint";
import { sql } from "$lib/db";
import {
    authMiddleware,
    pokemonIdContextExtractor,
    pokemonIdMiddleware,
} from "~/middleware";
import { addPokemon, fixArrayEnum, patchPokemon } from "$lib/pokemons";

type PokeApi = Omit<API["/pokemons"], "/custom">; // remove custom so autocmp is less cluttered
type PokeIdApi = PokeApi["/:id"];
type CustomApi = API["/pokemons"]["/custom"];

export const pokemonRouter = Router()
    .get(
        "/",
        makeGetEndpoint<PokeApi["GET"]>(async (req, res) => {
            const params = `SELECT * FROM pokemons`;
            req.log.info(params);
            const result = await sql.unsafe<ExistingPokemon[]>(params);
            res.status(200).json(ok(result));
        })
    )
    .post(
        "/",
        authMiddleware,
        makeEndpoint<PokeApi["POST"]>(pokemonBaseSchema, async (req, res) => {
            const pokemon: CustomPokemon = {
                ...exclude(req.body, ["id"]),
                custom: true,
                pokeId: null,
                sprite: null,
            };
            const result = await addPokemon(pokemon);
            if (!result.success) {
                return res.status(500).json(err("Internal Error!") as any);
            }
            return res.status(200).json(result);
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
    .get(
        "/:id",
        pokemonIdMiddleware,
        makeGetEndpoint<PokeIdApi["GET"]>(async (req, res) => {
            const ctx = pokemonIdContextExtractor(req.context);
            if (!ctx.success) {
                req.log.error("Context didn't have needed elements!");
                return res.status(500).json(err("Internal Error!") as any);
            }
            const { pokemon } = ctx.data;
            res.status(200).json(ok(pokemon));
        })
    )
    .delete(
        "/:id",
        pokemonIdMiddleware,
        authMiddleware,
        makeEndpoint<PokeIdApi["DELETE"]>(null, async (req, res) => {
            const ctx = pokemonIdContextExtractor(req.context);
            if (!ctx.success) {
                req.log.error("Context didn't have needed elements!");
                return res.status(500).json(err("Internal Error!") as any);
            }
            const { pokemon } = ctx.data;
            if (!pokemon.custom) {
                return res.status(400).json(err(Errors.adminNeeded));
            }
            try {
                await sql`DELETE FROM pokemons WHERE id LIKE ${pokemon.id}`;
                return res.status(200).json(ok());
            } catch (e) {
                req.log.error(e);
                return res.status(400).json(err(Errors.wrongId));
            }
        })
    )
    .patch(
        "/:id",
        authMiddleware,
        pokemonIdMiddleware,
        makeEndpoint<PokeIdApi["PATCH"]>(
            patchPokemonSchema,
            async (req, res) => {
                const ctx = pokemonIdContextExtractor(req.context);
                if (!ctx.success) {
                    req.log.error("Context didn't have needed elements!");
                    return res.status(500).json(err("Internal Error!") as any);
                }
                const {
                    pokemon: { custom, id },
                } = ctx.data;
                if (!custom) {
                    return res.status(400).json(err(Errors.adminNeeded));
                }

                const result = await patchPokemon(id, req.body);
                if (!result.success) {
                    return res.status(500).json(err("Internal Errors") as any);
                }
                return res.status(200).json(result);
            }
        )
    );
