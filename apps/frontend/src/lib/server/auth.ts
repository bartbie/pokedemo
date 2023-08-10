import type { Branded } from "@pokedemo/utils";
import type { Cookies, RequestEvent } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { apiClient } from "$lib/api";

type Token = Branded<string, "Token">;

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
