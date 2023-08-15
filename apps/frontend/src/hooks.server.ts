import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { isLoggedIn, redirectLogged } from "$lib/server/auth";
import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const { cookies, fetch } = event;
    const { pathname } = event.url;
    console.log(pathname);

    if (pathname.startsWith("/api")) {
        return await fetch(`${PUBLIC_BACKEND_URL}${pathname}`);
    }

    const user = await isLoggedIn(event);
    event.locals.user = user;

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

    if (pathname.startsWith("/auth") && !pathname.startsWith("/auth/logout") && user) {
        redirectLogged(user.role);
    }

    console.log(pathname);
    if (pathname === "/" && user) {
        redirectLogged(user.role);
    }

    const response = await resolve(event);
    // response.headers.set("cache-control", "no-cache");
    return response;
};
