<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
    import { apiClient } from "$lib/api";
    import type { API } from "@pokedemo/api";
    import { onMount } from "svelte";
    import { AppShell, AppBar, LightSwitch } from "@skeletonlabs/skeleton";

    const api = apiClient(fetch);

    onMount(async () => {
        let checkIfWrapperWorks = await api<API["/healthcheck"]["GET"]>("/api/healthcheck");
        console.log(checkIfWrapperWorks);
    });
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

    <div class="container h-full mx-auto flex justify-center items-center">
        <div class="space-y-10 text-center flex flex-col items-center">
            <!-- Animated Logo -->
            <section class="img-bg" />
            <figure class="flex relative flex-col items-center text-center space-y-5">
                <h1 class="h1">Welcome to Pokedemo</h1>
                <h3 class="h3">Your private pokedex</h3>
                <p>Keep track of your captured pokemons wherever you are.</p>
            </figure>
            <!-- / -->
            <div class="flex justify-center space-x-2">
                <a data-sveltekit-replacestate class="btn variant-filled" href="/auth/login">
                    Login
                </a>
            </div>
        </div>
    </div>
</AppShell>

<style lang="postcss">
    .img-bg {
        @apply w-64 h-64 md:w-80 md:h-80;
    }
    .img-bg {
        @apply absolute z-[-1] rounded-full blur-[50px] transition-all;
        animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite, glow 5s linear infinite;
    }
    @keyframes glow {
        0% {
            @apply bg-primary-400/50;
        }
        33% {
            @apply bg-secondary-400/50;
        }
        66% {
            @apply bg-tertiary-400/50;
        }
        100% {
            @apply bg-primary-400/50;
        }
    }
    @keyframes pulse {
        50% {
            transform: scale(1.5);
        }
    }
</style>
