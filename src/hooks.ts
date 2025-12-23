import { Deduplicator } from "./modules/deduplicator";
import { initLocale } from "./utils/locale";
import { createZToolkit } from "./utils/ztoolkit";

async function onStartup() {
  Zotero.debug("[ZoteroCollectionsDeduplicator] onStartup called");

  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);

  Zotero.debug("[ZoteroCollectionsDeduplicator] Zotero ready, initializing locale");
  initLocale();

  // Register settings or other startup tasks here

  Zotero.debug("[ZoteroCollectionsDeduplicator] Loading main windows");
  await Promise.all(
    Zotero.getMainWindows().map((win) => onMainWindowLoad(win)),
  );

  addon.data.initialized = true;
  Zotero.debug("[ZoteroCollectionsDeduplicator] Initialization complete");
}

async function onMainWindowLoad(win: _ZoteroTypes.MainWindow): Promise<void> {
  Zotero.debug("[ZoteroCollectionsDeduplicator] onMainWindowLoad called");
  addon.data.ztoolkit = createZToolkit();

  // Register Menus
  Zotero.debug("[ZoteroCollectionsDeduplicator] Calling Deduplicator.register");
  Deduplicator.register(win);
  Zotero.debug("[ZoteroCollectionsDeduplicator] onMainWindowLoad complete");
}

async function onMainWindowUnload(win: Window): Promise<void> {
  ztoolkit.unregisterAll();
}

function onShutdown(): void {
  ztoolkit.unregisterAll();
  addon.data.alive = false;
  // @ts-expect-error - Plugin instance is not typed
  delete Zotero[addon.data.config.addonInstance];
}

async function onNotify(
  event: string,
  type: string,
  ids: Array<string | number>,
  extraData: { [key: string]: any },
) {
  // ztoolkit.log("notify", event, type, ids, extraData);
}

async function onPrefsEvent(type: string, data: { [key: string]: any }) {
  // Handle pref events
}

async function onDeduplicate() {
  Zotero.debug("[ZoteroCollectionsDeduplicator] onDeduplicate hook called");
  await Deduplicator.deduplicate();
}

export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onNotify,
  onPrefsEvent,
  onDeduplicate,
};

