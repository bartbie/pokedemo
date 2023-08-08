import { env } from "$env";
import {
    FullUser,
    User,
    UserCredentials,
    authTokenSchema,
    userSchema,
} from "@pokedemo/api";
import { ok, err, exclude } from "@pokedemo/utils";
import { Handler } from "express";
import { IncomingHttpHeaders } from "http";
import jwt from "jsonwebtoken";
import { sql } from "$lib/db";

const getToken = async (headers: IncomingHttpHeaders) => {
    const authHeader = headers["authorization"];
    return authHeader && authHeader.split(" ")[1];
};

const findUser = async (
    user: Pick<User, "email"> & Partial<Pick<User, "role">>
): Promise<User | null> => {
    if (user.role != undefined) {
        const foundUser = await sql<
            User[]
        >`SELECT id, email, role, FROM users WHERE email LIKE ${user.email} AND role LIKE ${user.role} LIMIT 1`;
        return foundUser[0] || null;
    } else {
        const foundUser = await sql<
            User[]
        >`SELECT id, email, role, FROM users WHERE email LIKE ${user.email} LIMIT 1`;
        return foundUser[0] || null;
    }
};

const createUser = async (cred: UserCredentials) => {
    const foundUser = await findUser(cred);
    if (foundUser != null) return null;
    await sql`INSERT INTO users (email, password) VALUES (${cred.email}, ${cred.password});`;
    return await findUser(cred);
};

export const authMiddleware: Handler = async (req, res, next) => {
    const token = await getToken(req.headers);
    if (token == null) {
        res.sendStatus(401);
        return;
    }
    const user = await verifyToken(token);
    if (user == null) {
        res.sendStatus(403);
        return;
    }
    req.context = { user };
    next();
};

export const verifyToken = async (token: string) => {
    const payload = jwt.verify(token, env.AUTH_SECRET);
    const result = authTokenSchema.strict().safeParse(payload);
    if (!result.success) return null;
    return await findUser(result.data);
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
    return ok(exclude(foundUser, ["password"]));
};

export const signup = async (cred: UserCredentials) => {
    return await createUser(cred);
};
