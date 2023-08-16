<script lang="ts">
    import PokemonImg from "$lib/components/PokemonImg.svelte";
    import { createGoBack } from "$lib/utils";
    import type { PageData } from "./$types";
    import { navigating } from "$app/stores";
    import FaRegStar from "svelte-icons/fa/FaRegStar.svelte";
    import FaStar from "svelte-icons/fa/FaStar.svelte";
    import { apiClient } from "$lib/api";
    import type { API } from "@pokedemo/api";
    import { toastStore } from "@skeletonlabs/skeleton";
    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";

    export let data: PageData;
    const {
        pokemon: { pokemon, favorite: initialFavorite },
        token
    } = data;
    const { id, name, custom, height, weight, types } = pokemon;
    console.log("initialFavorite:", { initialFavorite });
    let favorite = initialFavorite;

    const api = apiClient(fetch);
    const goBack = createGoBack($navigating);

    const updateFav = async () => {
        favorite = !favorite;
        type Route = API["/me"]["/pokemons"]["/favorites"]["/:id"];
        const route = `/api/me/pokemons/favorites/${id}`;
        try {
            if (favorite) {
                const result = await api<Route["POST"]>(route, {
                    method: "POST",
                    auth: token
                });
                if (!result.success) throw Error();
                toastStore.trigger({
                    message: `Added ${name} to favorites.`,
                    background: "variant-filled-success"
                });
            } else {
                const result = await api<Route["DELETE"]>(route, {
                    method: "DELETE",
                    auth: token
                });
                if (!result.success) throw Error();
                toastStore.trigger({
                    message: `Removed ${name} from favorites.`,
                    background: "variant-filled-success"
                });
            }
        } catch {
            toastStore.trigger({
                message: `Couldn't add ${name} to favorites!`,
                background: "variant-filled-error"
            });
        }
    };

    const deletePokemon = async () => {
        const result = await api<API["/me"]["/pokemons"]["DELETE"]>(`/api/me/pokemons`, {
            method: "DELETE",
            auth: token,
            body: { id: [id] }
        });
        toastStore.trigger({
            message: `{name} deleted from collection!`,
            background: "variant-filled-success"
        });
    };

    const triggerDelModal = () => {
        const modal: ModalSettings = {
            type: "confirm",
            title: `Delete ${name}?`,
            body: "Are you sure you wish to proceed? (You can re-add the Pokemon later).",
            // Returns the updated response value
            response: async (r: boolean) => {
                if (!r) return;
                await deletePokemon();
                goBack();
            }
        };
        // Trigger the modal:
        modalStore.trigger(modal);
    };
</script>

<div class="flex justify-between">
    <div>
        <div class="flex gap-1 items-baseline">
            <h1 class="h1 text-center">
                {name}
            </h1>
            <button
                type="button"
                on:click={updateFav}
                class="btn-icon inline text-amber-400 w-8 h-8"
            >
                {#if favorite}
                    <FaStar />
                {:else}
                    <FaRegStar />
                {/if}
            </button>
        </div>
        {#if custom}
            <h4 class="h4">(custom)</h4>
        {/if}
    </div>

    <button on:click={goBack} class="btn">go back</button>
</div>
<section class="flex flex-col justify-center">
    <!-- <h1 class="h1 text-center">{name}</h1> -->
    <PokemonImg {...pokemon} clazz="w-64 h-64 object-cover mx-auto" />
    <div class="flex justify-between">
        <div class="flex flex-col col-end-2 justify-center gap-4">
            <div>
                <h3 class="h3">height</h3>
                <p class="font-bold">{height}</p>
            </div>
            <div>
                <h3 class="h3">weight</h3>
                <p class="font-bold">{weight}</p>
            </div>
            <div>
                <h3 class="h3">types</h3>
                <div>
                    {#each types as typ}
                        <span class="badge variant-soft">{typ}</span>
                    {/each}
                </div>
            </div>
        </div>
        <div class="flex flex-col">
            <button class="btn" on:click={triggerDelModal}>delete</button>
        </div>
    </div>
</section>
