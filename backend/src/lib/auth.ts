import jwt from "jsonwebtoken";
import { env } from "../env";
import { TypedHandler, TypedRequest } from "../app";

export type Context = {
    user: string | jwt.JwtPayload;
};

export type ProtectedRequest<
    ReqBody = Record<string, unknown>,
    QueryString = Record<string, unknown>
> = TypedRequest<ReqBody, QueryString> & {
    context: Context;
};

export type ProtectedHandler<
    req = Record<string, unknown>,
    res = Record<string, unknown>,
    query = Record<string, unknown>
> = TypedHandler<req, res, query, ProtectedRequest<req, query>>;

export const authMiddleware: ProtectedHandler = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, env.AUTH_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            res.sendStatus(403);
            return;
        }
        req.context = {
            user: user as jwt.JwtPayload | string,
        };
    });

    next();
};
