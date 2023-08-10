import type { Endpoint, ResOnlyEndpoint } from "@pokedemo/api";
import type { IfAny } from "@pokedemo/utils";

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
type ApiRequestInit<T extends Record<string, any> | undefined = undefined> = T extends undefined
    ? {
          method: Method;
      }
    : {
          method: Method;
          body: T;
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
    return async (route: string, config?: ApiRequestInit) => {
        return await (await fn(route, config)).json();
    };
};
