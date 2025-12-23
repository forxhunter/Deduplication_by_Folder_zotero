export class Merger {
    static async mergeGroup(groupId: string, items: Zotero.Item[]) {
        if (items.length < 2) return;

        // Strategy: Keep the first one, merge others into it.
        // Zotero.Items.merge(masterItem, otherItems)

        const master = items[0];
        const others = items.slice(1);

        try {
            await Zotero.Items.merge(master, others);
            // @ts-ignore - services
            Services.prompt.alert(null, "Merge Success", `Merged ${others.length} items into ${master.getField("title")}.`);
        } catch (e) {
            Zotero.debug(e);
            // @ts-ignore - services
            Services.prompt.alert(null, "Merge Failed", String(e));
        }
    }
}
