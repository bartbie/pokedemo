import { env, appRoot } from "$env";
import path from "path";
import postgres from "postgres";

export const sql = postgres(env.DATABASE_URL);

/** will load schema to the DB*/
export const setupDB = async () => {
    const { join } = path;
    const sqlFolder = join(appRoot, "sql");
    const sqlSchemaFile = join(sqlFolder, "schema.sql");
    try {
        await sql.file(sqlSchemaFile);
        console.log("[db]: Schema loaded succesfully");
    } catch (e) {
        console.error(
            "[db]: Problem with loading schema. Aborting the program"
        );
        throw e;
    }
};
