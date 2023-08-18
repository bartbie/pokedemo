DO $$
DECLARE
    BEGIN
    DELETE FROM users_pokemons;
    DELETE FROM users;
    DELETE FROM pokemons;
    COMMIT;
END $$;
