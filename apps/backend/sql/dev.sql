DO $$
DECLARE
    user_id_1 integer;
    user_id_2 integer;
    --
    pokemon_id_1 integer;
    pokemon_id_2 integer;
    pokemon_id_3 integer;
    BEGIN
    DELETE FROM users_pokemons;
    DELETE FROM users;
    DELETE FROM pokemons;
    ---
    INSERT INTO users (email, password)
    VALUES ('test@test.com', 'test')
    RETURNING id INTO user_id_1;
    --
    INSERT INTO users (email, password, role)
    VALUES ('admin@admin.com', 'admin', 'ADMIN')
    RETURNING id INTO user_id_2;
    ---
    INSERT INTO pokemons ("pokeId", name, "height", weight, sprite, custom)
    VALUES (
            1,
            'bulbosaur',
            10,
            10,
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
            false
        )
    RETURNING id INTO pokemon_id_1;
    --
    INSERT INTO pokemons ("pokeId", name, "height", weight, sprite, custom)
    VALUES (
            2,
            'ivysaur',
            20,
            20,
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
            false
        )
    RETURNING id INTO pokemon_id_2;
    --
    INSERT INTO pokemons (name, "height", weight, custom)
    VALUES ('custombulbo', 10, 10, true)
    RETURNING id INTO pokemon_id_3;
    ---
    INSERT INTO users_pokemons (user_id, pokemon_id, favorite)
    VALUES (user_id_1, pokemon_id_1, true);
    --
    INSERT INTO users_pokemons (user_id, pokemon_id, favorite)
    VALUES (user_id_1, pokemon_id_2, false);
    --
    INSERT INTO users_pokemons (user_id, pokemon_id, favorite)
    VALUES (user_id_2, pokemon_id_3, false);
    ---
    COMMIT;
END $$;
