/** this route acts as a proxy to the backend /api/ */
import type { RequestHandler } from "./$types";
import { BACKEND_URL } from "$env/static/private";
import { getToken } from "$lib/server/auth";

const api_fetch: RequestHandler = async ({ fetch, params, request, cookies }) => {
    const apiUrl = `${BACKEND_URL}/api/${params.route}`;
    const { body, method } = request;
    const token = getToken(cookies);
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {})
    };
    return await fetch(apiUrl, { method, headers, body });
};

export const GET: RequestHandler = api_fetch;
export const PUT: RequestHandler = api_fetch;
export const PATCH: RequestHandler = api_fetch;
export const POST: RequestHandler = api_fetch;
export const DELETE: RequestHandler = api_fetch;
