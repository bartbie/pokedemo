// taken from here https://stackoverflow.com/a/67560007
import type { NextFunction, Request, Response } from "express";
import { Context } from 'vm';

declare global {
    namespace Express {}
}

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
 * Base generic type for declaring your own middlewares
 */
export type BaseMiddleware<
    RequestType extends TypedRequest<ReqBody, QueryString>,
    ReqBody = Record<string, unknown>,
    Res = Record<string, unknown>,
    QueryString = Record<string, unknown>
> = (
    req: RequestType,
    res: Response<Res>,
    next: NextFunction
) => Promise<void> | void;

/**
 * Generic type for defining middleware functions
 */
export type TypedMiddleware<
    req = Record<string, unknown>,
    res = Record<string, unknown>,
    query = Record<string, unknown>
> = BaseMiddleware<TypedRequest<req, query>, req, res, query>;
