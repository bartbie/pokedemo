import { Router } from "express";
import { ok } from "@pokedemo/utils";
import { type API } from "@pokedemo/api";
import { makeEndpoint, makeGetEndpoint } from "../utils";

type RouterApi = API["/pokemons"];

const pokemonRouter = Router();

pokemonRouter.get(
    "/",
    makeGetEndpoint<RouterApi["GET"]>((req, res) => {
        const x = req.body;
        res.status(200).json(ok([]));
    })
);

export default pokemonRouter;
