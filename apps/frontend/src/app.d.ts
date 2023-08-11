import type { User, API as _API } from "@pokedemo/api";
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
    type API = _API;
    namespace App {
        interface Locals {
            user: User | null;
        }
        // interface PageData {}
        // interface Error {}
        // interface Platform {}
    }
}
