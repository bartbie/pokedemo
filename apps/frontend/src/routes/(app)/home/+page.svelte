<script lang="ts">
    import PokemonImg from "$lib/components/PokemonImg.svelte";
    import type { PageData } from "./$types";
    import {
        popup,
        Autocomplete,
        type AutocompleteOption,
        type PopupSettings
    } from "@skeletonlabs/skeleton";
    export let data: PageData;

    const pokemons = data.pokemons;

    /* search filtering */

    let searchFilter = "";

    // search popup
    const searchOptions: AutocompleteOption[] = pokemons.map(({ favorite, pokemon }) => ({
        label: pokemon.name,
        value: pokemon.name,
        keywords: pokemon.types.join(", "),
        meta: { favorite }
    }));

    function onOptionSelection(event: any): void {
        searchFilter = event.detail.label;
    }

    // search popup
    let popupSettings: PopupSettings = {
        event: "focus-click",
        target: "popupAutocomplete",
        placement: "bottom"
    };

    $: filteredPokemons = searchFilter
        ? pokemons.filter((e) => e.pokemon.name.startsWith(searchFilter.trim()))
        : pokemons;
</script>

<div class="space-y-5">
    <h1 class="h1">My Pokemons - All</h1>
    <div class="flex justify-between">
        <div class="flex-grow-2">
            <input
                bind:value={searchFilter}
                class="input autocomplete"
                type="search"
                name="autocomplete-search"
                placeholder="Search your pokemons..."
                use:popup={popupSettings}
            />
            <div
                data-popup="popupAutocomplete"
                class="card z-40 w-full max-w-sm max-h-48 p-4 overflow-y-auto"
                tabindex="-1"
            >
                <Autocomplete
                    bind:input={searchFilter}
                    options={searchOptions}
                    on:selection={onOptionSelection}
                />
            </div>
        </div>
        <button type="button" class="btn variant-filled">
            <a href="/home/pokemons/add">
                <span>+</span>
                <span>Add</span>
            </a>
        </button>
    </div>
</div>

<section class="grid grid-cols-2 md:grid-cols-3 gap-4 m-8">
    {#each filteredPokemons as { pokemon: { id, sprite, types, name, custom } }}
        <a
            href="/home/pokemons/{id}"
            class="card card-hover flex flex-col justify-center p-4 space-y-1 w-44"
        >
            <div class="flex justify-between">
                <button type="button" class="btn btn-sm variant-glass-warning">fav</button>
                <button type="button" class="btn btn-sm variant-glass-error">del</button>
            </div>
            <PokemonImg {name} {sprite} {custom} />
            <h4 class="h4 text-center">{name}</h4>
            <div class="flex justify-center gap-3">
                {#each types as typ}
                    <span class="badge variant-soft">{typ}</span>
                {/each}
            </div>
        </a>
    {/each}
    <!-- 	<img class="h-auto max-w-full rounded-lg" src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop" alt=""> -->
    <!-- </div> -->
</section>
