<script lang="ts">
    import { focusTrap } from "@skeletonlabs/skeleton";
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
    import { loginSchema, signupSchema } from "./form";

    export let data: PageData;

    const {
        form: loginForm,
        enhance: loginEnhance,
        errors: loginErrors
    } = superForm(data.loginForm, {
        customValidity: true,
        validators: loginSchema
    });

    const {
        form: signupForm,
        enhance: signupEnhance,
        errors: signupErrors
    } = superForm(data.signupForm, {
        customValidity: true,
        validators: signupSchema
    });

    let state: "login" | "signup" = "login";

    const setLogin = () => {
        state = "login";
    };
    const setSignup = () => {
        state = "signup";
    };
    $: {
        // sync emails in login and signup
        $signupForm.email = $loginForm.email;
    }
    $: {
        // when state changes reset passwords
        state = state;
        $loginForm.password = "";
        $signupForm.password = "";
        $signupForm.confirmPassword = "";
    }
</script>

<!-- <SuperDebug data={[$loginForm, $signupForm]} /> -->
<div class="container h-full mx-auto flex justify-center items-center">
    <div class="card" use:focusTrap={true}>
        {#if state == "login"}
            <form method="POST" action="?/login" use:loginEnhance>
                <header>
                    <h2 class="h2">Welcome to Pokedemo</h2>
                    <p>
                        Please <button class="anchor" on:click={setLogin}>log in</button> or
                        <button class="anchor" on:click={setSignup}>register</button> to use the app
                    </p>
                </header>
                <section>
                    <label class="label">
                        <span>Email</span>
                        <input
                            required
                            name="email"
                            type="text"
                            class="input {$loginErrors.email ? 'input-error' : ''}"
                            placeholder="Email"
                            bind:value={$loginForm.email}
                        />
                    </label>
                    <label class="label">
                        <span>Password</span>
                        <input
                            required
                            name="password"
                            type="password"
                            class="input {$loginErrors.password ? 'input-error' : ''}"
                            placeholder="Password"
                            bind:value={$loginForm.password}
                        />
                    </label>
                </section>
                <footer>
                    <button class="btn variant-filled-primary">log in</button>
                </footer>
            </form>
        {:else}
            <form method="POST" action="?/signup" use:signupEnhance>
                <header>
                    <h2 class="h2">Welcome to Pokedemo</h2>
                    <p>
                        Please <button class="anchor" on:click={setLogin}>log in</button> or
                        <button class="anchor" on:click={setSignup}>register</button> to use the app
                    </p>
                </header>
                <section>
                    <label class="label">
                        <span>Email</span>
                        <input
                            required
                            name="email"
                            type="text"
                            class="input {$signupErrors.email ? 'input-error' : ''}"
                            placeholder="Email"
                            bind:value={$signupForm.email}
                        />
                    </label>
                    <label class="label">
                        <span>Password</span>
                        <input
                            required
                            name="password"
                            type="password"
                            class="input {$signupErrors.password ? 'input-error' : ''}"
                            placeholder="Password"
                            bind:value={$signupForm.password}
                        />
                    </label>
                    <label class="label">
                        <span>Confirm Password</span>
                        <input
                            required
                            name="confirmPassword"
                            type="password"
                            class="input {$signupErrors.password ? 'input-error' : ''}"
                            placeholder="Password"
                            bind:value={$signupForm.confirmPassword}
                        />
                    </label>
                </section>
                <footer>
                    <button class="btn variant-filled-primary">sign up</button>
                </footer>
            </form>
        {/if}
    </div>
</div>

<style lang="postcss">
    form {
        @apply space-y-6 px-10 py-8;
    }
    header {
        @apply card-header flex flex-col justify-center items-center space-y-3;
    }
    section {
        @apply flex justify-center flex-col space-y-6;
    }
    footer {
        @apply pt-3 card-footer flex justify-center items-center space-x-2;
    }
</style>
