import NodeCache from "node-cache";

// ─────────────────────────────────────────────────────────────────────────────
// Cache groupMetadata berbasis EVENT (event store) untuk mencegah rate-overlimit.
//
// Sumber utama overlimit: Baileys memanggil `groupMetadata(jid)` ke server WA
// pada SETIAP pengiriman pesan ke grup, kecuali socket diberi hook
// `cachedGroupMetadata`. Modul ini menyediakan hook tersebut + menjaga datanya
// tetap segar lewat event (groups.upsert / groups.update / group-participants.update)
// sehingga perubahan member/admin TIDAK perlu memanggil socket ulang.
//
// Fitur:
//  - cachedGroupMetadata : hook untuk makeWASocket (dipakai Baileys saat kirim)
//  - getGroupMetadata    : dipakai handler bot (cache → single-flight fetch)
//  - attach(sock)        : pasang listener event + method ke socket
//  - single-flight       : query identik yang barengan digabung jadi satu
//  - update in-place      : add/remove/promote/demote tanpa call socket
// ─────────────────────────────────────────────────────────────────────────────

// Ambil id murni dari entri participant (bisa string JID atau objek {id,...}).
function partId(p) {
  return typeof p === "string" ? p : p?.id;
}

export function createGroupMetaCache({
  ttlSeconds = 5 * 60, // 5 menit
  checkperiod = 120,
  // Store opsional (InMemoryStore). Bila diberikan, cache & store di-sinkronkan:
  // cache miss → coba store dulu sebelum call socket, dan setiap hasil fetch /
  // perubahan participant ditulis balik ke store.groupMetadata. Ini membuat
  // data grup tetap konsisten di kedua tempat tanpa call socket tambahan.
  store = null,
} = {}) {
  // useClones:false → jangan clone metadata grup yang besar tiap get (lebih ringan).
  const cache = new NodeCache({
    stdTTL: ttlSeconds,
    checkperiod,
    useClones: false,
  });

  // Tulis metadata ke store (kalau ada) supaya store & cache selalu sinkron.
  function syncToStore(jid, data) {
    if (store && jid && data && data.id) {
      try {
        store.setGroupMetadata(jid, data);
      } catch {}
    }
  }

  // Map<jid, Promise> untuk single-flight: cegah banyak query identik bersamaan.
  const inflight = new Map();

  // Cache kode invite grup (jarang berubah; hanya berubah saat di-revoke).
  // TTL panjang karena nilainya stabil — ini mencegah groupInviteCode dipanggil
  // berulang (sumber lain rate-overlimit pada fitur antilink).
  const inviteCache = new NodeCache({
    stdTTL: 60 * 60,
    checkperiod,
    useClones: false,
  });
  const inviteInflight = new Map();

  // Socket diisi belakangan via attach() (hook dibuat sebelum socket ada).
  let sock = null;

  // Query ke server, di-single-flight + simpan ke cache.
  function fetchMeta(jid) {
    if (inflight.has(jid)) return inflight.get(jid);
    const p = (async () => {
      const data = await sock.groupMetadata(jid);
      if (data && data.id) {
        cache.set(jid, data);
        syncToStore(jid, data); // tulis balik ke store agar konsisten
      }
      return data;
    })();
    inflight.set(jid, p);
    // Bersihkan entri inflight apa pun hasilnya. .catch kosong mencegah
    // "unhandled rejection" dari rantai finally (error asli tetap di-handle
    // oleh pemanggil yang meng-await `p`).
    p.finally(() => {
      if (inflight.get(jid) === p) inflight.delete(jid);
    }).catch(() => {});
    return p;
  }

  // Dipakai kode bot. Urutan: cache → single-flight fetch → fallback cache lama.
  async function getGroupMetadata(jid) {
    if (!jid || !jid.endsWith("@g.us")) return undefined;
    const cached = cache.get(jid);
    if (cached) return cached;
    // Sebelum call socket, coba ambil dari store (hasil history-sync / event).
    // Hanya dipakai bila lengkap (punya participants) supaya handler tidak kosong.
    if (store) {
      const fromStore = store.getGroupMetadata(jid);
      if (
        fromStore &&
        Array.isArray(fromStore.participants) &&
        fromStore.participants.length
      ) {
        cache.set(jid, fromStore);
        return fromStore;
      }
    }
    try {
      return await fetchMeta(jid);
    } catch (e) {
      const stale = cache.get(jid); // mungkin sudah diisi proses lain saat menunggu
      if (stale) return stale;
      throw e;
    }
  }

  // Peek sinkron: hanya baca cache, tidak pernah call socket (untuk jalur ringan).
  function peekGroupMetadata(jid) {
    if (!jid) return undefined;
    return cache.get(jid);
  }

  // Kode invite grup, di-cache (single-flight). Dipakai antilink agar tidak
  // memanggil groupInviteCode ke server pada setiap pesan.
  async function getGroupInviteCode(jid) {
    if (!jid || !jid.endsWith("@g.us")) return undefined;
    const cached = inviteCache.get(jid);
    if (cached) return cached;
    if (inviteInflight.has(jid)) return inviteInflight.get(jid);
    const p = (async () => {
      const code = await sock.groupInviteCode(jid);
      if (code) inviteCache.set(jid, code);
      return code;
    })();
    inviteInflight.set(jid, p);
    p.finally(() => {
      if (inviteInflight.get(jid) === p) inviteInflight.delete(jid);
    }).catch(() => {});
    return p;
  }

  // Buang cache invite saat link grup di-revoke (dipanggil dari handler revoke).
  function invalidateInviteCode(jid) {
    if (jid) inviteCache.del(jid);
  }

  // Hook untuk Baileys saat mengirim ke grup. WAJIB cepat & tidak melempar:
  // - cache hit → 0 call socket
  // - cache miss → fetch sekali (di-single-flight), lalu hasil di-cache
  // - error → kembalikan undefined supaya Baileys fallback ke groupMetadata-nya.
  async function cachedGroupMetadata(jid) {
    try {
      return await getGroupMetadata(jid);
    } catch {
      return undefined;
    }
  }

  // Update participant di cache TANPA call socket (inti dari pendekatan event store).
  function mutateParticipants(id, parts, action) {
    const meta = cache.get(id);
    if (!meta || !Array.isArray(meta.participants)) return; // belum ter-cache → biarkan, di-fetch saat perlu
    const ids = new Set(parts.map(partId).filter(Boolean));
    if (!ids.size) return;

    if (action === "add") {
      for (const p of parts) {
        const pid = partId(p);
        if (!pid) continue;
        if (!meta.participants.some((x) => x.id === pid)) {
          meta.participants.push(
            typeof p === "string"
              ? { id: pid, admin: null }
              : { admin: null, ...p },
          );
        }
      }
    } else if (action === "remove") {
      meta.participants = meta.participants.filter((x) => !ids.has(x.id));
    } else if (action === "promote" || action === "demote") {
      const admin = action === "promote" ? "admin" : null;
      for (const x of meta.participants) if (ids.has(x.id)) x.admin = admin;
    } else {
      return;
    }
    cache.set(id, meta); // refresh TTL setelah perubahan
    syncToStore(id, meta); // jaga store tetap sinkron dengan cache
  }

  // Pasang ke socket: simpan referensi, daftarkan listener event, tempel method.
  function attach(s) {
    sock = s;
    s.getGroupMetadata = getGroupMetadata;
    s.peekGroupMetadata = peekGroupMetadata;
    s.getGroupInviteCode = getGroupInviteCode;
    s.invalidateInviteCode = invalidateInviteCode;

    // Snapshot penuh dari history-sync / fetch all participating → isi cache.
    s.ev.on("groups.upsert", (groups) => {
      if (!Array.isArray(groups)) return;
      for (const g of groups)
        if (g && g.id) {
          cache.set(g.id, g);
          syncToStore(g.id, g);
        }
    });

    // Perubahan metadata (subject, desc, dll) → merge ke cache yang ada.
    s.ev.on("groups.update", (updates) => {
      if (!Array.isArray(updates)) return;
      for (const u of updates) {
        if (!u || !u.id) continue;
        const prev = cache.get(u.id);
        if (prev) {
          const merged = { ...prev, ...u };
          cache.set(u.id, merged);
          syncToStore(u.id, merged);
        }
      }
    });

    // Member join/leave/promote/demote → update di tempat, tanpa refetch socket.
    s.ev.on("group-participants.update", (ev) => {
      try {
        if (ev && ev.id)
          mutateParticipants(ev.id, ev.participants || [], ev.action);
      } catch {}
    });

    return s;
  }

  return {
    cachedGroupMetadata,
    getGroupMetadata,
    peekGroupMetadata,
    getGroupInviteCode,
    invalidateInviteCode,
    attach,
    _cache: cache,
  };
}
