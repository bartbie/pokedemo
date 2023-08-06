import { z } from "zod";

export const rolesArr = ["USER", "ADMIN"] as const;
export const pokemonTypesArr = [
    "NORMAL",
    "FIGHTING",
    "FLYING",
    "POISON",
    "GROUND",
    "ROCK",
    "BUG",
    "GHOST",
    "STEEL",
    "FIRE",
    "WATER",
    "GRASS",
    "ELECTRIC",
    "PSYCHIC",
    "ICE",
    "DRAGON",
    "DARK",
    "FAIRY",
    "UNKNOWN",
    "SHADOW",
] as const;

export const pokemonTypeSchema = z.enum(pokemonTypesArr);
export type PokemonType = z.infer<typeof pokemonTypeSchema>;

export const roleSchema = z.enum(rolesArr);
export type Role = z.infer<typeof roleSchema>;

export const pokemonIdSchema = z.number().positive()/*.brand<"PokemonId">()*/;
export type PokemonId = z.infer<typeof pokemonIdSchema>;

// no need for now
// export const pokeApiIdSchema = z.number().positive().brand<"PokeApiId">();
// export type PokeApiId = z.infer<typeof pokeApiIdSchema>;

export const pokemonSchema = z
    .object({
        id: pokemonIdSchema.optional(),
        weight: z.number(),
        height: z.number(),
        type: z.tuple([pokemonTypeSchema, pokemonTypeSchema]),
    })
    .and(
        z
            .object({
                pokeId: z.number().positive(),
                sprite: z.string().url(),
                custom: z.literal(false),
            })
            .or(
                z.object({
                    pokeId: z.null(),
                    sprite: z.null(),
                    custom: z.literal(true),
                })
            )
    );

export type Pokemon = z.infer<typeof pokemonSchema>;

export const userIdSchema = z.string().cuid2()/*.brand<"UserId">()*/;
export type UserId = z.infer<typeof userIdSchema>;

export const emailSchema = z.string().email()/*.brand<"Email">()*/;
export type Email = z.infer<typeof emailSchema>;

export const userCredentialsSchema = z.object({
    email: emailSchema,
    password: z.string(),
});
export type UserCredentials = z.infer<typeof userCredentialsSchema>;

// branded so these two + credentials won't get mixed up by mistake
export const userSchema = z
    .object({
        id: userIdSchema,
        role: roleSchema,
        email: emailSchema,
    })
// .brand<"User">();
export type User = z.infer<typeof userSchema>;

export const fullUserSchema = z
    .object({
        id: userIdSchema,
        role: roleSchema,
    })
    .and(userCredentialsSchema)
// .brand<"FullUser">();
export type FullUser = z.infer<typeof fullUserSchema>;

export const authTokenSchema = z.object({
    role: roleSchema,
    email: emailSchema,
});
export type AuthToken = z.infer<typeof authTokenSchema>;
