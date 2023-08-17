<script lang="ts">
    import PokemonImg from "$lib/components/PokemonImg.svelte";
    import { InputChip, toastStore } from "@skeletonlabs/skeleton";
    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";

    import type { PageData } from "./$types";
    import { superForm, fieldProxy } from "sveltekit-superforms/client";
    import { pokemonTypesArr, type PokemonType } from "@pokedemo/api";
    import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
    import { z } from "zod";

    const updateFormSchema = z.object({
        name: z.string().nonempty(),
        height: z.number().positive(),
        // pokemon weight can be negative, why not
        weight: z.number(),
        types: z.string()
    });

    export let data: PageData;

    const { form, enhance, errors } = superForm(data.form, {
        customValidity: true,
        validators: updateFormSchema,
        // dataType: "json",
        // resetForm: true,
        // onError: "apply",
        onUpdated({ form }) {
            if (form.valid) {
                toastStore.trigger({
                    message: `Success! Added new Pokemon.`,
                    background: "variant-filled-success"
                });
                goto("/admin/pokemons");
            } else {
                toastStore.trigger({
                    message: `Error! Couldn't add the Pokemon.`,
                    background: "variant-filled-error"
                });
                console.error(form.errors);
            }
        }
    });

    /* types handling */
    let whitelist = [...pokemonTypesArr];
    const types = fieldProxy(form, "types");
    let _chips: string[] = [];

    const chipsHandle = (e: any) => {
        console.log(e);
        _chips = _chips.map((i) => i.toUpperCase());
    };
    $: $types = JSON.stringify(_chips);
</script>

<div class="flex justify-between">
    <h1 class="h1 text-center">Add new Pokemon</h1>

    <button on:click={() => goto("/admin/pokemons", { invalidateAll: true })} class="btn"
        >go back</button
    >
</div>
<br />
<SuperDebug data={form} />
<section class="flex flex-col justify-center">
    <form method="POST" use:enhance class="flex justify-center">
        <div class="w-4/5 grid grid-cols-2">
            <div class="w-2/3 grid grid-cols-1">
                <label class="label">
                    <span>Name</span>
                    <input
                        bind:value={$form.name}
                        class="input {$errors.name ? 'input-error' : ''}"
                        type="text"
                        name="name"
                        placeholder="Name"
                    />
                </label>
                <label class="label">
                    <span>weight</span>
                    <input
                        bind:value={$form.weight}
                        type="number"
                        name="weight"
                        class="input {$errors.weight ? 'input-error' : ''}"
                        placeholder="weight"
                    />
                </label>
                <label class="label">
                    <span>height</span>
                    <input
                        bind:value={$form.height}
                        class="input {$errors.height ? 'input-error' : ''}"
                        type="number"
                        name="height"
                        placeholder="height"
                    />
                </label>
            </div>

            <div class="w-4/5 flex flex-col justify-between">
                <div class="label">
                    <span>types</span>
                    <InputChip
                        on:add={chipsHandle}
                        bind:value={_chips}
                        name="chips"
                        placeholder="types"
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
