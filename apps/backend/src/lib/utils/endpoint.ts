import { Request, Response } from "express";
import { Result, err } from "@pokedemo/utils";
import { Errors, Endpoint, ResOnlyEndpoint } from "@pokedemo/api";

import { z } from "zod";

interface MakeEndpoint {
    <T extends Endpoint<any, any>>(
        bodySchema: z.Schema<T["request"]>,
        fn: (
            req: Request<any, any, T["request"]>,
            res: Response<T["response"]>
        ) => void
    ): typeof fn;
    <T extends ResOnlyEndpoint<any>>(
        bodySchema: null,
        fn: (
            req: Request<any, any, never>,
            res: Response<T["response"]>
        ) => void
    ): typeof fn;
}

export const makeEndpoint: MakeEndpoint = (bodySchema: any, fn: any) => {
    return (req: Request, res: Response) => {
        if (bodySchema != null) {
            const result = bodySchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json(err(Errors.wrongBody));
            }
        }
        return fn(req, res);
    };
};

export const makeGetEndpoint = <T extends ResOnlyEndpoint<any>>(
    fn: (req: Request<any, any, never>, res: Response<T["response"]>) => void
) => fn;
