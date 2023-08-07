/*
Parse the environment variables in a nice type-safe way
*/
import dotenv from "dotenv";
import { z } from "zod";
import { dirname } from "path";
dotenv.config();

const ENV_SCHEMA = z.object({
    PORT: z.coerce.number(),
    AUTH_SECRET: z.string().min(64),
    DATABASE_URL: z.string().nonempty(),
    NODE_ENV: z
        .enum(["development", "production"])
        .optional()
        .default("production"),
});
//
// .and(
//     z.object({
//     })
//     .or(
//         z.object({
//             MYSQL_HOST: z.string().nonempty(),
//             MYSQL_USER: z.string().nonempty(),
//             MYSQL_DATABASE: z.string().nonempty(),
//             MYSQL_PASSWORD: z.string().nonempty(),
//         })
//     )
// );

const parsed = ENV_SCHEMA.safeParse(process.env);

if (parsed.success === false) {
    console.error(
        "❌[build] Invalid environment variables:",
        parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
}

export const env = parsed.data;
export const appRootDist = dirname((require.main as NodeJS.Module).filename);
export const appRoot = appRootDist.replace("/dist", "");
