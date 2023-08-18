import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { apiClient } from "$lib/api";
import { getToken } from "$lib/server/auth";

export const load: PageServerLoad = async ({ locals, fetch, cookies }) => {
    if (!locals.user) {
        throw redirect(303, "/");
    }
    const api = apiClient(fetch);
    const res = await api<API["/users"]["GET"]>("/api/users", {
        method: "GET",
        auth: getToken(cookies)
    });
    if (!res.success) {
        throw redirect(303, "/");
    }
    return { users: res.data };
};
