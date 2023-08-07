import "module-alias/register"; // set up path aliases
import { Router, default as express, json } from "express";
import { API, HealthCheckMsg } from "@pokedemo/api";
import pokemonRouter from "./routers/pokemons-router";
import { ok } from "@pokedemo/utils";
import { makeGetEndpoint } from "$lib/endpoint";
import { env } from "$env";
import { setupDB } from "$lib/db/setup";

const APIRouter = Router().use("/pokemons", pokemonRouter);

const server = () => {
    const PORT = env.PORT;
    const app = express()
        .use(json())
        .get("/", (_, res) => res.send("Pokedemo server."))
        .get(
            "/api/healthcheck",
            makeGetEndpoint<API["/healthcheck"]["GET"]>((_, res) => {
                res.status(200).json(ok(HealthCheckMsg));
            })
        )
        .use("/api", APIRouter)
        .listen(PORT, () => {
            console.log(
                `⚡️[server]: Server is running at http://localhost:${PORT}`
            );
        });
};

(async () => {
    await setupDB();
    server();
})();
