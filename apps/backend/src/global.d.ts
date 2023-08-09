import type { Pokemon, User } from "@pokedemo/api";

export {};
declare global {
    namespace Express {
        interface Request {
            context?: Context;
        }
    }
    type Context = {
        auth?: {
            user: User;
        };
        id?: {
            pokemon?: Required<Pokemon>;
            user?: Required<User>;
        };
    };
}
