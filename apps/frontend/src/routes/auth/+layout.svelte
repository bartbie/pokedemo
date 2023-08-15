<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import { AppBar, AppShell, LightSwitch } from "@skeletonlabs/skeleton";
</script>

<AppShell>
    <svelte:fragment slot="header">
        <AppBar class="text-xl uppercase">
            <svelte:fragment slot="lead">
                <Logo />
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <LightSwitch />
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <slot />
</AppShell>
