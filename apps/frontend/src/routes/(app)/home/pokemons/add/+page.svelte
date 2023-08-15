<script lang="ts">
    import type { PageData } from "./$types";
    import {
        Accordion,
        popup,
        Autocomplete,
        type AutocompleteOption,
        type PopupSettings,
        toastStore
    } from "@skeletonlabs/skeleton";
    import PokemonAccordionItem from "./PokemonAccordionItem.svelte";
    import type { API, Pokemon } from "@pokedemo/api";
    import { apiClient } from "$lib/api";
    import { goto } from "$app/navigation";

    // TODO: in future add pagination maybe

    /*props*/
    export let data: PageData;
    const { availablePokemons: allPokemons, token } = data;

    /* search filtering */

    let searchFilter = "";

    const searchOptions: AutocompleteOption[] = allPokemons.map((pokemon) => ({
        label: pokemon.name,
        value: pokemon.name,
        keywords: pokemon.types.join(", ")
    }));

    function onOptionSelection(event: any): void {
        searchFilter = event.detail.label;
    }

    const popupSettings: PopupSettings = {
        event: "focus-click",
        target: "popupAutocomplete",
        placement: "bottom"
    };

    /*data*/
    //PERF: idc lol

    let selectedPokemons: typeof allPokemons = [];

    $: availablePokemons = allPokemons.filter((item) => !selectedPokemons.includes(item));

    const toggleSelection = (e: Required<Pokemon>) => {
        if (selectedPokemons.includes(e)) {
            selectedPokemons = selectedPokemons.filter((item) => item !== e);
        } else {
            selectedPokemons.push(e);
            selectedPokemons = selectedPokemons;
        }
    };

    const submit = async () => {
        const api = apiClient(fetch);
        const res = await api<API["/me"]["/pokemons"]["PUT"]>("/api/me/pokemons", {
            method: "PUT",
            auth: token,
            body: { pokemons: selectedPokemons.map(({ id }) => ({ id, favorite: false })) }
        });
        if (!res.success) {
            toastStore.trigger({
                message: "Couldn't add pokemons! Please try again!",
                background: "variant-filled-error"
            });
            return;
        }
        toastStore.trigger({
            message: "Success! Pokemons added!",
            background: "variant-filled-success"
        });
        await goto("/home");
    };
</script>

<div class="space-y-5">
    <h1 class="h1">Add Pokemons</h1>
    <div class="flex justify-between">
        <div class="flex-grow-2">
            <input
                bind:value={searchFilter}
                class="input autocomplete"
                type="search"
                name="autocomplete-search"
                placeholder="Search for pokemons..."
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
        <button type="button" on:click={submit} class="btn variant-filled"> Submit </button>
    </div>
</div>
<br />
<section>
    <Accordion>
        <!-- to add -->
        <PokemonAccordionItem
            {searchFilter}
            pokemonList={selectedPokemons}
            clickFn={toggleSelection}
        >
            Choosen Pokemons:
        </PokemonAccordionItem>
        <!-- to select from -->
        <PokemonAccordionItem
            {searchFilter}
            pokemonList={availablePokemons}
            clickFn={toggleSelection}
        >
            Available new Pokemons:
        </PokemonAccordionItem>
    </Accordion>
</section>
