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
} as const satisfies Record<string, string>;

export const HealthCheckMsg = "Server is running!";

//INFO: they should have better brands than just string, but it was breaking on backend
export type Endpoint<B extends Record<string, any>, R extends Result> = {
    readonly request: B;
    readonly response: R;
    __type: "Endpoint";
}

export type ResOnlyEndpoint<R extends Result> = {
    readonly response: R;
    __type: "ResOnlyEndpoint";
}

// --- helper types

type EndpointType<B extends Record<string, any>, R extends Result> = {
    readonly request: B;
    readonly response: R;
}

type ResponseOnlyEndpointType<R extends Result> = {
    readonly response: R;
}

type _Endpoint<schema extends EndpointType<any, any>> = Endpoint<schema["request"], schema["response"]>

type _ResOnlyEndpoint<schema extends ResponseOnlyEndpointType<any>> = ResOnlyEndpoint<schema["response"]>

type _GETEndpoint<schema extends ResponseOnlyEndpointType<any>> = _ResOnlyEndpoint<schema>;


type Err = typeof Errors;
// --- API contr act type


export type API = {
    "/healthcheck": {
        GET: _GETEndpoint<{
            response: Result<typeof HealthCheckMsg, never>
        }>
    }
    "/pokemons": {
        GET: _GETEndpoint<{
            response: Result<Required<t.Pokemon>[], never>;
        }>;
        POST: _Endpoint<{
            request: t.Pokemon;
            response: Result<void, Err["wrongBody" | "adminNeeded"]>;
        }>;
        "/:id": {
            GET: _GETEndpoint<{
                response: Result<Required<t.Pokemon>, Err["wrongId"]>;
            }>;
            PATCH: _Endpoint<{
                request: t.Pokemon;
                response: Required<
                    Result<void, Err["wrongId" | "wrongBody" | "adminNeeded"]>
                >;
            }>;
            DELETE: _ResOnlyEndpoint<{
                response: Result<void, Err["wrongId" | "adminNeeded"]>;
            }>;
        };
        "/custom": {
            GET: _GETEndpoint<{
                response: Result<Required<t.Pokemon>[], never>;
            }>;
            POST: _Endpoint<{
                request: t.Pokemon;
                response: Result<void, Err["wrongBody" | "adminNeeded"]>;
            }>;
            "/:id": {
                GET: _GETEndpoint<{
                    response: Result<Required<t.Pokemon>, Err["wrongId"]>;
                }>;
                PATCH: _Endpoint<{
                    request: t.Pokemon;
                    response: Required<
                        Result<
                            void,
                            Err["wrongId" | "wrongBody" | "adminNeeded"]
                        >
                    >;
                }>;
                DELETE: _ResOnlyEndpoint<{
                    response: Result<void, Err["wrongId" | "adminNeeded"]>;
                }>;
            };
        };
    };
    "/auth": {
        "/signup": {
            POST: _Endpoint<{
                request: t.UserCredentials;
                response: Result<t.User, Err["wrongBody" | "emailTaken"]>;
            }>;
        };
        "/login": {
            POST: _Endpoint<{
                request: t.UserCredentials;
                response: Result<
                    t.User,
                    Err["wrongBody" | "emailNotExist" | "wrongPassword"]
                >;
            }>;
        };
        "/verify": {
            POST: _Endpoint<{
                request: t.TokenRequest;
                response: Result<t.User, Err["wrongToken"]>;
            }>;
        };
        "/logout": {
            POST: _Endpoint<{
                request: t.TokenRequest;
                response: Result<void, Err["wrongToken"]>;
            }>;
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
    "/me": {
        "/pokemons": {
            GET: _GETEndpoint<{
                response: Result<Required<t.Pokemon>[], never>;
            }>;
            /** adds new *existing* pokemons to user's collection */
            PUT: _Endpoint<{
                request: { pokemons: { id: t.PokemonId[]; favorite: boolean } };
                response: Result<
                    void,
                    | { message: Err["wrongBody"] }
                    | { message: Err["wrongId"]; data: t.PokemonId[] }
                >;
            }>;
            /** deletes pokemon from user's collection */
            DELETE: _Endpoint<{
                request: { id: t.PokemonId[] };
                response: Result<
                    void,
                    | { message: Err["wrongBody"] }
                    | { message: Err["wrongId"]; data: t.PokemonId[] }
                >;
            }>;
            "/favorites": {
                GET: _GETEndpoint<{
                    response: Result<Required<t.Pokemon>[], never>;
                }>;
                /** deletes pokemons from user's favorites */
                DELETE: _Endpoint<{
                    request: { id: t.PokemonId[] };
                    response: Result<
                        void,
                        | { message: Err["wrongBody"] }
                        | { message: Err["wrongId"]; data: t.PokemonId[] }
                    >;
                }>;
                /** adds each pokemon to favorites */
                PUT: _Endpoint<{
                    request: { id: t.PokemonId[] };
                    response: Result<
                        void,
                        | { message: Err["wrongBody"] }
                        | { message: Err["wrongId"]; data: t.PokemonId[] }
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
};
