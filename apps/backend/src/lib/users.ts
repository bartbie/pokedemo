import { User } from "@pokedemo/api";
import { sql } from "./db";

export const findUser = async (id: number) =>
    (await sql<User[]>`SELECT id, email, role FROM users WHERE id = ${id};`).at(
        0
    );
