import { logMiddleware } from "$lib/utils/log";
import { authMiddleware } from "$lib/auth";
import { type Handler } from "express";
import { Errors, pokemonIdSchema, userIdSchema } from "@pokedemo/api";
import { ok, err } from "@pokedemo/utils";
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
        req.log.warn("wrong id", id.error.flatten().fieldErrors);
        return res.status(400).json(err(Errors.wrongId));
    }
    const pokemon = await findPokemon(id.data);
    if (pokemon == undefined) {
        return res.status(400).json(err(Errors.wrongId));
    }
    req.params.id = id.data satisfies number as any;
    req.context = { ...req.context, id: { pokemon } };
    next();
};

/**
 * parses the id param, verifies if it exists in DB and attaches the user to context
 */
export const userIdMiddleware: Handler = async (req, res, next) => {
    req.log.info(`parsing param id: ${req.params.id}`);
    const id = userIdSchema.safeParse(req.params["id"]);
    if (!id.success) {
        req.log.warn("wrong id", id.error.flatten().fieldErrors);
        return res.status(400).json(err(Errors.wrongId));
    }
    req.params.id = id.data satisfies number as any;
    const user = await findUser(id.data);
    if (user == undefined) {
        return res.status(400).json(err(Errors.wrongId));
    }
    req.context = { ...req.context, id: { user } };
    next();
};

/**
 * parses the id param, verifies if it exists in DB and attaches the user to context
 *
 * needs auth middleware in use first
 */
export const myPokemonsIdMiddleware: Handler = async (req, res, next) => {
    // check if auth was passed
    if (!req.context?.auth?.user) {
        // TODO: split Errors.adminNeeded into admin and permission denied
        req.log.warn("admin needed");
        return res.status(403).json(err(Errors.adminNeeded));
    }

    // parse pokemon id
    req.log.info(`parsing param id: ${req.params.id}`);
    const id = pokemonIdSchema.safeParse(req.params["id"]);
    if (!id.success) {
        req.log.warn("wrong id", id.error.flatten().fieldErrors);
        return res.status(400).json(err(Errors.wrongId));
    }
    req.params.id = id.data satisfies number as any;
    // find the pokemon
    const userPokemon = await findMyPokemon(id.data, req.context.auth.user.id);
    if (userPokemon == undefined) {
        req.log.warn("can't find pokemon", id.data);
        return res.status(400).json(err(Errors.wrongId));
    }
    req.context = { ...req.context, id: { userPokemon } };
    next();
};

export { authMiddleware, logMiddleware };

export const myPokemonsIdContextExtractor = (ctx: Context | undefined) => {
    const user = ctx?.auth?.user;
    const pokemon = ctx?.id?.userPokemon;
    if (!user || !pokemon) {
        return err();
    }
    return ok({ user, pokemon });
};

export const userContextExtractor = (ctx: Context | undefined) => {
    const user = ctx?.auth?.user;
    if (!user) {
        return err();
    }
    return ok({ user });
};

export const pokemonIdContextExtractor = (ctx: Context | undefined) => {
    const pokemon = ctx?.id?.pokemon;
    if (!pokemon) {
        return err();
    }
    return ok({ pokemon });
};
