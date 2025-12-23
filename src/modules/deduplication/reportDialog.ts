import { DuplicateGroup } from "./matcher";
import { Merger } from "./merger";

export class ReportDialog {
    static async show(groups: DuplicateGroup[]) {
        const win = Zotero.getMainWindow();
        const addonRef = "zoteroCollectionsDeduplicator"; // Hardcoded matching package.json config
        const url = `chrome://${addonRef}/content/report.html`;

        // Prepare data to pass
        const params = {
            groups: groups,
            mergeCallback: (groupId: string) => {
                Zotero.debug(`[Deduplicator] Merge requested for ${groupId}`);
                // Find group
                const group = groups.find(g => g.id === groupId);
                if (group) {
                    Merger.mergeGroup(group.id, group.items);
                }
            }
        };

        // Open Dialog
        // Use openDialog (Firefox/XUL method)
        win.openDialog(url, "duplicate-report", "chrome,centerscreen,resizable,scrollbars,width=600,height=800", params);
    }
}
