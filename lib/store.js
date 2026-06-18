import fs from "fs";
import events from "events";
import pino from "pino";

class InMemoryStore extends events.EventEmitter {
  constructor(options = {}) {
    super();
    /** Stores all contacts indexed by their ID. @type {Object} */
    this.contacts = {};
    /** Stores all chats indexed by their ID. @type {Object} */
    this.chats = {};
    /** Stores all messages, grouped by chat ID, then message ID. @type {Object} */
    this.messages = {};
    /** Stores presence information for each chat and participant. @type {Object} */
    this.presences = {};
    /** Stores metadata for each group. @type {Object} */
    this.groupMetadata = {};
    /** Stores call offer information by peer JID. @type {Object} */
    this.callOffer = {};
    /** Stores sticker packs by pack ID. @type {Object} */
    this.stickerPacks = {};
    /** Stores authentication state. @type {Object} */
    this.authState = {};
    /** Tracks which chats have completed history sync. @type {Object} */
    this.syncedHistory = {};
    /**
     * Maximum number of messages stored per chat.
     * Prevents uncontrolled memory growth in long-running bots.
     * @type {number}
     */
    this.maxMessagesPerChat = options.maxMessagesPerChat || 500;
    /** Logger instance for debugging and info. */
    this.logger = options.logger || pino({ level: "silent" });
    /**
     * Bound event listeners for safe unbinding (prevents duplicate listeners
     * and memory leaks when re-binding the same emitter on reconnect).
     * @type {Array<{event: string, listener: Function}>}
     */
    this._boundEvents = [];
    /** Path used by auto-persist; null disables it. @type {string|null} */
    this._filePath = options.filePath || null;
    /** node timer handle for auto-persist. */
    this._saveTimer = null;
  }

  // --- Internal helpers ---------------------------------------------------

  /** Resolve the chat ID a message belongs to, regardless of LID/classic. */
  _chatIdOf(message) {
    return message?.key?.remoteJid || message?.key?.remoteJidAlt || null;
  }

  /** Numeric timestamp from a message (seconds), tolerant of Long objects. */
  _tsOf(message) {
    const t = message?.messageTimestamp;
    if (t == null) return 0;
    if (typeof t === "number") return t;
    if (typeof t === "object" && typeof t.toNumber === "function")
      return t.toNumber();
    const n = Number(t);
    return Number.isFinite(n) ? n : 0;
  }

  // --- Lifecycle ----------------------------------------------------------

  /**
   * Unbinds all previously bound events from an external emitter.
   * @param {EventEmitter} ev - The event emitter to unbind from.
   */
  unbind(ev) {
    if (!ev?.removeListener || !this._boundEvents.length) return;
    for (const { event, listener } of this._boundEvents) {
      ev.removeListener(event, listener);
    }
    this._boundEvents = [];
  }

  /**
   * Loads the entire store state from a plain object.
   * @param {Object} state - The state object to load into memory.
   */
  load(state = {}) {
    try {
      this.contacts = state.contacts || {};
      this.chats = state.chats || {};
      this.messages = state.messages || {};
      this.presences = state.presences || {};
      this.groupMetadata = state.groupMetadata || {};
      this.callOffer = state.callOffer || {};
      this.stickerPacks = state.stickerPacks || {};
      this.authState = state.authState || {};
      this.syncedHistory = state.syncedHistory || {};
      this.logger.info("Store loaded");
    } catch (e) {
      this.logger.error("Failed to load store: " + e.message);
    }
  }

  /**
   * Saves the current store state to a plain object.
   * @returns {Object} The current state of the store.
   */
  save() {
    try {
      return {
        contacts: this.contacts,
        chats: this.chats,
        messages: this.messages,
        presences: this.presences,
        groupMetadata: this.groupMetadata,
        callOffer: this.callOffer,
        stickerPacks: this.stickerPacks,
        authState: this.authState,
        syncedHistory: this.syncedHistory,
      };
    } catch (e) {
      this.logger.error("Failed to save store: " + e.message);
      return {};
    }
  }

  /**
   * Persists the lightweight, durable parts of the store to disk as JSON.
   * Messages and presences are intentionally excluded: they are ephemeral and
   * would bloat the file. Chats, contacts and group metadata are what survive
   * restarts (and are what features like broadcast actually need).
   * @param {string} [filePath] - Target path. Falls back to options.filePath.
   */
  writeToFile(filePath = this._filePath) {
    if (!filePath) return;
    try {
      const data = {
        chats: this.chats,
        contacts: this.contacts,
        groupMetadata: this.groupMetadata,
        syncedHistory: this.syncedHistory,
      };
      const tmp = filePath + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(data));
      fs.renameSync(tmp, filePath); // atomic swap, avoids partial writes
    } catch (e) {
      this.logger.error("Store writeToFile failed: " + e.message);
    }
  }

  /**
   * Restores chats/contacts/groupMetadata from a JSON file written by
   * writeToFile. Safe to call on a missing or corrupt file (no-op).
   * @param {string} [filePath] - Source path. Falls back to options.filePath.
   */
  readFromFile(filePath = this._filePath) {
    if (!filePath) return;
    try {
      if (!fs.existsSync(filePath)) return;
      const raw = fs.readFileSync(filePath, "utf-8");
      if (!raw.trim()) return;
      const data = JSON.parse(raw);
      this.chats = { ...data.chats, ...this.chats };
      this.contacts = { ...data.contacts, ...this.contacts };
      this.groupMetadata = { ...data.groupMetadata, ...this.groupMetadata };
      this.syncedHistory = { ...data.syncedHistory, ...this.syncedHistory };
      this.logger.info("Store restored from file");
    } catch (e) {
      this.logger.error("Store readFromFile failed: " + e.message);
    }
  }

  /**
   * Enables periodic auto-persist to disk. Loads any existing file first.
   * @param {string} filePath - Where to read/write the JSON snapshot.
   * @param {number} [intervalMs=10000] - How often to flush to disk.
   */
  startAutoSave(filePath, intervalMs = 10_000) {
    this._filePath = filePath;
    this.readFromFile(filePath);
    if (this._saveTimer) clearInterval(this._saveTimer);
    this._saveTimer = setInterval(() => this.writeToFile(filePath), intervalMs);
    if (this._saveTimer.unref) this._saveTimer.unref();
  }

  /** Stops auto-persist and flushes a final snapshot. */
  stopAutoSave() {
    if (this._saveTimer) {
      clearInterval(this._saveTimer);
      this._saveTimer = null;
    }
    this.writeToFile();
  }

  /** Clears all state in the store, resetting all collections. */
  clear() {
    this.contacts = {};
    this.chats = {};
    this.messages = {};
    this.presences = {};
    this.groupMetadata = {};
    this.callOffer = {};
    this.stickerPacks = {};
    this.authState = {};
    this.syncedHistory = {};
    this.logger.info("Store cleared");
  }

  // --- Contacts -----------------------------------------------------------

  setContacts(contacts = {}) {
    if (typeof contacts !== "object" || contacts === null) return;
    // Baileys may emit an array (contacts.set) OR a keyed object. Normalize.
    if (Array.isArray(contacts)) {
      for (const c of contacts) this.upsertContact(c);
      return;
    }
    this.contacts = { ...this.contacts, ...contacts };
    this.emit("contacts.set", contacts);
  }

  upsertContact(contact = {}) {
    if (!contact?.id) return;
    this.contacts[contact.id] = { ...this.contacts[contact.id], ...contact };
    this.emit("contacts.upsert", [contact]);
  }

  updateContact(update = []) {
    if (!Array.isArray(update)) return;
    for (const contact of update) {
      if (!contact?.id) continue;
      this.contacts[contact.id] = {
        ...this.contacts[contact.id],
        ...contact,
      };
      this.emit("contacts.update", [contact]);
    }
  }

  deleteContact(ids = []) {
    if (!Array.isArray(ids)) return;
    for (const id of ids) delete this.contacts[id];
    this.emit("contacts.delete", ids);
  }

  // --- Chats --------------------------------------------------------------

  setChats(chats = {}) {
    if (typeof chats !== "object" || chats === null) return;
    if (Array.isArray(chats)) {
      for (const c of chats) this.upsertChat(c);
      return;
    }
    this.chats = { ...this.chats, ...chats };
    this.emit("chats.set", chats);
  }

  upsertChat(chat = {}) {
    if (!chat?.id) return;
    this.chats[chat.id] = { ...this.chats[chat.id], ...chat };
    this.emit("chats.upsert", [chat]);
  }

  updateChat(update = []) {
    if (!Array.isArray(update)) return;
    for (const chat of update) {
      if (!chat?.id) continue;
      // Upsert semantics: in Baileys 7 a chats.update can be the first time we
      // ever see a chat, so create it instead of silently dropping it.
      this.chats[chat.id] = { ...this.chats[chat.id], ...chat };
      this.emit("chats.update", [chat]);
    }
  }

  deleteChat(ids = []) {
    if (!Array.isArray(ids)) return;
    for (const id of ids) delete this.chats[id];
    this.emit("chats.delete", ids);
  }

  /**
   * Returns chats as an array, newest first.
   * @returns {Array} Sorted chat objects.
   */
  getAllChats() {
    return Object.values(this.chats).sort(
      (a, b) =>
        (Number(b?.conversationTimestamp) || 0) -
        (Number(a?.conversationTimestamp) || 0),
    );
  }

  /**
   * IDs of personal (non-group) chats, i.e. people who have chatted.
   * @returns {string[]}
   */
  getPrivateChatIds() {
    return Object.keys(this.chats).filter(
      (jid) =>
        jid &&
        jid.endsWith("@s.whatsapp.net") &&
        !jid.endsWith("@g.us") &&
        !jid.endsWith("@broadcast") &&
        !jid.includes("status"),
    );
  }

  /** IDs of group chats the bot knows about. @returns {string[]} */
  getGroupChatIds() {
    return Object.keys(this.chats).filter((jid) => jid?.endsWith("@g.us"));
  }

  // --- Messages -----------------------------------------------------------

  setMessages(chatId, messages = []) {
    if (!chatId || !Array.isArray(messages)) return;
    this.messages[chatId] = messages.reduce((acc, msg) => {
      if (msg?.key?.id) acc[msg.key.id] = msg;
      return acc;
    }, {});
    this.emit("messages.set", { chatId, messages });
  }

  upsertMessage(message = {}, type = "append") {
    const chatId = this._chatIdOf(message);
    if (!chatId || !message?.key?.id) return;
    if (!this.messages[chatId]) this.messages[chatId] = {};
    const existingMessage = this.messages[chatId][message.key.id];
    this.messages[chatId][message.key.id] = {
      ...existingMessage,
      ...message,
    };
    // Enforce per-chat cap to prevent memory overflow (drop oldest).
    const msgKeys = Object.keys(this.messages[chatId]);
    if (msgKeys.length > this.maxMessagesPerChat) {
      delete this.messages[chatId][msgKeys[0]];
    }
    this.emit("messages.upsert", { messages: [message], type });
  }

  /**
   * Records/refreshes a chat entry derived from message activity. This is what
   * makes `store.chats` reflect "anyone who has chatted", even when Baileys
   * does not emit an explicit chats.upsert for an incoming DM.
   * @param {Object} message - A WAMessage.
   */
  recordChatFromMessage(message) {
    const chatId = this._chatIdOf(message);
    if (!chatId || chatId === "status@broadcast") return;
    const ts = this._tsOf(message);
    const prev = this.chats[chatId];
    // Avoid spurious writes when we already have a newer timestamp.
    if (prev && Number(prev.conversationTimestamp) >= ts && ts !== 0) {
      this.chats[chatId] = { ...prev, id: chatId };
      return;
    }
    this.chats[chatId] = {
      ...prev,
      id: chatId,
      conversationTimestamp: ts || prev?.conversationTimestamp || 0,
    };
    // Capture the pushName as a lightweight contact entry too.
    if (
      message?.pushName &&
      !message?.key?.fromMe &&
      chatId.endsWith("@s.whatsapp.net")
    ) {
      this.contacts[chatId] = {
        ...this.contacts[chatId],
        id: chatId,
        name: this.contacts[chatId]?.name || message.pushName,
        notify: message.pushName,
      };
    }
  }

  updateMessage(updates = []) {
    if (!Array.isArray(updates)) return;
    for (const update of updates) {
      const chatId = update?.key?.remoteJid;
      const msgId = update?.key?.id;
      if (chatId && msgId && this.messages[chatId]?.[msgId]) {
        this.messages[chatId][msgId] = {
          ...this.messages[chatId][msgId],
          ...update,
        };
        this.emit("messages.update", [update]);
      }
    }
  }

  deleteMessage(keys = []) {
    if (!Array.isArray(keys)) return;
    for (const key of keys) {
      const chatId = key?.remoteJid;
      const msgId = key?.id;
      if (chatId && msgId && this.messages[chatId]?.[msgId]) {
        delete this.messages[chatId][msgId];
        this.emit("messages.delete", [key]);
      }
    }
  }

  /**
   * Loads a specific message by chat ID and message ID.
   * Extra trailing args (e.g. a socket) are accepted and ignored for
   * compatibility with existing callers.
   * @param {string} jid - The chat ID.
   * @param {string} id - The message ID.
   * @returns {Object|undefined}
   */
  loadMessage(jid, id) {
    if (!jid || !id) return undefined;
    return this.messages[jid]?.[id];
  }

  // --- Presences ----------------------------------------------------------

  setPresence(chatId, presence = {}) {
    if (!chatId || !presence?.participant) return;
    if (!this.presences[chatId]) this.presences[chatId] = {};
    this.presences[chatId][presence.participant] = presence;
    this.emit("presence.set", { chatId, presence });
  }

  /**
   * Handles Baileys' actual presence.update payload:
   *   { id, presences: { [participant]: PresenceData } }
   * (the previous implementation expected a singular `presence`, so
   * store.presences stayed empty and `listadmin` crashed).
   * @param {string} chatId
   * @param {Object} presences - Map of participant -> presence data.
   */
  updatePresence(chatId, presences = {}) {
    if (!chatId || typeof presences !== "object" || presences === null) return;
    if (!this.presences[chatId]) this.presences[chatId] = {};
    for (const [participant, data] of Object.entries(presences)) {
      this.presences[chatId][participant] = {
        ...this.presences[chatId][participant],
        ...data,
      };
    }
    this.emit("presence.update", { id: chatId, presences });
  }

  /**
   * Safe accessor for a chat's presence map (never throws).
   * @param {string} chatId
   * @returns {Object} participant -> presence data (empty if unknown).
   */
  getPresences(chatId) {
    return this.presences[chatId] || {};
  }

  // --- Group Metadata -----------------------------------------------------

  setGroupMetadata(groupId, metadata = {}) {
    if (!groupId) return;
    this.groupMetadata[groupId] = metadata;
    this.emit("groups.update", [{ id: groupId, ...metadata }]);
  }

  updateGroupMetadata(update = []) {
    if (!Array.isArray(update)) return;
    for (const data of update) {
      if (!data?.id) continue;
      this.groupMetadata[data.id] = {
        ...this.groupMetadata[data.id],
        ...data,
      };
      this.emit("groups.update", [data]);
    }
  }

  /** Returns cached group metadata or undefined. @param {string} groupId */
  getGroupMetadata(groupId) {
    return this.groupMetadata[groupId];
  }

  // --- Call Offer ---------------------------------------------------------

  setCallOffer(peerJid, offer = {}) {
    if (!peerJid) return;
    this.callOffer[peerJid] = offer;
    this.emit("call", [{ peerJid, ...offer }]);
  }

  clearCallOffer(peerJid) {
    if (!peerJid) return;
    delete this.callOffer[peerJid];
    this.emit("call.update", [{ peerJid, state: "ENDED" }]);
  }

  // --- Sticker Packs ------------------------------------------------------

  setStickerPacks(packs = []) {
    if (!Array.isArray(packs)) return;
    this.stickerPacks = packs.reduce((acc, pack) => {
      if (pack?.id) acc[pack.id] = pack;
      return acc;
    }, {});
    this.emit("sticker-packs.set", packs);
  }

  upsertStickerPack(pack = {}) {
    if (!pack?.id) return;
    this.stickerPacks[pack.id] = { ...this.stickerPacks[pack.id], ...pack };
    this.emit("sticker-packs.upsert", [pack]);
  }

  // --- Auth State ---------------------------------------------------------

  setAuthState(state = {}) {
    this.authState = state;
  }

  getAuthState() {
    return this.authState;
  }

  // --- Synced History -----------------------------------------------------

  markHistorySynced(jid) {
    if (!jid) return;
    this.syncedHistory[jid] = true;
  }

  isHistorySynced(jid) {
    if (!jid) return false;
    return !!this.syncedHistory[jid];
  }

  // --- Binding ------------------------------------------------------------

  /**
   * Binds all relevant Baileys events to the store. Idempotent: calling it
   * again (e.g. on reconnect) unbinds the previous listeners first so we never
   * stack duplicates.
   * @param {EventEmitter} ev - The socket event emitter.
   */
  bind(ev) {
    if (!ev?.on) throw new Error("Event emitter is required for binding");

    // Re-binding safety: drop any listeners we attached to a prior socket.
    this.unbind(ev);

    const bindEvent = (event, listener) => {
      ev.on(event, listener);
      this._boundEvents.push({ event, listener });
    };

    // The single source of truth for history in Baileys >= 6.5: chats,
    // contacts and messages all arrive here. The legacy *.set events below are
    // kept for older forks but no longer fire on this version.
    bindEvent(
      "messaging-history.set",
      ({ chats, contacts, messages, isLatest }) => {
        if (Array.isArray(contacts))
          for (const c of contacts) this.upsertContact(c);
        if (Array.isArray(chats)) for (const c of chats) this.upsertChat(c);
        if (Array.isArray(messages))
          for (const m of messages) {
            this.upsertMessage(m, "history");
            this.recordChatFromMessage(m);
          }
        this.logger.info(
          `History sync: ${Array.isArray(chats) ? chats.length : 0} chats, ` +
            `${Array.isArray(contacts) ? contacts.length : 0} contacts` +
            (isLatest ? " (latest)" : ""),
        );
      },
    );

    // Legacy bulk-set events (no-op on current Baileys, harmless to keep).
    bindEvent("contacts.set", (c) => this.setContacts(c));
    bindEvent("chats.set", (c) => this.setChats(c));
    bindEvent("messages.set", ({ messages, jid }) =>
      this.setMessages(jid, messages),
    );

    bindEvent(
      "contacts.upsert",
      (contacts) =>
        Array.isArray(contacts) &&
        contacts.forEach((c) => this.upsertContact(c)),
    );
    bindEvent("contacts.update", (data) => this.updateContact(data));
    bindEvent("contacts.delete", (ids) => this.deleteContact(ids));

    bindEvent(
      "chats.upsert",
      (chats) =>
        Array.isArray(chats) && chats.forEach((c) => this.upsertChat(c)),
    );
    bindEvent("chats.update", (data) => this.updateChat(data));
    bindEvent("chats.delete", (ids) => this.deleteChat(ids));

    bindEvent("messages.upsert", ({ messages, type }) => {
      if (!Array.isArray(messages)) return;
      for (const msg of messages) {
        this.upsertMessage(msg, type);
        // Synthesize/refresh the chat entry so any active conversation shows
        // up in store.chats even without an explicit chats.upsert.
        this.recordChatFromMessage(msg);
      }
    });
    bindEvent("messages.update", (updates) => this.updateMessage(updates));
    bindEvent("messages.delete", (item) => {
      // Baileys emits either an array of keys or { jid, all: true }.
      if (Array.isArray(item)) this.deleteMessage(item);
      else if (item?.keys) this.deleteMessage(item.keys);
      else if (item?.jid && item?.all) this.messages[item.jid] = {};
    });

    // Baileys payload: { id, presences: { [participant]: PresenceData } }.
    bindEvent("presence.update", ({ id, presences }) =>
      this.updatePresence(id, presences),
    );

    bindEvent("groups.update", (data) => this.updateGroupMetadata(data));
    bindEvent(
      "groups.upsert",
      (groups) =>
        Array.isArray(groups) &&
        groups.forEach((g) => this.setGroupMetadata(g.id, g)),
    );

    bindEvent("call", (calls) => {
      if (!Array.isArray(calls)) return;
      for (const call of calls) {
        if (call.offer) this.setCallOffer(call.peerJid || call.from, call);
        else if (call.status === "terminate" || call.state === "ENDED")
          this.clearCallOffer(call.peerJid || call.from);
      }
    });

    bindEvent("sticker-packs.set", (packs) => this.setStickerPacks(packs));
    bindEvent(
      "sticker-packs.upsert",
      (packs) =>
        Array.isArray(packs) && packs.forEach((p) => this.upsertStickerPack(p)),
    );

    bindEvent("auth-state.update", (state) => this.setAuthState(state));
    bindEvent("history-sync.completed", (jid) => this.markHistorySynced(jid));
  }
}

export function makeInMemoryStore(options) {
  return new InMemoryStore(options);
}
