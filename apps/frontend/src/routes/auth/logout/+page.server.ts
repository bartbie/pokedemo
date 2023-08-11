import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { logout } from "$lib/server/auth";

export const load = (({ cookies }) => {
    logout(cookies);
    throw redirect(303, "/");
}) satisfies PageServerLoad;
