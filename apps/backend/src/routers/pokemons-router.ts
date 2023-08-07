import { Router } from "express";
import { ok } from "@pokedemo/utils";
import { pokemonSchema, type API, Pokemon } from "@pokedemo/api";
import { makeEndpoint, makeGetEndpoint } from "$lib/endpoint";
import { sql } from "$lib/db";

type RouterApi = API["/pokemons"];

const pokemonRouter = Router()
    .get(
        "/",
        makeGetEndpoint<RouterApi["GET"]>(async (req, res) => {
            const query = `SELECT * FROM pokemons`;
            req.log.info(query);
            const result = await sql.unsafe<Required<Pokemon>[]>(query);
            res.status(200).json(ok(result));
        })
    )
    .post(
        "/",
        makeEndpoint<RouterApi["POST"]>(pokemonSchema, async (req, res) => {
            const x = req.body;
        })
    );

export default pokemonRouter;
