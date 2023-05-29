/*
Parse the environment variables in a nice type-safe way
*/
import dotenv from 'dotenv';
import {z} from 'zod';
dotenv.config();

const ENV_SCHEMA = z.object({
    PORT: z.coerce.number(),
});

const parsed = ENV_SCHEMA.safeParse(process.env)

if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

export const ENV = parsed.data;