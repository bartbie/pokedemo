import { env } from "$env";
import {
    Errors,
    FullUser,
    User,
    UserCredentials,
    authTokenSchema,
    userSchema,
    tokenResponseSchema,
    AuthToken,
} from "@pokedemo/api";
import { ok, err, exclude } from "@pokedemo/utils";
import { Handler } from "express";
import { IncomingHttpHeaders } from "http";
import jwt from "jsonwebtoken";
import { sql } from "$lib/db";

// Token

const getToken = async (headers: IncomingHttpHeaders) => {
    const authHeader = headers.authorization;
    return authHeader && authHeader.split(" ")[1];
};

const createToken = (usr: AuthToken) => {
    // just for safety strip usr of any garbage
    return jwt.sign(authTokenSchema.strip().parse(usr), env.AUTH_SECRET);
};

export const verifyToken = async (token: string) => {
    const payload = jwt.verify(token, env.AUTH_SECRET);
    const result = authTokenSchema.strict().safeParse(payload);
    if (!result.success) return null;
    return await findUser(result.data);
};

// DB

const findUser = async (
    user: Pick<User, "email"> & Partial<Pick<User, "role">>
): Promise<User | null> => {
    if (user.role != undefined) {
        const foundUser = await sql<
            User[]
        >`SELECT id, email, role, FROM users WHERE email LIKE ${user.email} AND role LIKE ${user.role} LIMIT 1`;
        return foundUser.at(0) || null;
    } else {
        const foundUser = await sql<
            User[]
        >`SELECT id, email, role, FROM users WHERE email LIKE ${user.email} LIMIT 1`;
        return foundUser.at(0) || null;
    }
};

const createUser = async (cred: UserCredentials) => {
    const foundUser = await findUser(cred);
    if (foundUser != null) return null;
    return (
        await sql<
            User[]
        >`INSERT INTO users (email, password) VALUES (${cred.email}, ${cred.password}) RETURNING id, email, role;`
    )[0];
};

// exported utils

export const authMiddleware: Handler = async (req, res, next) => {
    const token = await getToken(req.headers);
    if (token == null) {
        req.log.info("Authentication failed: no token");
        res.status(401).send(err(Errors.adminNeeded));
        return;
    }
    const user = await verifyToken(token);
    if (user == null) {
        req.log.info("Authentication failed: wrong token schema");
        res.status(403).send(err(Errors.adminNeeded));
        return;
    }
    req.context = { auth: { user } };
    next();
};

export const login = async (cred: UserCredentials) => {
    const foundUser = (
        await sql<
            FullUser[]
        >`SELECT id, email, role, password FROM users WHERE email LIKE ${cred.email} LIMIT 1`
    ).at(0);
    if (foundUser == undefined) {
        return err("User not found" as const);
    }
    if (cred.password != foundUser.password) {
        return err("Wrong password" as const);
    }
    const user = exclude(foundUser, ["password"]);
    const token = createToken(user);
    return ok({ user, token });
};

export const signup = async (cred: UserCredentials) => {
    const user = await createUser(cred);
    if (user != null) {
        const token = createToken(user);
        return { user, token };
    }
    return null;
};
