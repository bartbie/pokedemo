<script lang="ts">
    import PokemonImg from "$lib/components/PokemonImg.svelte";
    import type { /* API, PokemonId ,*/ UserPokemon } from "@pokedemo/api";
    import {
        popup,
        Autocomplete,
        type AutocompleteOption,
        type PopupSettings
        // toastStore
    } from "@skeletonlabs/skeleton";
    // import { apiClient } from "$lib/api";
    // import FaRegStar from "svelte-icons/fa/FaRegStar.svelte";
    // import FaStar from "svelte-icons/fa/FaStar.svelte";
    // import { tokenCtx } from "../../routes/(app)/+layout.svelte";
    import { goto } from "$app/navigation";

    export let pokemons: UserPokemon[];
    export let searchFilter: string;
    export let searchPlaceholder: string;

    /* search filtering */

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

    let popupSettings: PopupSettings = {
        event: "focus-click",
        target: "popupAutocomplete",
        placement: "bottom"
    };

    $: filteredPokemons = searchFilter
        ? pokemons.filter((e) => e.pokemon.name.includes(searchFilter.trim()))
        : pokemons;

    // const starSize = 6;
    // const { token } = tokenCtx();
    // const api = apiClient(fetch);
    //
    // const updateFav = async (favorite: boolean, id: PokemonId) => {
    //     favorite = !favorite;
    //     type Route = API["/me"]["/pokemons"]["/favorites"]["/:id"];
    //     const route = `/api/me/pokemons/favorites/${id}`;
    //     try {
    //         if (favorite) {
    //             const result = await api<Route["POST"]>(route, {
    //                 method: "POST",
    //                 auth: token
    //             });
    //             if (!result.success) throw Error();
    //             toastStore.trigger({
    //                 message: `Added ${name} to favorites.`,
    //                 background: "variant-filled-success"
    //             });
    //         } else {
    //             const result = await api<Route["DELETE"]>(route, {
    //                 method: "DELETE",
    //                 auth: token
    //             });
    //             if (!result.success) throw Error();
    //             toastStore.trigger({
    //                 message: `Removed ${name} from favorites.`,
    //                 background: "variant-filled-success"
    //             });
    //         }
    //     } catch {
    //         toastStore.trigger({
    //             message: `Couldn't add ${name} to favorites!`,
    //             background: "variant-filled-error"
    //         });
    //     }
    // };
</script>

<div class="space-y-5">
    <slot name="title" />
    <div class="flex justify-between">
        <div class="flex-grow-2">
            <input
                bind:value={searchFilter}
                class="input autocomplete"
                type="search"
                name="autocomplete-search"
                placeholder={searchPlaceholder}
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
    {#each filteredPokemons as { pokemon: { id, sprite, types, name, custom }, favorite }}
        <button
            class="card card-hover flex flex-col justify-center p-4 space-y-1 w-44"
            on:click={async () => goto(`/home/pokemons/${id}`)}
        >
            <div class="flex justify-end">
                <!-- <button -->
                <!--     type="button" -->
                <!--     class="btn-icon text-amber-400 w-{starSize} h-{starSize}" -->
                <!--     on:click|stopPropagation={() => updateFav(favorite, id)} -->
                <!-- > -->
                <!--     {#if favorite} -->
                <!--         <FaStar /> -->
                <!--     {:else} -->
                <!--         <FaRegStar /> -->
                <!--     {/if} -->
                <!-- </button> -->
            </div>
            <PokemonImg {name} {sprite} {custom} />
            <h4 class="h4 text-center">{name}</h4>
            <div class="flex justify-center gap-3">
                {#each types as typ}
                    <span class="badge variant-soft">{typ}</span>
                {/each}
            </div>
        </button>
    {/each}
</section>
