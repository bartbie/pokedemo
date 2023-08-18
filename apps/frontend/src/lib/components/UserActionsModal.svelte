<script lang="ts">
    import { apiClient } from "$lib/api";
    import type { User } from "@pokedemo/api";
    import { modalStore } from "@skeletonlabs/skeleton";

    // Props
    /** Exposes parent props to this component. */
    export let parent: any;

    const onDelete = async () => {
        await deleteFn(user);
        modalStore.close();
    };

    const onRoleChange = async () => {
        await roleChangeFn(user);
        modalStore.close();
    };

    let roleChangeFn = $modalStore[0].meta?.roleChangeFn as (u: User) => Promise<void>;
    let deleteFn = $modalStore[0].meta?.deleteFn as (u: User) => Promise<void>;
    let user = $modalStore[0].meta?.user as User;
    const { id, email, role } = user;
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
    <div class="card p-4 w-full max-w-xs shadow-xl space-y-4">
        <header class="text-3xl font-bold text-center">User Actions</header>
        <h5 class="h5 text-center">{email}</h5>
        <hr />
        <div class="flex justify-center">
            <div class="w-2/5 flex flex-col space-y-3">
                <button class="btn variant-filled-error" on:click={onDelete}>Delete User</button>
                <button class="btn variant-filled-warning" on:click={onRoleChange}>
                    {#if role == "USER"}
                        Make Admin
                    {:else}
                        Make User
                    {/if}
                </button>
                <hr />
                <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
                    >{parent.buttonTextCancel}</button
                >
            </div>
        </div>
    </div>
{/if}
