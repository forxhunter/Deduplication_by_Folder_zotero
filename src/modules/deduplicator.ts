import { getString } from "../utils/locale";
import { Matcher, DuplicateGroup } from "./deduplication/matcher";
import { ReportDialog } from "./deduplication/reportDialog";

export class Deduplicator {
    static register(win: Window) {
        Zotero.debug("[Deduplicator] Starting menu registration...");

        try {
            // Tools Menu
            Zotero.debug("[Deduplicator] Registering Tools menu item...");
            ztoolkit.Menu.register("menuTools", {
                tag: "menuitem",
                label: "Deduplicate Collection...",
                commandListener: (ev) => {
                    Zotero.debug("[Deduplicator] Tools menu clicked!");
                    Deduplicator.deduplicate();
                },
            });
            Zotero.debug("[Deduplicator] Tools menu registered successfully");

            // Collection Context Menu
            Zotero.debug("[Deduplicator] Registering collection context menu item...");
            ztoolkit.Menu.register("collection", {
                tag: "menuitem",
                label: "Deduplicate Collection...",
                commandListener: (ev) => {
                    Zotero.debug("[Deduplicator] Collection menu clicked!");
                    Deduplicator.deduplicate();
                },
            });
            Zotero.debug("[Deduplicator] Collection menu registered successfully");
        } catch (e) {
            Zotero.debug("[Deduplicator] ERROR during menu registration: " + e);
            Zotero.logError(e as Error);
        }
    }

    static async deduplicate() {
        Zotero.debug("[Deduplicator] deduplicate() called");

        const pane = Zotero.getActiveZoteroPane();
        if (!pane) {
            Zotero.debug("[Deduplicator] No active pane");
            ztoolkit.getGlobal("alert")("No active Zotero pane found.");
            return;
        }

        const collection = pane.getSelectedCollection();

        if (!collection) {
            Zotero.debug("[Deduplicator] No collection selected");
            ztoolkit.getGlobal("alert")("Please select a collection to deduplicate.");
            return;
        }

        Zotero.debug(`[Deduplicator] Processing collection: ${collection.name}`);
        // ztoolkit.getGlobal("alert")(`Selected Collection: ${collection.name}\nScanning items...`);

        const items = await collection.getChildItems();
        // Filter for regular items (handled in Matcher but good to be explicit/safe)
        const validItems = items.filter((i: any) => i.isRegularItem());

        Zotero.debug(`[Deduplicator] Found ${validItems.length} valid items`);
        const groups = await Matcher.findDuplicates(validItems);

        if (groups.length === 0) {
            Zotero.debug("[Deduplicator] No duplicates found");
            ztoolkit.getGlobal("alert")("No duplicates found.");
            return;
        }

        Zotero.debug(`[Deduplicator] Found ${groups.length} duplicate groups`);
        ReportDialog.show(groups);

        // Log items to console for now
        groups.forEach((g: DuplicateGroup) => {
            Zotero.debug(`[Deduplicator] Group ${g.id}: ${g.items.map((i: Zotero.Item) => i.getField('title')).join(' | ')}`);
        });
    }
}
