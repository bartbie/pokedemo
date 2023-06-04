import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
const Methods = [
    "all",
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "options",
    "head",
] as const;
export type Method = (typeof Methods)[number];

export type PathParam = string | RegExp | (string | RegExp)[];

// inspired by https://stackoverflow.com/a/67560007
/**
 * Generic type for defining incoming request
 */
export type TypedRequest<
    ReqBody = Record<string, unknown>,
    QueryString = Record<string, unknown>
> = Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Partial<ReqBody>,
    Partial<QueryString>
>;

/**
 * Base generic type for declaring your own handler types
 */
export type TypedHandler<
    ReqBody = Record<string, unknown>,
    Res = Record<string, unknown>,
    QueryString = Record<string, unknown>,
    RequestType extends TypedRequest<ReqBody, QueryString> = TypedRequest<
        ReqBody,
        QueryString
    >
> = (
    req: RequestType,
    res: Response<Res>,
    next: NextFunction
) => Promise<void> | void;

/**
 * function type that allows to pass custom Handler, Requests, or Request's bodies and Responses as type parameters
 */
export interface PathHandlerTaker<Return> {
    <
        RH extends TypedHandler<Req, Res, Query, RT>,
        RT extends TypedRequest<Req, Query> = any, // hacky but seems to work lol (never also seems to work)
        Req = Record<string, unknown>,
        Res = Record<string, unknown>,
        Query = Record<string, unknown>
    >(
        path: PathParam,
        handler: RH
    ): Return;
    <
        RT extends TypedRequest<Req, Query>,
        Req = Record<string, unknown>,
        Res = Record<string, unknown>,
        Query = Record<string, unknown>
    >(
        path: PathParam,
        handler: TypedHandler<Req, Res, Query, RT>
    ): Return;
    <Req = Record<string, unknown>, Res = Record<string, unknown>>(
        path: PathParam,
        handler: TypedHandler<Req, Res>
    ): Return;
    (path: PathParam, handler: TypedHandler): Return;
}

export interface UseHandlerTaker<Return> {
    // there is certainly a way to not repeat ourselves
    // but i'm too dumb to find it
    <
        RH extends TypedHandler<Req, Res, Query, RT>,
        RT extends TypedRequest<Req, Query> = any, // hacky but seems to work lol (never also seems to work)
        Req = Record<string, unknown>,
        Res = Record<string, unknown>,
        Query = Record<string, unknown>
    >(
        handler: RH
    ): Return;
    <
        RT extends TypedRequest<Req, Query>,
        Req = Record<string, unknown>,
        Res = Record<string, unknown>,
        Query = Record<string, unknown>
    >(
        handler: TypedHandler<Req, Res, Query, RT>
    ): Return;
    <Req = Record<string, unknown>, Res = Record<string, unknown>>(
        handler: TypedHandler<Req, Res>
    ): Return;
    (handler: TypedHandler): Return;
}

type RestMethods = {
    [K in Method]: PathHandlerTaker<App>;
};

interface App extends RestMethods {
    _app: Express;
    listen: (port: number, callback?: () => void) => App;
    use: UseHandlerTaker<App>;
}

export const App = (): App => {
    const _app = express();
    const appWithoutRest: Omit<App, Method> = {
        _app: _app,
        listen(port: number, callback?: () => void) {
            this._app.listen(port, callback);
            return this as App;
        },
        use(handler: any) {
            // ugly, but we use the interface for typechecking
            this._app.use(handler);
            return this as App;
        },
    };

    const FnFactory = (method: Method) => {
        const fn: PathHandlerTaker<App> = function (
            path: PathParam,
            handler: Parameters<PathHandlerTaker<App>>[1]
        ) {
            _app[method](path, handler);
            return appWithoutRest as App;
        };
        return fn;
    };

    const app: Partial<RestMethods> & Omit<App, Method> = appWithoutRest;
    Methods.forEach((e) => (app[e] = FnFactory(e)));
    return app as App;
};

// type testing
import { authMiddleware, ProtectedHandler, ProtectedRequest } from "./lib/auth";
const app = App();
app.get(".", authMiddleware);
app.get<ProtectedRequest>(".", (req, res, next) => {
    req.context.user = "bart";
});
app.get<{ id: 1 }, { answer: "it works!" }>(".", (req, res, next) => {
    req.body.id;
    res.json({ answer: "it works!" });
});
app.get<ProtectedHandler>(".", (req, res, next) => {
    req.context.user;
});
app.use(authMiddleware);
