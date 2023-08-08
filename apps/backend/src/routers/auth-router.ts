import { Router } from "express";
import { err, ok } from "@pokedemo/utils";
import {
    type API,
    userCredentialsSchema,
    tokenRequestSchema,
    Errors,
} from "@pokedemo/api";
import { makeEndpoint } from "$lib/endpoint";
import { login, signup, verifyToken } from "$lib/auth";

type RouterApi = API["/auth"];

export const authRouter = Router()
    .post(
        "/login",
        makeEndpoint<RouterApi["/login"]["POST"]>(
            userCredentialsSchema,
            async (req, res) => {
                const result = await login(req.body);
                if (!result.success) {
                    switch (result.error) {
                        case "User not found":
                            req.log.info(
                                `login attempt failed: ${req.body.email} - Email doesn't exist`
                            );
                            res.status(403).json(err(Errors.emailNotExist));
                            return;
                        case "Wrong password":
                            req.log.info(
                                `login attempt failed: ${req.body.email} - wrong password`
                            );
                            res.status(403).json(err(Errors.wrongPassword));
                            return;
                    }
                }
                const user = result.data;
                req.log.info(`login attempt successful: ${user}`);
                res.status(200).json(ok(user));
            }
        )
    )
    .post(
        "/logout",
        makeEndpoint<RouterApi["/logout"]["POST"]>(
            tokenRequestSchema,
            async (req, res) => {
                // TODO in future save sessions to DB
                // for now we just return ok or err
                if ((await verifyToken(req.body.token)) == null) {
                    return res.status(200).json(err(Errors.wrongToken));
                }
                res.status(200).send(ok());
            }
        )
    )
    .post(
        "/signup",
        makeEndpoint<RouterApi["/signup"]["POST"]>(
            userCredentialsSchema,
            async (req, res) => {
                const user = await signup(req.body);
                if (user == null) {
                    return res.status(400).json(err(Errors.emailTaken));
                }
                return res.status(200).json(ok(user));
            }
        )
    )
    .post(
        "/verify",
        makeEndpoint<RouterApi["/verify"]["POST"]>(
            tokenRequestSchema,
            async (req, res) => {
                const user = await verifyToken(req.body.token);
                if (user == null) {
                    return res.status(200).json(err(Errors.wrongToken));
                }
                res.status(200).send(ok(user));
            }
        )
    );
