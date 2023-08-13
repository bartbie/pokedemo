<script lang="ts">
    import { focusTrap, toastStore } from "@skeletonlabs/skeleton";
    import type { PageData } from "./$types";
    // import { toastStore } from "@skeletonlabs/skeleton";
    import { superForm } from "sveltekit-superforms/client";
    import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
    import { err } from "@pokedemo/utils";
    import { authForm } from "../form";

    export let data: PageData;

    const { form, enhance, errors, constraints } = superForm(data.form, {
        customValidity: true,
        validators: authForm
    });
</script>

<SuperDebug data={$form} />
<div class="container h-full mx-auto flex justify-center items-center">
    <form use:enhance use:focusTrap={true} method="POST" class="card space-y-6 px-10 py-8">
        <header class="card-header flex flex-col justify-center items-center space-y-3">
            <h2 class="h2">Welcome to Pokedemo</h2>
            <p>
                Please <a class="anchor" href="/auth/login">log in</a> or
                <a class="anchor" href="/auth/register">register</a> to use the app
            </p>
        </header>
        <section class="flex justify-center flex-col space-y-6">
            <label class="label">
                <span>Email</span>
                <input
                    required
                    name="email"
                    type="text"
                    class="input {$errors.email ? 'input-error' : ''}"
                    placeholder="Email"
                    bind:value={$form.email}
                />
                <!-- {#if $errors.email}
                <p>{$errors.email}</p>
                {/if} -->
            </label>
            <label class="label">
                <span>Password</span>
                <input
                    required
                    name="password"
                    type="password"
                    class="input {$errors.password ? 'input-error' : ''}"
                    placeholder="Password"
                    bind:value={$form.password}
                />
            </label>
        </section>
        <footer class="pt-3 card-footer flex justify-center items-center space-x-2">
            <button class="btn variant-filled-primary">log in</button>
            <!-- <p class="text-gray-300">or</p>
			<button formaction="?/register" class="btn variant-filled-primary">register</button> -->
        </footer>
    </form>
</div>
