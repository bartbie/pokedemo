<script lang="ts">
    import { AppShell, AppBar, LightSwitch } from "@skeletonlabs/skeleton";
    import type { LayoutData } from "./$types";
    import type { Role } from "@pokedemo/api";
    import { page } from "$app/stores";

    export let data: LayoutData;

    const nav: { name: string; href: string; admin?: boolean }[] = [
        { name: "My Pokemons", href: "/home" },
        { name: "Favorites", href: "/home/favorites" }
    ];
    $: classesActive = (href: string) => (href === $page.url.pathname ? "!bg-primary-500" : "");
</script>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
    <svelte:fragment slot="header">
        <!-- App Bar -->
        <AppBar>
            <svelte:fragment slot="lead">
                <strong class="text-xl uppercase">Pokedemo</strong>
            </svelte:fragment>

            <svelte:fragment slot="trail">
                <LightSwitch />
                <!-- TODO: make this button prettier -->
                <a class="btn btn-sm variant-ghost-surface" href="/auth/logout" rel="external">
                    Logout
                </a>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <svelte:fragment slot="sidebarLeft">
        <!-- <Navigation {role} {onClick} /> -->
        <nav class="list-nav p-4">
            <ul>
                {#each nav as { name, href, admin }}
                    {#if (admin && data.user.role == "ADMIN") || !admin}
                        <li>
                            <a {href} class={classesActive(href)}>
                                <span class="badge bg-primary-500" />
                                <span class="flex-auto">{name}</span>
                            </a>
                        </li>
                    {/if}
                {/each}
            </ul>
        </nav>
    </svelte:fragment>
    <!-- Page Route Content -->
    <div class="m-10">
        <slot />
    </div>
</AppShell>
