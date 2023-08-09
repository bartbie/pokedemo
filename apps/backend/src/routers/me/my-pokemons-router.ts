/*
    `SELECT pokemons.*, favorite LEFT FROM users_pokemons LEFT JOIN pokemons ON
 pokemons.id = users_pokemons.pokemon_id WHERE users_pokemons.user_id = 1`;
 */
import {
    addManyToFav,
    addManyToMyPokemons,
    addToFav,
    deleteFromFav,
    deleteManyFromFav,
    deleteManyFromMyPokemons,
    getMyFavPokemons,
    getMyPokemons,
} from "$lib/me";
import { makeEndpoint, makeGetEndpoint } from "$lib/utils/endpoint";
import {
    type API,
    Errors,
    pokemonIdSchema,
    userPokemonIdSchema,
    PokemonId,
    UserId,
} from "@pokedemo/api";
import { err, ok } from "@pokedemo/utils";
import { Router } from "express";
import { z } from "zod";
import { authMiddleware, myPokemonsIdMiddleware } from "~/middleware";

type RouterApi = API["/me"]["/pokemons"];
type FavRouterApi = Omit<RouterApi["/favorites"], "/:id">;
type FavIdRouterApi = RouterApi["/favorites"]["/:id"];

const putRequestSchema = z.object({
    pokemons: userPokemonIdSchema.array(),
});

const idRequestSchema = z.object({
    id: pokemonIdSchema.array(),
});

export const myPokemonsRouter = Router()
    .use(authMiddleware)
    .get(
        "/",
        makeGetEndpoint<RouterApi["GET"]>(async (req, res) => {
            const userId = req.context?.auth?.user.id as UserId;
            const pokemons = await getMyPokemons(userId);
            return res.status(200).json(ok(pokemons));
        })
    )
    .put(
        "/",
        makeEndpoint<RouterApi["PUT"]>(putRequestSchema, async (req, res) => {
            const userId = req.context?.auth?.user.id as UserId;
            const pokemons = req.body.pokemons;
            if (await addManyToMyPokemons(userId, pokemons)) {
                return res.status(200).json(ok());
            }
            req.log.info("One of the ids is wrong.");
            return res.status(400).json(err({ message: Errors.wrongId }));
        })
    )
    .delete(
        "/",
        makeEndpoint<RouterApi["DELETE"]>(idRequestSchema, async (req, res) => {
            const userId = req.context?.auth?.user.id as UserId;
            const pokemons = req.body.id;
            if (await deleteManyFromMyPokemons(userId, pokemons)) {
                return res.status(200).json(ok());
            }
            req.log.info("One of the ids is wrong.");
            return res.status(400).json(err({ message: Errors.wrongId }));
        })
    )
    .get(
        "/favorites",
        makeGetEndpoint<FavRouterApi["GET"]>(async (req, res) => {
            const userId = req.context?.auth?.user.id as UserId;
            return res.status(200).json(ok(await getMyFavPokemons(userId)));
        })
    )
    .put(
        "/favorites",
        makeEndpoint<FavRouterApi["PUT"]>(idRequestSchema, async (req, res) => {
            const userId = req.context?.auth?.user.id as UserId;
            if (await addManyToFav(userId, req.body.id)) {
                return res.status(200).json(ok());
            }
            req.log.info("One of the ids is wrong.");
            return res.status(400).json(err({ message: Errors.wrongId }));
        })
    )
    .delete(
        "/favorites",
        makeEndpoint<FavRouterApi["DELETE"]>(
            idRequestSchema,
            async (req, res) => {
                const userId = req.context?.auth?.user.id as UserId;
                if (await deleteManyFromFav(userId, req.body.id)) {
                    return res.status(200).json(ok());
                }
                req.log.info("One of the ids is wrong.");
                return res.status(400).json(err({ message: Errors.wrongId }));
            }
        )
    )
    .use("/favorites/:id", myPokemonsIdMiddleware)
    .post(
        "/favorites/:id",
        makeEndpoint<FavIdRouterApi["POST"]>(null, async (req, res) => {
            const userId = req.context?.auth?.user.id as UserId;
            const pokemonId = req.context?.id?.pokemon?.id as PokemonId;
            if (await addToFav(userId, pokemonId)) {
                return res.status(200).json(ok());
            }
            req.log.info("One of the ids is wrong.");
            return res.status(400).json(err(Errors.wrongId));
        })
    )
    .delete(
        "/favorites/:id",
        makeEndpoint<FavIdRouterApi["DELETE"]>(null, async (req, res) => {
            const userId = req.context?.auth?.user.id as UserId;
            const pokemonId = req.context?.id?.pokemon?.id as PokemonId;
            if (await deleteFromFav(userId, pokemonId)) {
                return res.status(200).json(ok());
            }
            req.log.info("One of the ids is wrong.");
            return res.status(400).json(err(Errors.wrongId));
        })
    );
