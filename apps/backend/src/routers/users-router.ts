import { sql } from "$lib/db";
import { makeEndpoint, makeGetEndpoint } from "$lib/utils/endpoint";
import {
    patchUserSchema,
    type API,
    User,
    Errors,
} from "@pokedemo/api";
import { err, exclude, ok } from "@pokedemo/utils";
import { Router } from "express";
import { authMiddleware, myPokemonsIdMiddleware } from "~/middleware";

type RouterApi = Omit<API["/users"], "/:id">;
type RouterIdApi = API["/users"]["/:id"];

export const usersRouter = Router()
    .use(authMiddleware)
    .get(
        "/",
        makeGetEndpoint<RouterApi["GET"]>(async (req, res) => {
            const users = await sql<User[]>`SELECT id, email, role FROM users;`;
            return res.status(200).json(ok(users));
        })
    )
    .use("/:id", myPokemonsIdMiddleware)
    .get(
        "/:id",
        makeGetEndpoint<RouterIdApi["GET"]>(async (req, res) => {
            // const id = req.params.id as number;
            const user = req.context?.id?.user as User;
            return res.status(200).json(ok(user));
        })
    )
    .delete(
        "/:id",
        makeEndpoint<RouterIdApi["DELETE"]>(null, async (req, res) => {
            const id = req.params.id as number;
            // const user = req.context?.id?.user as User;
            await sql`DELETE FROM users WHERE id = ${id}`;
            return res.status(200).json(ok());
        })
    )
    .patch(
        "/:id",
        makeEndpoint<RouterIdApi["PATCH"]>(
            patchUserSchema,
            async (req, res) => {
                const id = req.params.id as number;
                // const user = req.context?.id?.user as User;
                const newUser = exclude(req.body, ["id"]);
                try {
                    const updatedUser = (
                        await sql<User[]>`UPDATE users SET ${sql(
                            newUser
                        )} WHERE id = ${id} RETURNING id, email, role`
                    )[0];
                    return res.status(200).json(ok(updatedUser));
                } catch (e) {
                    req.log.error(e);
                    return res.status(400).json(err(Errors.wrongId));
                }
            }
        )
    );
