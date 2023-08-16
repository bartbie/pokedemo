<script lang="ts">
    import PokemonGrid from "$lib/components/PokemonGrid.svelte";
    import type { PageData } from "./$types";
    export let data: PageData;

    let pokemons = data.pokemons.map((pokemon) => ({ favorite: true, pokemon }));

    let searchFilter = "";
</script>

<PokemonGrid {pokemons} {searchFilter} searchPlaceholder="Search your favorites...">
    <svelte:fragment slot="title">
        <h1 class="h1">My Pokemons - Favorites</h1>
    </svelte:fragment>
</PokemonGrid>
