<script lang="ts">
    import type { Pokemon } from "@pokedemo/api";
    import { filter } from "@skeletonlabs/skeleton";
    export let name: string;
    export let sprite: string | null;
    export let custom: boolean;
    export let clazz: string | undefined = undefined;

    const DEFAULT_IMG =
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";
</script>

{#if custom}
    <img class={clazz} src={DEFAULT_IMG} alt={name + "-img"} use:filter={"#NoirLight"} />
{:else}
    <img class={clazz} src={sprite} alt={name + "-img"} />
{/if}
