import { default as express, json } from "express";
import pokemonRouter from "./routers/pokemons-router";
import { API, HealthCheckMsg } from "@pokedemo/api";
import { ok } from "@pokedemo/utils";
import { makeGetEndpoint } from "./utils";

const PORT = 3000;
const app = express()
    .use(json())
    .get("/", (_, res) => res.send("Pokedemo server."))
    .get(
        "/api/healthcheck",
        makeGetEndpoint<API["/healthcheck"]["GET"]>((_, res) => {
            res.status(200).json(ok(HealthCheckMsg));
        })
    );

// Routers

app.use("/api/pokemons", pokemonRouter);

app.listen(PORT, () => {
    console.log(
        // TODO: make localhost only show up on dev
        `⚡️[server]: Server is running at http://localhost:${PORT}`
    );
});
