<script lang="ts">
    // The ordering of these imports is critical to your app working properly
    import "@skeletonlabs/skeleton/themes/theme-crimson.css";
    // If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
    import "@skeletonlabs/skeleton/styles/skeleton.css";
    // Most of your app wide CSS should be put in this file
    import "../app.postcss";
    import { Modal, NoirLight, Toast, type ModalComponent } from "@skeletonlabs/skeleton";
    // popup
    import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";
    import { storePopup } from "@skeletonlabs/skeleton";
    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
    import UserActionsModal from "$lib/components/UserActionsModal.svelte";

    const modalComponentRegistry: Record<string, ModalComponent> = {
        // Custom Modal 1
        userActions: {
            // Pass a reference to your custom component
            ref: UserActionsModal
            // Add the component properties as key/value pairs
            // props: { background: "bg-surface-100-800-token" },
        }
    };
</script>

<NoirLight />
<Toast />
<Modal components={modalComponentRegistry} />
<slot />
