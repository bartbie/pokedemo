<script lang="ts">
    import { AppBar, AppShell, LightSwitch } from "@skeletonlabs/skeleton";
    import { page } from "$app/stores";
    import Logo from "$lib/components/Logo.svelte";
</script>

<!-- <AppShell> -->
<!--     <svelte:fragment slot="header"> -->
<!--         <AppBar class="text-xl uppercase"> -->
<!--             <svelte:fragment slot="lead"> -->
<!--                 <strong class="text-xl uppercase">Pokedemo</strong> -->
<!--             </svelte:fragment> -->
<!--             <svelte:fragment slot="trail"> -->
<!--                 <LightSwitch /> -->
<!--             </svelte:fragment> -->
<!--         </AppBar> -->
<!--     </svelte:fragment> -->
<!--     <div class="alert"> -->
<!--         <h1 class="h1">{$page.error?.message}</h1> -->
<!--     </div> -->
<!-- </AppShell> -->

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

    <div class="container h-full mx-auto flex justify-center items-center">
        <div class="space-y-10 text-center flex flex-col items-center">
            <!-- Animated Logo -->
            <section class="img-bg" />
            <figure class="flex relative flex-col items-center text-center space-y-4">
                <h1 class="h1 font-bold">Error!</h1>
                <p>status:</p>
                <h2 class="h2 font-bold">{$page.status}</h2>
                <p>message:</p>
                <h2 class="h2 font-bold">{$page.error?.message}</h2>
            </figure>
            <!-- / -->
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
