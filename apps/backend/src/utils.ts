import { Request, Response } from "express";
import { err } from "@pokedemo/utils";
import { Errors, EndpointSchema, ResponseOnlySchema } from "@pokedemo/api";
import { z } from "zod";

export const makeEndpoint = <
    T extends EndpointSchema<any, any> | ResponseOnlySchema<any>
>(
    bodySchema: T extends EndpointSchema<any, any>
        ? z.Schema<T["request"]>
        : null,
    fn: (
        req: Request<
            any,
            any,
            T extends EndpointSchema<any, any> ? T["request"] : never
        >,
        res: Response<T["response"]>
    ) => void
) => {
    return (req: Request, res: Response) => {
        const result = bodySchema.safeParse(req.body);
        if (!result.success) {
            return res.send(400).send(err(Errors.wrongBody));
        }
        return fn(req, res);
    };
};

export const makeGetEndpoint = <T extends ResponseOnlySchema<any>>(
    fn: (req: Request<any, any, never>, res: Response<T["response"]>) => void
) => fn;
