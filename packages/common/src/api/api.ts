import { ok, type Result } from "../utils";
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

// --- helper types

type Err = typeof Errors;

type ResponseOnlySchema<R extends Result> = {
    readonly response: R;
};

type EndpointSchema<B extends Record<string, any>, R extends Result> = {
    readonly request: B;
} & ResponseOnlySchema<R>;

type Endpoint<schema extends EndpointSchema<any, any>> = schema;
type OnlyResEndpoint<schema extends ResponseOnlySchema<any>> = schema;
type GETEndpoint<schema extends ResponseOnlySchema<any>> = schema;

type TokenBody = {
    token: string;
};

// --- API contr act type

export type API = {
    "/pokemons": {
        GET: GETEndpoint<{
            response: Result<Required<t.Pokemon>[], never>;
        }>;
        POST: Endpoint<{
            request: t.Pokemon;
            response: Result<void, Err["wrongBody" | "adminNeeded"]>;
        }>;
        "/:id": {
            GET: GETEndpoint<{
                response: Result<Required<t.Pokemon>, Err["wrongId"]>;
            }>;
            PATCH: Endpoint<{
                request: t.Pokemon;
                response: Required<
                    Result<void, Err["wrongId" | "wrongBody" | "adminNeeded"]>
                >;
            }>;
            DELETE: OnlyResEndpoint<{
                response: Result<void, Err["wrongId" | "adminNeeded"]>;
            }>;
        };
        "/custom": {
            GET: GETEndpoint<{
                response: Result<Required<t.Pokemon>[], never>;
            }>;
            POST: Endpoint<{
                request: t.Pokemon;
                response: Result<void, Err["wrongBody" | "adminNeeded"]>;
            }>;
            "/:id": {
                GET: GETEndpoint<{
                    response: Result<Required<t.Pokemon>, Err["wrongId"]>;
                }>;
                PATCH: Endpoint<{
                    request: t.Pokemon;
                    response: Required<
                        Result<
                            void,
                            Err["wrongId" | "wrongBody" | "adminNeeded"]
                        >
                    >;
                }>;
                DELETE: OnlyResEndpoint<{
                    response: Result<void, Err["wrongId" | "adminNeeded"]>;
                }>;
            };
        };
    };
    "/auth": {
        "/signup": {
            POST: Endpoint<{
                request: t.UserCredentials;
                response: Result<t.User, Err["wrongBody" | "emailTaken"]>;
            }>;
        };
        "/login": {
            POST: Endpoint<{
                request: t.UserCredentials;
                response: Result<
                    t.User,
                    Err["wrongBody" | "emailNotExist" | "wrongPassword"]
                >;
            }>;
        };
        "/verify": {
            POST: Endpoint<{
                request: TokenBody;
                response: Result<t.User, Err["wrongToken"]>;
            }>;
        };
        "/logout": {
            POST: Endpoint<{
                request: TokenBody;
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
            GET: GETEndpoint<{
                response: Result<Required<t.Pokemon>[], never>;
            }>;
            /** adds new *existing* pokemons to user's collection */
            PUT: Endpoint<{
                request: { pokemons: { id: t.PokemonId[]; favorite: boolean } };
                response: Result<
                    void,
                    | { message: Err["wrongBody"] }
                    | { message: Err["wrongId"]; data: t.PokemonId[] }
                >;
            }>;
            /** deletes pokemon from user's collection */
            DELETE: Endpoint<{
                request: { id: t.PokemonId[] };
                response: Result<
                    void,
                    | { message: Err["wrongBody"] }
                    | { message: Err["wrongId"]; data: t.PokemonId[] }
                >;
            }>;
            "/favorites": {
                GET: GETEndpoint<{
                    response: Result<Required<t.Pokemon>[], never>;
                }>;
                /** deletes pokemons from user's favorites */
                DELETE: Endpoint<{
                    request: { id: t.PokemonId[] };
                    response: Result<
                        void,
                        | { message: Err["wrongBody"] }
                        | { message: Err["wrongId"]; data: t.PokemonId[] }
                    >;
                }>;
                /** adds each pokemon to favorites */
                PUT: Endpoint<{
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
                    POST: OnlyResEndpoint<{
                        response: Result<void, Err["wrongId"]>;
                    }>;
                    /** delete from favorites */
                    DELETE: OnlyResEndpoint<{
                        response: Result<void, Err["wrongId"]>;
                    }>;
                };
            };
        };
    };
};
