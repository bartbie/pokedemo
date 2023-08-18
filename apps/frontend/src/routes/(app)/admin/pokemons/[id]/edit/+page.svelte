<script lang="ts">
    import PokemonImg from "$lib/components/PokemonImg.svelte";
    import { InputChip, toastStore } from "@skeletonlabs/skeleton";
    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";

    import type { PageData } from "./$types";
    import { setError, superForm, superValidateSync } from "sveltekit-superforms/client";
    import { pokemonTypesArr, type API, pokemonTypeSchema } from "@pokedemo/api";
    import { z } from "zod";
    import { apiClient } from "$lib/api";

    export let data: PageData;

    const { pokemon: initialData, token } = data;
    const { name: initialName, custom } = initialData;

    const correctTypesSchema = z
        .tuple([pokemonTypeSchema])
        .or(z.tuple([pokemonTypeSchema, pokemonTypeSchema]));

    const editFormSchema = z
        .object({
            name: z.string().nonempty(),
            height: z.number().positive(),
            // pokemon weight can be negative, why not
            weight: z.number(),
            types: z.string().array().optional()
        })
        .partial();

    const toastError = () =>
        toastStore.trigger({
            message: `Error! Couldn't modify ${initialName}.`,
            background: "variant-filled-error"
        });

    const { form, enhance, errors } = superForm(superValidateSync(editFormSchema), {
        SPA: true,
        validators: editFormSchema,
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
            // patch the pokemon
            const res = await api<API["/pokemons"]["/:id"]["PATCH"]>(
                `/api/pokemons/${initialData.id}`,
                {
                    method: "PATCH",
                    body: form.data as any,
                    auth: token
                }
            );
            if (res.success) {
                toastStore.trigger({
                    message: `Success! Pokemon with id ${initialData.id} updated.`,
                    background: "variant-filled-success"
                });
                await goto("/admin/pokemons", { invalidateAll: true });
            } else {
                toastError();
            }
        }
    });

    /* types handling */

    let whitelist = [...pokemonTypesArr];

    const chipsHandle = (e: any) => {
        if ($form.types) $form.types = $form.types.map((i) => i.toUpperCase());
    };
</script>

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
                        placeholder={initialData.name}
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
                        placeholder={initialData.types.toString()}
                        {whitelist}
                        max={2}
                    />
                </div>

                <div class="flex justify-end">
                    <button class="w-2/5 btn variant-filled-secondary">Submit</button>
                </div>
            </div>
        </div>
    </form>
</section>
