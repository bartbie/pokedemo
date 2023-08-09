import "module-alias/register"; // set up path aliases
//
import { default as express, json, Router } from "express";
import { API, HealthCheckMsg } from "@pokedemo/api";
import { ok } from "@pokedemo/utils";
import { env } from "$env";
import { makeGetEndpoint } from "$lib/utils/endpoint";
import { setupDB } from "$lib/db/setup";
import { logger, logMiddleware } from "$lib/utils/log";
import { pokemonRouter } from "./routers/pokemons-router";
import { authRouter } from "./routers/auth-router";

const APIRouter = Router()
    .use("/pokemons", pokemonRouter)
    .use("/auth", authRouter)
    .get(
        "/healthcheck",
        makeGetEndpoint<API["/healthcheck"]["GET"]>((_, res) => {
            res.status(200).json(ok(HealthCheckMsg));
        })
    );

const server = () => {
    const PORT = env.PORT;
    const app = express()
        .use(json())
        .use(logMiddleware)
        .get("/", (_, res) => res.send("Pokedemo server."))
        .use("/api", APIRouter)
        .listen(PORT, () => {
            logger.info(
                `⚡️[server]: Server is running at http://localhost:${PORT}`
            );
        });
};

(async () => {
    await setupDB();
    server();
})();
