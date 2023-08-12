import { type Result } from "@pokedemo/utils";
import type * as t from "./types";

// --- Error strings

export const Errors = {
    wrongId: "ID doesn't exist!",
    wrongBody: "Wrong body!",
    emailTaken: "Email already taken!",
    emailNotExist: "Email doesn't exist!",
    wrongPassword: "Wrong password!",
    wrongToken: "Token is incorrect!",
    adminNeeded: "You're not allowed to do that!",
    sessionExpired: "Session expired! Log again!",
} as const satisfies Record<string, string>;

export const HealthCheckMsg = "Server is running!";

//INFO: they should have better brands than just string, but it was breaking on backend
export type Endpoint<B extends Record<string, any>, R extends Result> = {
    readonly request: B;
    readonly response: R;
    __type: "Endpoint";
};

export type ResOnlyEndpoint<R extends Result> = {
    readonly response: R;
    __type: "ResOnlyEndpoint";
};

// --- helper types

type EndpointType<B extends Record<string, any>, R extends Result> = {
    readonly request: B;
    readonly response: R;
};

type ResponseOnlyEndpointType<R extends Result> = {
    readonly response: R;
};

type _Endpoint<schema extends EndpointType<any, any>> = Endpoint<
    schema["request"],
    schema["response"]
>;

type _ResOnlyEndpoint<schema extends ResponseOnlyEndpointType<any>> =
    ResOnlyEndpoint<schema["response"]>;

type _GETEndpoint<schema extends ResponseOnlyEndpointType<any>> =
    _ResOnlyEndpoint<schema>;

type Err = typeof Errors;
// --- API contr act type

export type API = {
    "/healthcheck": {
        GET: _GETEndpoint<{
            response: Result<typeof HealthCheckMsg, never>;
        }>;
    };
    "/pokemons": {
        GET: _GETEndpoint<{
            response: Result<t.ExistingPokemon[], never>;
        }>;
        POST: _Endpoint<{
            request: t.Pokemon;
            response: Result<
                t.ExistingPokemon,
                Err["wrongBody" | "adminNeeded"]
            >;
        }>;
        "/:id": {
            GET: _GETEndpoint<{
                response: Result<t.ExistingPokemon, Err["wrongId"]>;
            }>;
            PATCH: _Endpoint<{
                request: t.PatchPokemon;
                response: Result<
                    t.ExistingPokemon,
                    Err["wrongId" | "wrongBody" | "adminNeeded"]
                >;
            }>;
            DELETE: _ResOnlyEndpoint<{
                response: Result<void, Err["wrongId" | "adminNeeded"]>;
            }>;
        };
        "/custom": {
            GET: _GETEndpoint<{
                response: Result<Required<t.CustomPokemon>[], never>;
            }>;
            // POST: _Endpoint<{
            //     request: t.Pokemon;
            //     response: Result<void, Err["wrongBody" | "adminNeeded"]>;
            // }>;
            // "/:id": {
            //     GET: _GETEndpoint<{
            //         response: Result<Required<t.Pokemon>, Err["wrongId"]>;
            //     }>;
            //     PATCH: _Endpoint<{
            //         request: t.Pokemon;
            //         response: Required<
            //             Result<
            //                 void,
            //                 Err["wrongId" | "wrongBody" | "adminNeeded"]
            //             >
            //         >;
            //     }>;
            //     DELETE: _ResOnlyEndpoint<{
            //         response: Result<void, Err["wrongId" | "adminNeeded"]>;
            //     }>;
            // };
        };
    };
    "/users": {
        GET: _GETEndpoint<{
            response: Result<t.User[], Err["adminNeeded"]>;
        }>;
        // POST: _Endpoint<{
        //     request: t.User,
        //     response: Result<Required<t.User>, Err["wrongBody" | "wrongId" | "adminNeeded"]>
        // }>,
        "/:id": {
            GET: _GETEndpoint<{
                response: Result<t.User, Err["wrongId" | "adminNeeded"]>;
            }>;
            PATCH: _Endpoint<{
                request: t.PatchUser;
                response: Result<
                    t.User,
                    Err["wrongBody" | "wrongId" | "adminNeeded"]
                >;
            }>;
            DELETE: _ResOnlyEndpoint<{
                response: Result<
                    void,
                    Err["wrongBody" | "wrongId" | "adminNeeded"]
                >;
            }>;
        };
    };
    "/auth": {
        "/signup": {
            POST: _Endpoint<{
                request: t.UserCredentials;
                response: Result<
                    t.TokenResponse,
                    Err["wrongBody" | "emailTaken"]
                >;
            }>;
        };
        "/login": {
            POST: _Endpoint<{
                request: t.UserCredentials;
                response: Result<
                    t.TokenResponse,
                    Err["wrongBody" | "emailNotExist" | "wrongPassword"]
                >;
            }>;
        };
        "/verify": {
            POST: _Endpoint<{
                request: t.TokenRequest;
                response: Result<t.User, Err["wrongToken" | "sessionExpired"]>;
            }>;
        };
        "/logout": {
            POST: _Endpoint<{
                request: t.TokenRequest;
                response: Result<void, Err["wrongToken"]>;
            }>;
        };
    };
    "/me": {
        "/pokemons": {
            GET: _GETEndpoint<{
                response: Result<t.UserPokemon[], never>;
            }>;
            /** adds new *existing* pokemons to user's collection */
            PUT: _Endpoint<{
                request: {
                    pokemons: t.UserPokemonId[];
                };
                response: Result<
                    void,
                    { message: Err["wrongBody"] } | { message: Err["wrongId"] }
                >;
            }>;
            /** deletes pokemon from user's collection */
            DELETE: _Endpoint<{
                request: { id: t.PokemonId[] };
                response: Result<
                    void,
                    { message: Err["wrongBody"] } | { message: Err["wrongId"] }
                >;
            }>;
            "/favorites": {
                GET: _GETEndpoint<{
                    response: Result<t.ExistingPokemon[], never>;
                }>;
                /** adds each pokemon to favorites */
                PUT: _Endpoint<{
                    request: { id: t.PokemonId[] };
                    response: Result<
                        void,
                        | { message: Err["wrongBody"] }
                        | { message: Err["wrongId"] }
                    >;
                }>;
                /** deletes pokemons from user's favorites */
                DELETE: _Endpoint<{
                    request: { id: t.PokemonId[] };
                    response: Result<
                        void,
                        | { message: Err["wrongBody"] }
                        | { message: Err["wrongId"] }
                    >;
                }>;
                /** manipulate 'favoriteness' of specific pokemon */
                "/:id": {
                    /** add to favorites */
                    POST: _ResOnlyEndpoint<{
                        response: Result<void, Err["wrongId"]>;
                    }>;
                    /** delete from favorites */
                    DELETE: _ResOnlyEndpoint<{
                        response: Result<void, Err["wrongId"]>;
                    }>;
                };
            };
        };
    };
    // TODO figure out contact API
    // "/contact": {
    //     "/messages": {
    //         GET: any;
    //         POST: any;
    //         "/:id": {
    //             GET: any;
    //         };
    //         "/user": {
    //             "/:id": {
    //                 GET: any;
    //             };
    //         };
    //     };
    //     "/responses": {
    //         GET: any;
    //         POST: any;
    //         "/:id": {
    //             GET: any;
    //         };
    //         "/user": {
    //             "/:id": {
    //                 GET: any;
    //             };
    //         };
    //     };
    // };
};
