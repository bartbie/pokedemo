<script lang="ts">
    import { AppBar, AppShell, LightSwitch } from "@skeletonlabs/skeleton";
</script>

<AppShell>
    <svelte:fragment slot="header">
        <AppBar class="text-xl uppercase">
            <svelte:fragment slot="lead">
                <strong class="text-xl uppercase">Pokedemo</strong>
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <LightSwitch />
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <slot />
</AppShell>
