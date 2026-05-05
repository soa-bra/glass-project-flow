/**
 * Shared adapters — public API.
 * يحوّل النماذج بين central schema (DB) و legacy view-models (UI).
 */
export { toUnifiedTask, fromUnifiedTaskPatch } from "./centralTaskAdapter";
