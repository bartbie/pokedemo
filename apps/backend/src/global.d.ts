import type { User } from "@pokedemo/api";

export {};
declare global {
    namespace Express {
        interface Request {
            context?: Context;
        }
    }
    type Context = {
        user: User;
    };
}
