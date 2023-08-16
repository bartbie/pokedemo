<script lang="ts">
    import PokemonImg from "$lib/components/PokemonImg.svelte";
    import type { Pokemon } from "@pokedemo/api";
    import { AccordionItem } from "@skeletonlabs/skeleton";

    export let pokemonList: Required<Pokemon>[];
    export let searchFilter: string;
    export let clickFn: (p: Required<Pokemon>) => void;

    $: filteredList = pokemonList.filter((e) => e.name.includes(searchFilter.trim()));
</script>

<AccordionItem open>
    <svelte:fragment slot="lead"><slot /></svelte:fragment>
    <svelte:fragment slot="content">
        <ul class="list">
            {#each filteredList as pokemon}
                {@const { name, types, custom, sprite } = pokemon}
                <li
                    class="card-hover"
                    on:click={() => clickFn(pokemon)}
                    on:keypress={() => clickFn(pokemon)}
                >
                    <PokemonImg {name} {custom} {sprite} />
                    <span>{name}</span>
                    <div class="flex justify-center gap-3">
                        {#each types as typ}
                            <span class="badge variant-soft">{typ}</span>
                        {/each}
                    </div>
                </li>
            {/each}
        </ul>
    </svelte:fragment>
    <svelte:fragment slot="summary">
        {@const len = pokemonList.length}
        {@const filteredLen = filteredList.length}
        {#if searchFilter}
            [{filteredLen} shown ({len} all)]
        {:else}
            [{len}]
        {/if}
    </svelte:fragment>
</AccordionItem>
