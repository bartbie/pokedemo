import { logMiddleware } from "$lib/log";
import { authMiddleware } from "$lib/auth";
import { type Handler } from "express";
import { Errors, pokemonIdSchema } from "@pokedemo/api";
import { err } from "@pokedemo/utils";

export const IdParseMiddleware: Handler = (req, res, next) => {
    req.log.info(`parsing param id: ${req.params.id}`);
    const id = pokemonIdSchema.safeParse(req.params["id"]);
    if (!id.success) {
        req.log.info("wrong id", id.error);
        return res.status(400).json(err(Errors.wrongId));
    }
    req.params.id = id as any;
    next();
};

export { authMiddleware, logMiddleware };
