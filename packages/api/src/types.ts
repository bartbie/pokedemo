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

export const pokemonIdSchema = z.coerce
    .number()
    .positive(); /*.brand<"PokemonId">()*/
export type PokemonId = z.infer<typeof pokemonIdSchema>;

// no need for now
// export const pokeApiIdSchema = z.number().positive().brand<"PokeApiId">();
// export type PokeApiId = z.infer<typeof pokeApiIdSchema>;

const pokemonBaseSchema = z.object({
    name: z.string().nonempty(),
    id: pokemonIdSchema.optional(),
    weight: z.number(),
    height: z.number(),
    types: z.tuple([pokemonTypeSchema, pokemonTypeSchema]),
});

const realPokemonBaseSchema = z.object({
    pokeId: z.number().positive(),
    sprite: z.string().url(),
    custom: z.literal(false),
});

export const realPokemonSchema = pokemonBaseSchema.and(realPokemonBaseSchema);

const customPokemonBaseSchema = z.object({
    pokeId: z.null(),
    sprite: z.null(),
    custom: z.literal(true),
});

export const customPokemonSchema = pokemonBaseSchema.and(
    customPokemonBaseSchema
);

export const pokemonSchema = realPokemonSchema.or(customPokemonSchema);

export const patchPokemonSchema = pokemonBaseSchema
    .partial()
    .and(realPokemonBaseSchema.partial().or(customPokemonBaseSchema.partial()));

export const existingPokemonSchema = pokemonBaseSchema
    .required()
    .and(realPokemonBaseSchema.or(customPokemonBaseSchema));

export type Pokemon = z.infer<typeof pokemonSchema>;
export type CustomPokemon = z.infer<typeof customPokemonSchema>;
export type RealPokemon = z.infer<typeof realPokemonSchema>;
export type PatchPokemon = z.infer<typeof patchPokemonSchema>;
export type ExistingPokemon = z.infer<typeof existingPokemonSchema>;

// export const userIdSchema = z.string().cuid2()/*.brand<"UserId">()*/;
export const userIdSchema = z.coerce.number().positive(); /*.brand<"UserId">()*/
export type UserId = z.infer<typeof userIdSchema>;

export const emailSchema = z.string().email(); /*.brand<"Email">()*/
export type Email = z.infer<typeof emailSchema>;

export const userCredentialsSchema = z.object({
    email: emailSchema,
    password: z.string(),
});

// branded so these two + credentials won't get mixed up by mistake
export const userSchema = z.object({
    id: userIdSchema,
    role: roleSchema,
    email: emailSchema,
});
// .brand<"User">();

export const fullUserSchema = z
    .object({
        id: userIdSchema,
        role: roleSchema,
    })
    .and(userCredentialsSchema);
// .brand<"FullUser">();

export const patchUserSchema = userSchema.partial();

export type UserCredentials = z.infer<typeof userCredentialsSchema>;
export type User = z.infer<typeof userSchema>;
export type FullUser = z.infer<typeof fullUserSchema>;
export type PatchUser = z.infer<typeof patchUserSchema>;

export const userPokemonSchema = z.object({
    favorite: z.boolean(),
    pokemon: existingPokemonSchema,
});

export const userPokemonIdSchema = z.object({
    favorite: z.boolean(),
    id: pokemonIdSchema,
});

export type UserPokemon = z.infer<typeof userPokemonSchema>;
export type UserPokemonId = z.infer<typeof userPokemonIdSchema>;

export const authTokenSchema = z.object({
    role: roleSchema,
    email: emailSchema,
});
export type AuthToken = z.infer<typeof authTokenSchema>;

export const tokenRequestSchema = z.object({
    token: z.string(),
});

export type TokenRequest = z.infer<typeof tokenRequestSchema>;

export const tokenResponseSchema = z.object({
    user: userSchema,
    token: z.string(),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
