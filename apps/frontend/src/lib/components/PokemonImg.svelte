<script lang="ts">
    import type { Pokemon } from "@pokedemo/api";
    import { filter } from "@skeletonlabs/skeleton";
    import { onMount } from "svelte";
    export let name: string;
    export let sprite: string | null;
    export let custom: boolean;
    export let clazz: string | undefined = undefined;
    export let placeholderSize = 16;

    const DEFAULT_IMG =
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

    let loaded = false;
    let failed = false;
    let loading = false;

    onMount(() => {
        let src = custom ? DEFAULT_IMG : (sprite as string);
        const img = new Image();
        img.src = src;
        loading = true;

        img.onload = () => {
            loading = false;
            loaded = true;
        };
        img.onerror = () => {
            loading = false;
            failed = true;
        };
    });
</script>

{#if loaded}
    {#if custom}
        <img class={clazz} src={DEFAULT_IMG} alt={name + "-img"} use:filter={"#NoirLight"} />
    {:else}
        <img class={clazz} src={sprite} alt={name + "-img"} />
    {/if}
{:else if failed}
    <img class={clazz} src={DEFAULT_IMG} alt={name + "-img"} use:filter={"#NoirLight"} />
{:else if loading}
    <div class="placeholder-circle w-{placeholderSize} animate-pulse" />
{/if}
