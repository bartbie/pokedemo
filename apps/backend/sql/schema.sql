DO $$ BEGIN
    CREATE TYPE "pokemon_types" AS ENUM(
        'NORMAL',
        'FIGHTING',
        'FLYING',
        'POISON',
        'GROUND',
        'ROCK',
        'BUG',
        'GHOST',
        'STEEL',
        'FIRE',
        'WATER',
        'GRASS',
        'ELECTRIC',
        'PSYCHIC',
        'ICE',
        'DRAGON',
        'DARK',
        'FAIRY',
        'UNKNOWN',
        'SHADOW'
    );
    EXCEPTION
        WHEN duplicate_object THEN null;
END $$;
--
DO $$ BEGIN CREATE TYPE "roles" AS ENUM('USER', 'ADMIN');
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
-- tables
CREATE TABLE IF NOT EXISTS "pokemons" (
    "id" serial PRIMARY KEY NOT NULL,
    "pokeId" integer UNIQUE,
    "types" "pokemon_types" [2] DEFAULT '{NORMAL}' NOT NULL,
    "name" text UNIQUE NOT NULL,
    "weight" integer NOT NULL,
    "height" integer NOT NULL,
    "sprite" text,
    "custom" boolean
);
--
CREATE TABLE IF NOT EXISTS "users" (
"id" serial PRIMARY KEY NOT NULL,
"email" text UNIQUE NOT NULL,
"role" "roles" DEFAULT 'USER' NOT NULL,
"password" text NOT NULL
);
--
CREATE TABLE IF NOT EXISTS "users_pokemons" (
"user_id" integer REFERENCES users(id) ON DELETE CASCADE,
"pokemon_id" integer REFERENCES pokemons(id) ON DELETE CASCADE,
"favorite" boolean DEFAULT false NOT NULL,
CONSTRAINT pk_user_pokemon PRIMARY KEY (user_id, pokemon_id)
);
