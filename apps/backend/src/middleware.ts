import { logMiddleware } from "$lib/utils/log";
import { authMiddleware } from "$lib/auth";
import { type Handler } from "express";
import { Errors, pokemonIdSchema, userIdSchema } from "@pokedemo/api";
import { err } from "@pokedemo/utils";
import { findPokemon } from "$lib/pokemons";
import { findUser } from "$lib/users";
import { findMyPokemon } from "$lib/me";

/**
 * parses the id param, verifies if it exists in DB and attaches the pokemon to context
 */
export const pokemonIdMiddleware: Handler = async (req, res, next) => {
    req.log.info(`parsing param id: ${req.params.id}`);
    const id = pokemonIdSchema.safeParse(req.params["id"]);
    if (!id.success) {
        req.log.info("wrong id", id.error);
        return res.status(400).json(err(Errors.wrongId));
    }
    const pokemon = await findPokemon(id.data);
    if (pokemon == undefined) {
        return res.status(400).json(err(Errors.wrongId));
    }
    req.params.id = id as any;
    req.context = { id: { pokemon } };
    next();
};

/**
 * parses the id param, verifies if it exists in DB and attaches the user to context
 */
export const userIdMiddleware: Handler = async (req, res, next) => {
    req.log.info(`parsing param id: ${req.params.id}`);
    const id = userIdSchema.safeParse(req.params["id"]);
    if (!id.success) {
        req.log.info("wrong id", id.error);
        return res.status(400).json(err(Errors.wrongId));
    }
    req.params.id = id as any;
    const user = await findUser(id.data);
    if (user == undefined) {
        return res.status(400).json(err(Errors.wrongId));
    }
    req.context = { id: { user } };
    next();
};

/**
 * parses the id param, verifies if it exists in DB and attaches the user to context
 *
 * needs auth middleware in use first
 */
export const myPokemonsIdMiddleware: Handler = async (req, res, next) => {
    req.log.info(`parsing param id: ${req.params.id}`);
    const id = userIdSchema.safeParse(req.params["id"]);
    if (!id.success) {
        req.log.info("wrong id", id.error);
        return res.status(400).json(err(Errors.wrongId));
    }
    req.params.id = id as any;
    if (req.context == undefined || req.context.auth == undefined) {
        // TODO: split Errors.adminNeeded into admin and permission denied
        return res.status(403).json(err(Errors.adminNeeded));
    }
    const userPokemon = await findMyPokemon(id.data, req.context.auth.user.id);
    if (userPokemon == undefined) {
        return res.status(400).json(err(Errors.wrongId));
    }
    req.context = { id: { userPokemon } };
    next();
};

export { authMiddleware, logMiddleware };
