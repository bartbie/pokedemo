import { ok, type Branded, err } from "@pokedemo/utils";
import { redirect, type Cookies, type RequestEvent } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { apiClient } from "$lib/api";
import type { Errors, Role, UserCredentials } from "@pokedemo/api";

export type Token = Branded<string, "Token">;

// needs to be exported for /api/ proxy
export const getToken = (cookies: Cookies) => cookies.get("auth") as Token | undefined;

const setCookies = (cookies: Cookies, token: Token) => {
    cookies.set("auth", token, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: !dev,
        maxAge: 1800 // 30 mins
    });
};

export const verifyToken = async (fetchFn: typeof fetch, token: Token) => {
    const api = apiClient(fetchFn);
    return await api<API["/auth"]["/verify"]["POST"]>("/api/auth/verify", {
        method: "POST",
        body: { token }
    });
};

export const isLoggedIn = async ({ fetch, cookies }: RequestEvent) => {
    const userToken = getToken(cookies);
    if (!userToken) return null;
    const res = await verifyToken(fetch, userToken);
    if (!res.success) return null;
    return res.data;
};

export const login = async (fetchFn: typeof fetch, cookies: Cookies, cred: UserCredentials) => {
    const api = apiClient(fetchFn);
    const result = await api<API["/auth"]["/login"]["POST"]>("/api/auth/login", {
        method: "POST",
        body: cred
    });
    if (!result.success) {
        return err(result.error as Exclude<typeof result.error, (typeof Errors)["wrongBody"]>);
    }
    const { token, user } = result.data;
    setCookies(cookies, token as Token);
    return ok(user);
};

export const logout = (cookies: Cookies) => {
    cookies.delete("auth", { path: "/" });
};

export const redirectLogged = (role: Role) => {
    switch (role) {
        case "USER":
            throw redirect(303, "/home");
        case "ADMIN":
            throw redirect(303, "/admin");
    }
};
