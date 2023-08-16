<script lang="ts">
    import PokemonGrid from "$lib/components/PokemonGrid.svelte";
    import type { PageData } from "./$types";
    export let data: PageData;

    const pokemons = data.pokemons;

    let searchFilter = "";
</script>

<PokemonGrid {pokemons} {searchFilter} searchPlaceholder="Search your pokemons...">
    <svelte:fragment slot="title">
        <h1 class="h1">My Pokemons - All</h1>
    </svelte:fragment>
</PokemonGrid>
