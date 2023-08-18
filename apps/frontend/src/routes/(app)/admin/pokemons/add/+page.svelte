<script lang="ts">
    import { InputChip, toastStore } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";
    import {
        pokemonTypeSchema,
        pokemonTypesArr,
        type API,
        type CustomPokemon
    } from "@pokedemo/api";
    import type { PageData } from "./$types";
    import { setError, superForm, superValidateSync } from "sveltekit-superforms/client";
    import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
    import { z } from "zod";
    import { apiClient } from "$lib/api";

    const correctTypesSchema = z
        .tuple([pokemonTypeSchema])
        .or(z.tuple([pokemonTypeSchema, pokemonTypeSchema]));

    const addFormSchema = z.object({
        name: z.string().nonempty(),
        height: z.number().positive(),
        // pokemon weight can be negative, why not
        weight: z.number(),
        types: z.string().array().optional().default(["NORMAL"])
    });

    const toastError = () =>
        toastStore.trigger({
            message: `Error! Couldn't add the Pokemon.`,
            background: "variant-filled-error"
        });

    const { form, enhance, errors } = superForm(superValidateSync(addFormSchema), {
        SPA: true,
        validators: addFormSchema,
        async onUpdate({ form }) {
            const types_res = correctTypesSchema.safeParse(form.data.types);
            if (!types_res.success) {
                console.log(form.data.types);
                setError(form, "Wrong types!");
                return;
            }
            if (!form.valid) {
                toastError();
                return;
            }
            // api check
            const { data } = form;

            const api = apiClient(fetch);
            const { data: pokemons } = await api<API["/pokemons"]["GET"]>("/api/pokemons");
            if (pokemons.some(({ name }) => data.name && data.name === name)) {
                return setError(form, "name", "Name already taken!");
            }
            // add the pokemon
            const res = await api<API["/pokemons"]["POST"]>(`/api/pokemons`, {
                method: "POST",
                body: { ...data, pokeId: null, custom: true } as any,
                auth: token
            });
            if (res.success) {
                toastStore.trigger({
                    message: `Success! Added new Pokemon.`,
                    background: "variant-filled-success"
                });
                goto("/admin/pokemons", { invalidateAll: true });
            } else {
                toastError();
            }
        }
    });

    export let data: PageData;
    $: token = data.token;

    /* types handling */
    let whitelist = [...pokemonTypesArr];

    const chipsHandle = (e: any) => {
        $form.types = $form.types.map((i) => i.toUpperCase());
    };
</script>

<div class="flex justify-between">
    <h1 class="h1 text-center">Add new Pokemon</h1>

    <button on:click={() => goto("/admin/pokemons", { invalidateAll: true })} class="btn"
        >go back</button
    >
</div>
<br />
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
                        bind:value={$form.types}
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
