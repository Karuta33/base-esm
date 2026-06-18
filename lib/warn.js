// Helper warn bersama: dipakai command /warn, antispam stiker, antilink,
// dan antitagsw. Tujuannya agar semua fitur memberi warn dengan sistem yang
// SAMA PERSIS seperti command /warn (counter, batas, lalu kick otomatis).

/**
 * Ambil/inisialisasi data warn sebuah grup pada global.db.
 * @param {string} groupId
 * @returns {{warn: Object, warnLimit: number}}
 */
function getGroupWarnData(groupId) {
  if (!global.db.group[groupId]) global.db.group[groupId] = {};
  if (!global.db.group[groupId].warn) global.db.group[groupId].warn = {};
  if (!global.db.group[groupId].warnLimit)
    global.db.group[groupId].warnLimit = 3;
  return global.db.group[groupId];
}

/**
 * Beri satu warn ke user. Jika warn mencapai/melewati batas grup, user akan
 * dikick otomatis dan warn-nya direset (identik dgn perilaku command /warn).
 *
 * @param {import("@whiskeysockets/baileys").WASocket} karr
 * @param {string} from   - JID grup
 * @param {string} target - JID user yang diberi warn (@s.whatsapp.net)
 * @param {string} reason - Alasan warn
 * @param {object|null} msg - Pesan untuk di-quote (boleh null)
 * @param {{header?: string}} [opts] - header opsional di atas teks warn
 * @returns {Promise<{kicked: boolean, count: number, warnLimit: number}>}
 */
async function applyWarn(karr, from, target, reason, msg, opts = {}) {
  const groupData = getGroupWarnData(from);
  if (!groupData.warn[target])
    groupData.warn[target] = { count: 0, reasons: [] };

  groupData.warn[target].count += 1;
  groupData.warn[target].reasons.push(reason);

  const currentWarn = groupData.warn[target].count;
  const warnLimit = groupData.warnLimit;
  const tag = `@${target.split("@")[0]}`;
  const caption = opts.header
    ? `_${opts.header.replace(/[「」]/g, "").trim()}_\n`
    : "";
  const quoted = msg ? { quoted: msg } : {};

  if (currentWarn >= warnLimit) {
    const teks =
      `${caption}🚫 *「 BATAS PERINGATAN 」*\n` +
      `\n` +
      `◦ *User* : ${tag}\n` +
      `◦ *Warn* : ${currentWarn}/${warnLimit}\n` +
      `◦ *Alasan* : ${reason}\n` +
      `\n` +
      `› User telah dikeluarkan dari grup secara otomatis.`;

    await karr.sendMessage(from, { text: teks, mentions: [target] }, quoted);
    try {
      await karr.groupParticipantsUpdate(from, [target], "remove");
    } catch (e) {
      console.error("[WARN] gagal kick:", e?.message || e);
    }

    // Reset warn setelah di-kick
    groupData.warn[target] = { count: 0, reasons: [] };
    return { kicked: true, count: currentWarn, warnLimit };
  }

  const teks =
    `${caption}⚠️ *「 PERINGATAN 」*\n` +
    `\n` +
    `◦ *User* : ${tag}\n` +
    `◦ *Warn* : ${currentWarn}/${warnLimit}\n` +
    `◦ *Alasan* : ${reason}\n` +
    `\n` +
    `› Sisa *${warnLimit - currentWarn}* peringatan lagi sebelum dikeluarkan otomatis.`;

  await karr.sendMessage(from, { text: teks, mentions: [target] }, quoted);
  return { kicked: false, count: currentWarn, warnLimit };
}

export { getGroupWarnData, applyWarn };
