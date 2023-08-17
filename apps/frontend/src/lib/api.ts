import type { Endpoint, ResOnlyEndpoint } from "@pokedemo/api";
import type { IfAny } from "@pokedemo/utils";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { Token } from "./server/auth";

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
type ApiRequestInit<T extends Record<string, any> | undefined = undefined> = T extends undefined
    ? {
          method: Method;
          auth?: Token | null;
      }
    : {
          method: Method;
          body: T;
          auth?: Token | null;
      };

type IfAnyUnknown<T> = IfAny<T, unknown, T>;

type ApiFetch = {
    <T extends Endpoint<any, any>>(route: string, config: ApiRequestInit<T["request"]>): Promise<
        IfAnyUnknown<T["response"]>
    >;
    <T extends ResOnlyEndpoint<any>>(route: string, config?: ApiRequestInit): Promise<
        IfAnyUnknown<T["response"]>
    >;
};

/**
 * returns wrapper around fn that allows to use
 * `Endpoint` and `ResOnlyEndpoint` types from `@pokedemo/api`
 * */
export const apiClient = (fn: typeof fetch): ApiFetch => {
    return async (route: string, config?: ApiRequestInit<any>) => {
        const conf = {
            method: config ? config.method : "GET",
            body: config && "body" in config ? JSON.stringify(config.body) : undefined,
            headers: {
                "Content-Type": "application/json",
                Authorization: config && config.auth ? `Bearer ${config.auth}` : ""
            }
        } as const satisfies RequestInit;
        const x = (await fn(`${PUBLIC_BACKEND_URL}${route}`, conf)).json();
        // console.log(x);

        return await x;
    };
};
