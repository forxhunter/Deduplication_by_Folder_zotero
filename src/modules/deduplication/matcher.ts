
export interface DuplicateGroup {
    id: string; // signature
    items: Zotero.Item[];
    reason: string;
}

export class Matcher {
    static async findDuplicates(items: Zotero.Item[]): Promise<DuplicateGroup[]> {
        const groups: { [key: string]: DuplicateGroup } = {};

        for (const item of items) {
            if (!item.isRegularItem()) continue;

            // Tier 1: DOI
            const doi = item.getField("DOI") as string;
            if (doi) {
                const signature = "doi:" + doi.toLowerCase().trim();
                if (!groups[signature]) {
                    groups[signature] = { id: signature, items: [], reason: "DOI Match" };
                }
                groups[signature].items.push(item);
            }

            // Tier 2: Title + Year + First Author
            // Only check this if no DOI match found? Or check all?
            // Typically we want to find all duplicates.
            // If an item matches by DOI, it is a duplicate.
            // If it matches by Title, it is also a duplicate.
            // We need a strategy to merge groups. 
            // For now, let's treat DOI groups and Title groups separately or prioritized.
            // Simpler: Just put in one map. But an item can belong to multiple signatures?
            // Yes. This gets complex.
            // Simplified approach: Iterate tiers. If Tier 1 matches, group it. 
            // If an item is already grouped, should we check Tier 2?
            // Maybe yes, to find *more* duplicates that lack DOI.

            // Implementation:
            // We will perform clustering.
            // But for this MVP, let's just do independent checks and merge later or just prioritized.
            // Let's stick to signatures.

            const title = item.getField("title") as string;
            const date = item.getField("date") as string;
            const year = date ? date.substring(0, 4) : "";
            const creators = item.getCreators();
            const firstAuthor = creators.length > 0 ? creators[0].lastName.toLowerCase() : "";

            if (title && year && firstAuthor) {
                const normTitle = title.toLowerCase().replace(/[^\w\s]/g, "").trim();
                const signature = "meta:" + normTitle + ":" + year + ":" + firstAuthor;
                if (!groups[signature]) {
                    groups[signature] = { id: signature, items: [], reason: "Title+Year+Author Match" };
                }
                groups[signature].items.push(item);
            }
        }

        // Filter out singletons
        const result: DuplicateGroup[] = [];
        const itemSeen = new Set<string>();

        // Prioritize DOI groups
        // This is a naive clustering. Real dup detection needs disjoint set or graph.
        // But for now, we just return groups. If an item is in multiple groups, it might appear twice.
        // We should probably merge overlapping groups.

        // Let's just return groups with > 1 item, and let the UI handle it or just filter unique sets.

        Object.values(groups).forEach(g => {
            if (g.items.length > 1) {
                // Check if we already processed these items?
                // Optional: Merge groups that share items.
                // For now, raw groups.
                result.push(g);
            }
        });

        return result;
    }
}
