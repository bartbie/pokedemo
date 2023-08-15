import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (({ cookies }) => {
    throw redirect(303, "/");
}) satisfies PageServerLoad;
