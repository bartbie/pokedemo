<script lang="ts">
    import PokemonImg from "$lib/components/PokemonImg.svelte";
    import { InputChip, toastStore } from "@skeletonlabs/skeleton";
    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";

    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import { pokemonTypesArr, type PokemonType } from "@pokedemo/api";
    import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

    export let data: PageData;

    const { pokemon: initialData } = data;
    const { name: initialName, custom } = initialData;

    const { form, enhance, errors, constraints } = superForm(data.form, {
        // resetForm: true,
        // onError: "apply",
        onUpdated({ form }) {
            if (form.valid) {
                toastStore.trigger({
                    message: `Success! Pokemon with id ${initialData.id} updated.`,
                    background: "variant-filled-success"
                });
            }
            goto("/admin/pokemons");
        }
    });

    /* types handling */

    let whitelist = [...pokemonTypesArr];
</script>

<SuperDebug data={form} />
<div class="flex justify-between">
    <div>
        <div class="flex gap-1 items-baseline">
            <h1 class="h1 text-center">
                {initialName}
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
    <PokemonImg {...initialData} clazz="w-64 h-64 object-cover mx-auto" />
    <form method="POST" class="flex justify-center">
        <div class="w-4/5 grid grid-cols-2">
            <div class="w-2/3 grid grid-cols-1">
                <label class="label">
                    <span>Name</span>
                    <input
                        bind:value={$form.name}
                        class="input {$errors.name ? 'input-error' : ''}"
                        type="text"
                        name="name"
                        placeholder={initialData.name}
                        {...$constraints.name}
                    />
                </label>
                <label class="label">
                    <span>weight</span>
                    <input
                        bind:value={$form.weight}
                        type="number"
                        name="weight"
                        class="input {$errors.weight ? 'input-error' : ''}"
                        placeholder={initialData.weight.toString()}
                        {...$constraints.weight}
                    />
                </label>
                <label class="label">
                    <span>height</span>
                    <input
                        bind:value={$form.height}
                        class="input {$errors.height ? 'input-error' : ''}"
                        type="number"
                        name="height"
                        placeholder={initialData.height.toString()}
                        {...$constraints.height}
                    />
                </label>
            </div>

            <div class="w-4/5 flex flex-col justify-between">
                <div class="label">
                    <span>types</span>
                    <InputChip
                        on:add={(e) => {
                            console.log(e);
                            $form.types = $form.types.map((i) => i.toUpperCase());
                        }}
                        bind:value={$form.types}
                        name="chips"
                        placeholder={initialData.types.toString()}
                        {whitelist}
                        max={2}
                    />
                    <!-- <input type="hidden" name="types" bind:value={$form.types} /> -->
                </div>

                <div class="flex justify-end">
                    <button class="w-2/5 btn variant-filled-secondary">Submit</button>
                </div>
            </div>
        </div>
    </form>
</section>
