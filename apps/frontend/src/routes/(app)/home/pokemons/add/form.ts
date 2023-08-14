import { pokemonIdSchema, userPokemonIdSchema } from "@pokedemo/api";
import { z } from "zod";

export const pokemonAddSchema = z.object({ pokemons: userPokemonIdSchema.array() });
