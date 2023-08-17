<script lang="ts">
    import PokemonImg from "$lib/components/PokemonImg.svelte";
    import type { PageData } from "./$types";
    import { apiClient } from "$lib/api";
    import type { API } from "@pokedemo/api";
    import { toastStore } from "@skeletonlabs/skeleton";
    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";

    export let data: PageData;
    const { pokemon, token } = data;
    const { id, pokeId, name, custom, height, weight, types } = pokemon;

    const api = apiClient(fetch);

    const deletePokemon = async () => {
        if (!custom) {
            const result = await api<API["/pokemons"]["/:id"]["DELETE"]>(`/api/pokemons/${id}`, {
                method: "DELETE",
                auth: token
            });
            if (result.success) {
                toastStore.trigger({
                    message: `${name} deleted from database!`,
                    background: "variant-filled-success"
                });
            } else {
                result.error;
                toastStore.trigger({
                    message: `Couldn't delete the ${name}!`,
                    background: "variant-filled-error"
                });
            }
        }
    };

    const triggerDelModal = () => {
        if (!custom) {
            const modal: ModalSettings = {
                type: "confirm",
                title: `Delete ${name}?`,
                body: "Are you sure you wish to proceed? (You won't be able to revert this!).",
                // Returns the updated response value
                response: async (r: boolean) => {
                    if (!r) return;
                    await deletePokemon();
                    goto("/admin/pokemons", { invalidateAll: true });
                }
            };
            modalStore.trigger(modal);
        }
    };
</script>

<div class="flex justify-between">
    <div>
        <div class="flex gap-1 items-baseline">
            <h1 class="h1 text-center">
                {name}
            </h1>
        </div>
        {#if custom}
            <h4 class="h4">(custom)</h4>
        {/if}
    </div>

    <button on:click={() => goto("/admin/pokemons", { invalidateAll: true })} class="btn"
        >go back</button
    >
</div>
<section class="flex flex-col justify-center">
    <!-- <h1 class="h1 text-center">{name}</h1> -->
    <PokemonImg {...pokemon} clazz="w-64 h-64 object-cover mx-auto" />
    <div class="flex justify-between">
        <div class="w-4/5 space-y-5">
            <div class="grid grid-cols-2 gap-16">
                <div>
                    <h3 class="h3">id</h3>
                    <p class="font-bold">{id}</p>
                </div>
                <div>
                    <h3 class="h3">pokeId</h3>
                    {#if pokeId != null}
                        <p class="font-bold">{pokeId}</p>
                    {:else}
                        <p class="italic">(custom)</p>
                    {/if}
                </div>
            </div>
            <hr />
            <div class="grid grid-cols-2 gap-16">
                <div>
                    <h3 class="h3">height</h3>
                    <p class="font-bold">{height}</p>
                </div>
                <div>
                    <h3 class="h3">weight</h3>
                    <p class="font-bold">{weight}</p>
                </div>
            </div>
            <hr />
            <div class="grid grid-cols-2 gap-16">
                <h3 class="h3">types</h3>
                <div>
                    {#each types as typ}
                        <span class="badge variant-soft">{typ}</span>
                    {/each}
                </div>
            </div>
        </div>
        {#if custom}
            <span class="divider-vertical h-50" />
            <div class="flex flex-col justify-center space-y-4">
                <div class="grid gap-8">
                    <a href="/admin/pokemons/{id}/edit" class="btn variant-ghost-warning">update</a>
                    <hr />
                    <button class="btn variant-ghost-error" on:click={triggerDelModal}
                        >delete</button
                    >
                </div>
            </div>
        {/if}
    </div>
</section>
