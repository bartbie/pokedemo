import { isLoggedIn } from "$lib/server/auth";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const user = (event.locals.user = await isLoggedIn(event));
    const { pathname } = event.url;

    if (pathname.startsWith("/home")) {
        if (!user) {
            throw redirect(303, "/");
        }
    }
    if (pathname.startsWith("/admin")) {
        if (!user) {
            throw redirect(303, "/");
        }
        if (user.role !== "ADMIN") {
            throw redirect(303, "/home");
        }
    }
    return await resolve(event);
};
