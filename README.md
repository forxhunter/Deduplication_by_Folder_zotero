# Zotero Collections Deduplicator

A Zotero 7 plugin that finds and merges duplicates **only within a selected collection**.

Unlike the native "Duplicate Items" view which scans the entire library, this plugin allows you to focus on cleaning up specific collections one by one.

## Features

- **Collection-Specific Deduplication**: Right-click any collection to scan for duplicates inside it.
- **Advanced Matching**:
    - **DOI**: Exact match.
    - **Metadata**: Matches based on normalized Title, Year, and First Author.
- **Safe Merging**: uses Zotero's native merge functionality (keeps attachments, Notes, and links).
- **Review Dialog**: Review duplicate groups before merging.

## Installation

1. Go to the [Releases](../../releases) page  or download the `.xpi` file.
2. In Zotero 7, go to **Tools** -> **Plugins**.
3. Drag and drop `zotero-collections-deduplicator.xpi` into the window.
4. Restart Zotero.

## Usage

1. Select a collection in the left sidebar.
2. Right-click the collection and choose **Deduplicate Collection...**.
3. If duplicates are found, a window will appear listing them.
4. Click **Merge This Group** to merge items.



## Credits

Based on [zotero-plugin-template](https://github.com/windingwind/zotero-plugin-template).

Author: **forxhunter**
