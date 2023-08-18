<script lang="ts">
    import {
        Autocomplete,
        Paginator,
        Table,
        popup,
        tableMapperValues
    } from "@skeletonlabs/skeleton";
    import type { AutocompleteOption, PopupSettings, TableSource } from "@skeletonlabs/skeleton";
    import type { PageData } from "./$types";
    import type { ExistingPokemon, PokemonId } from "@pokedemo/api";
    import { goto } from "$app/navigation";

    export let data: PageData;
    const { pokemons } = data;
    console.log(pokemons);

    let onlyCustom = false;

    $: chipStateClass = onlyCustom ? "variant-filled-primary" : "variant-soft-primary";

    let searchFilter = "";

    $: searchOptions = pokemons.map(({ name, types }) => ({
        label: name,
        value: name,
        keywords: types.join(", "),
        meta: { name, types }
    })) satisfies AutocompleteOption[];

    function onOptionSelection(event: any): void {
        searchFilter = event.detail.label;
    }

    let popupSettings: PopupSettings = {
        event: "focus-click",
        target: "popupAutocomplete",
        placement: "bottom"
    };

    $: _filteredPokemons = searchFilter
        ? pokemons.filter(
              (e) =>
                  e.name.includes(searchFilter.trim()) ||
                  e.id.toString() == searchFilter.trim() ||
                  e.types.some((i) => i.includes(searchFilter.trim()))
          )
        : pokemons;

    $: filteredPokemons = onlyCustom
        ? _filteredPokemons.filter((e) => e.custom)
        : _filteredPokemons;
    const keys = [
        // "sprite",
        "id",
        "pokeId",
        "name",
        "custom",
        "types"
    ] satisfies (keyof (typeof pokemons)[number])[];

    $: size = filteredPokemons.length;

    $: page = {
        offset: 0,
        limit: 5,
        size,
        amounts: [1, 2, 5, 10]
    };

    $: paginatedSource = filteredPokemons.slice(
        page.offset * page.limit, // start
        page.offset * page.limit + page.limit // end
    );

    $: tableSimple = {
        // A list of heading labels.
        head: keys,
        // The data visibly shown in your table body UI.
        // body: tableMapperValues(pokemons, keys),
        body: tableMapperValues(paginatedSource, keys),
        // Optional: The data returned when interactive is enabled and a row is clicked.
        meta: tableMapperValues(paginatedSource, ["id"]),
        // Optional: A list of footer labels.
        foot: ["Total", "", "", "", `<code class="code">${size}</code>`]
    } satisfies TableSource;

    const selectionHandler = (selected: { detail: any[] }) => {
        const id = selected.detail[0] as PokemonId;
        goto(`/admin/pokemons/${id}`);
    };
</script>

<div class="space-y-5">
    <h1 class="h1">Manage Pokemons</h1>
    <div class="flex justify-between">
        <div class="flex">
            <div class="flex-grow-2">
                <input
                    bind:value={searchFilter}
                    class="input autocomplete"
                    type="search"
                    name="autocomplete-search"
                    placeholder="Search for pokemons"
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
            <span
                class="chip {chipStateClass}"
                on:keypress
                on:click={() => (onlyCustom = !onlyCustom)}>show customs only</span
            >
        </div>

        <button type="button" class="btn variant-filled">
            <a href="/admin/pokemons/add">
                <span>+</span>
                <span>Add</span>
            </a>
        </button>
    </div>
    <Table interactive source={tableSimple} on:selected={selectionHandler} />

    <Paginator bind:settings={page} showFirstLastButtons={true} showPreviousNextButtons={true} />
</div>
