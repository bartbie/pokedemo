import { Router } from "express";
import { ok } from "@pokedemo/utils";
import { pokemonSchema, type API } from "@pokedemo/api";
import { makeEndpoint, makeGetEndpoint } from "$lib/endpoint";
import { appRoot } from "$env";
import { z } from "zod";

type RouterApi = API["/pokemons"];

const pokemonRouter = Router()
    .get(
        "/",
        makeGetEndpoint<RouterApi["GET"]>((req, res) => {
            console.log(appRoot);
            const x = req.body;
            res.status(200).json(ok([]));
        })
    )
    .post(
        "/",
        makeEndpoint<RouterApi["POST"]>(pokemonSchema, (req, res) => {
            const x = req.body;
        })
    );

export default pokemonRouter;
