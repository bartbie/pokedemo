<script lang="ts">
    import {
        Autocomplete,
        Paginator,
        Table,
        popup,
        tableMapperValues,
        toastStore
    } from "@skeletonlabs/skeleton";
    import type { AutocompleteOption, PopupSettings, TableSource } from "@skeletonlabs/skeleton";
    import type { PageData } from "./$types";
    import type { API, Email, ExistingPokemon, PokemonId, Role, User, UserId } from "@pokedemo/api";
    import { goto, invalidateAll } from "$app/navigation";

    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import { apiClient } from "$lib/api";

    // Provide the modal settings
    const userModal: ModalSettings = {
        type: "component",
        component: "userActions"
    };

    export let data: PageData;
    $: users = data.users;
    $: token = data.token;

    let searchFilter = "";

    $: searchOptions = users.map(({ email, role }) => ({
        label: email,
        value: email,
        keywords: role,
        meta: { email, role }
    })) satisfies AutocompleteOption[];

    function onOptionSelection(event: any): void {
        searchFilter = event.detail.label;
    }

    let popupSettings: PopupSettings = {
        event: "focus-click",
        target: "popupAutocomplete",
        placement: "bottom"
    };

    $: filteredUsers = searchFilter
        ? users.filter(
              (e) => e.email.includes(searchFilter.trim()) || e.role.includes(searchFilter.trim())
          )
        : users;

    const keys = ["id", "email", "role"] satisfies (keyof (typeof users)[number])[];

    $: size = filteredUsers.length;

    $: page = {
        offset: 0,
        limit: 5,
        size,
        amounts: [1, 2, 5, 10]
    };

    $: paginatedSource = filteredUsers.slice(
        page.offset * page.limit, // start
        page.offset * page.limit + page.limit // end
    );

    $: tableSimple = {
        // A list of heading labels.
        head: keys,
        // The data visibly shown in your table body UI.
        body: tableMapperValues(paginatedSource, keys),
        // Optional: The data returned when interactive is enabled and a row is clicked.
        meta: tableMapperValues(paginatedSource, ["id", "email", "role"]),
        // Optional: A list of footer labels.
        foot: ["Total", "", `<code class="code">${size}</code>`]
    } satisfies TableSource;

    const api = apiClient(fetch);
    const deleteFn = async ({ id, email, role }: User) => {
        const res = await api<API["/users"]["/:id"]["DELETE"]>(`/api/users/${id}`, {
            method: "DELETE",
            auth: token
        });
        if (res.success) {
            toastStore.trigger({
                message: `Success! User ${email} has been deleted.`,
                background: "variant-filled-success"
            });
        } else {
            console.error(res.error);
            toastStore.trigger({
                message: `Error! Couldn't delete user ${email}!`,
                background: "variant-filled-error"
            });
        }
        await invalidateAll();
    };

    const roleChangeFn = async ({ id, email, role }: User) => {
        const res = await api<API["/users"]["/:id"]["PATCH"]>(`/api/users/${id}`, {
            method: "PATCH",
            auth: token,
            body: { role: role === "USER" ? "ADMIN" : "USER" }
        });
        if (res.success) {
            toastStore.trigger({
                message: `Success! ${res.data.email} is now ${res.data.role}`,
                background: "variant-filled-success"
            });
        } else {
            console.error(res.error);
            toastStore.trigger({
                message: `Error! Couldn't change ${email}'s role to ${role}`,
                background: "variant-filled-error"
            });
        }
        await invalidateAll();
    };

    const selectionHandler = (selected: { detail: any[] }) => {
        const user = {
            id: selected.detail[0] as UserId,
            email: selected.detail[1] as Email,
            role: selected.detail[2] as Role
        };
        // goto(`/admin/users/${id}`);
        modalStore.trigger({
            ...userModal,
            meta: { user, deleteFn, roleChangeFn }
        });
    };
</script>

<div class="space-y-5">
    <h1 class="h1">Manage Users</h1>
    <div class="flex justify-between">
        <div class="flex-grow-2">
            <input
                bind:value={searchFilter}
                class="input autocomplete"
                type="search"
                name="autocomplete-search"
                placeholder="Search for users"
                use:popup={popupSettings}
            />
            <div
                data-popup="popupAutocomplete"
                class="card z-40 w-full max-w-sm max-h-48 p-4 overflow-y-auto"
                tabindex="-1"
            >
                <Autocomplete
                    bind:input={searchFilter}
                    options={searchOptions}
                    on:selection={onOptionSelection}
                />
            </div>
        </div>
    </div>
    <Table interactive source={tableSimple} on:selected={selectionHandler} />

    <Paginator bind:settings={page} showFirstLastButtons={true} showPreviousNextButtons={true} />
</div>
