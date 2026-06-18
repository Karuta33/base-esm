import {
  BufferJSON,
  fetchLatestBaileysVersion,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  delay,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getDevice,
  getContentType,
  downloadContentFromMessage,
} from "@whiskeysockets/baileys";

import { color, bgcolor } from "../lib/color.js";
import fs from "fs";
import ms from "parse-ms";
import axios from "axios";
import * as cheerio from "cheerio";
import crypto from "crypto";
import toMs from "ms";
import { Jimp } from "jimp";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import logg from "pino";
import moment from "moment-timezone";
import util from "util";
import yts from "yt-search";
import * as mathjs from "mathjs";
import { inspect } from "util";
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import { pathToFileURL } from "url";
import fetch from "node-fetch";
import { exec, spawn } from "child_process";
import { format } from "util";
import chalk from "chalk";
import cp from "child_process";
import speed from "performance-now";
import { promisify } from "util";
import setting from "../lib/settings.json" with { type: "json" };
import mess from "../lib/response.json" with { type: "json" };
const { ownerNumber, prefix: defaultPrefix } = setting;
//// IMPORT LIB
import {
  ndown,
  instagram,
  tikdown,
  ytdown,
  threads,
  twitterdown,
  fbdown2,
  GDLink,
  pintarest,
  capcut,
  likee,
  alldown,
  alldownV2,
  spotifySearch,
  soundcloudSearch,
  spotifyDl,
  soundcloud,
  terabox,
} from "../lib/downloader.js";
import {
  wxGpt,
  gemini,
  kompasNews,
  TikTokDL,
  SpotifyDL,
  SoundCloudDL,
  DownAll,
  AnichinList,
  AnichinEps,
  LK21List,
  SamehadaDetail,
  SamehadaChapter,
  ShinigamiDetail,
  ShinigamiChapter,
  WebtoonDetail,
  WebtoonChapter,
  UptodownDetail,
  GlintsFetch,
  KompasFetch,
  fetchUrl,
  AnichinSearch,
  BStationSearch,
  CapCutSearch,
  GlintsSearch,
  GSMArenaSearch,
  KompasSearch,
  LK21Search,
  Pinterest,
  PlayStoreSearch,
  SamehadaSearch,
  ShinigamiSearch,
  SoundCloudSearch,
  SpotifySearch,
  TrueCaller,
  UptodownSearch,
  WebtoonSearch,
  StickerSearch,
  igStalk,
  igViewer,
  Mbti16Personalities,
  Akinator,
  uploadToImgBB,
  ytmp3,
} from "../lib/ashema-api.js";
import {
  allsurah,
  getSurah,
  quranAudio,
  randomDoa,
  surah,
} from "../lib/alquran.js";
import { webp2mp4File } from "../lib/convert.js";
import { Button, AIRich } from "../lib/button.js";
import {
  serialize,
  getBuffer,
  fetchJson,
  fetchText,
  getRandom,
  pickRandom,
  getGroupAdmins,
  getGroupAdminsid,
  runtime,
  runtime2,
  sleep,
  makeid,
  makeid2,
  removeEmojis,
  calculate_age,
  bytesToSize,
  checkBandwidth,
} from "../lib/myfunc.js";

import {
  smsg,
  formatp,
  tanggal,
  formatDate,
  getTime,
  isUrl,
  clockString,
  jsonformat,
  parseMention,
  parseMention2,
  reSize,
  generateProfilePicture,
} from "../lib/otherfunc.js";
import { toUrl, resolveMedia } from "../lib/cdnwa.js";
import { applyWarn } from "../lib/warn.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database global di-load di main.js. Fallback bila ashema.js dijalankan mandiri.
if (!global.db)
  global.db = {
    database: {},
    game: {},
    settings: {},
    group: {},
    others: {},
    users: {},
    banned: {},
  };

// === Helper data grup (warn / mute / afk / jadwal) pada global.db ===
function getGroupAFK(groupId) {
  if (!global.db.group[groupId]) global.db.group[groupId] = {};
  if (!global.db.group[groupId].afk) global.db.group[groupId].afk = {};
  return global.db.group[groupId].afk;
}
function getGroupWarn(groupId) {
  if (!global.db.group[groupId]) global.db.group[groupId] = {};
  if (!global.db.group[groupId].warn) global.db.group[groupId].warn = {};
  if (!global.db.group[groupId].warnLimit)
    global.db.group[groupId].warnLimit = 3;
  return global.db.group[groupId];
}
function getGroupMute(groupId) {
  if (!global.db.group[groupId]) global.db.group[groupId] = {};
  if (!Array.isArray(global.db.group[groupId].mute))
    global.db.group[groupId].mute = [];
  return global.db.group[groupId].mute;
}
function getGroupSchedule(groupId) {
  if (!global.db.group[groupId]) global.db.group[groupId] = {};
  if (!global.db.group[groupId].schedule) {
    global.db.group[groupId].schedule = {
      open: { hour: null, minute: null, enabled: false },
      close: { hour: null, minute: null, enabled: false },
    };
  }
  return global.db.group[groupId].schedule;
}
// Ambil isi sebuah case (untuk command getcase). Mendukung label case dengan
// kutip ganda ("nama") maupun tunggal ('nama').
const getCase = (cases) => {
  const src = fs.readFileSync(__filename).toString();
  const sep = src.includes('"' + cases + '"')
    ? '"' + cases + '"'
    : "'" + cases + "'";
  return src.split(sep)[1].split("break")[0];
};

moment.tz.setDefault("Asia/Jakarta").locale("id");
const sesiaki = new Map();
const mbti = new Mbti16Personalities();
export default async (store, karr, msg, m, welcome = []) => {
  try {
    const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg;
    let isQuotedMsg;
    if (msg.quotedMsg !== null && msg.quotedMsg !== undefined) {
      isQuotedMsg = true;
    } else {
      isQuotedMsg = false;
    }
    const toJSON = (j) => JSON.stringify(j, null, "\t");
    const from = msg.key.remoteJid;
    var chats =
      type === "conversation" && msg.message.conversation
        ? msg.message.conversation
        : type === "imageMessage" && msg.message.imageMessage.caption
          ? msg.message.imageMessage.caption
          : type === "videoMessage" && msg.message.videoMessage.caption
            ? msg.message.videoMessage.caption
            : type === "extendedTextMessage" &&
                msg.message.extendedTextMessage.text
              ? msg.message.extendedTextMessage.text
              : type === "buttonsResponseMessage" &&
                  quotedMsg.fromMe &&
                  msg.message.buttonsResponseMessage.selectedButtonId
                ? msg.message.buttonsResponseMessage.selectedButtonId
                : msg.type == "templateButtonReplyMessage"
                  ? msg.message.templateButtonReplyMessage.selectedId
                  : type === "messageContextInfo"
                    ? msg.message.buttonsResponseMessage?.selectedButtonId ||
                      msg.message.listResponseMessage?.singleSelectReply
                        .selectedRowId
                    : type == "listResponseMessage" &&
                        quotedMsg.fromMe &&
                        msg.message.listResponseMessage.singleSelectReply
                          .selectedRowId
                      ? msg.message.listResponseMessage.singleSelectReply
                          .selectedRowId
                      : "";
    if (chats == undefined) {
      chats = "";
    }
    const args = chats.split(" ");
    const botNumber = karr.user.id.split(":")[0] + "@s.whatsapp.net";
    const command = chats.toLowerCase().split(" ")[0] || "";
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    const sender = isGroup
      ? msg.key.participantAlt
        ? msg.key.participantAlt
        : msg.participantAlt
      : msg.key.remoteJidAlt;
    const isOwner =
      ownerNumber == sender
        ? true
        : ["6285811597011@s.whatsapp.net"].includes(sender)
          ? true
          : false;
    const pushname = msg.pushName || "No Name";
    const groupMetadata = isGroup ? await karr.groupMetadata(from) : "";
    const groupName = isGroup ? groupMetadata.subject : "";
    const groupOwner = isGroup ? groupMetadata.subjectOwner : "";
    const groupId = isGroup ? groupMetadata.id : "";
    const groupMembers = isGroup ? groupMetadata.participants : "";
    const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : "";
    const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;
    const isGroupAdmins = groupAdmins.includes(sender);
    // Welcome/left grup (data dikirim by-reference dari main.js).
    const getPosiSaying = (f) => {
      let p = null;
      welcome.forEach((v, i) => {
        if (v.jid === f) p = i;
      });
      return p;
    };
    const isWelcome = welcome.some((v) => v.jid === from);
    // === Database & pengaturan grup/owner ===
    const db = global.db;
    const senderlid = isGroup
      ? msg.key.participant
        ? msg.key.participant
        : msg.participant
      : msg.key.remoteJid;
    if (isGroup && typeof db.group[from] !== "object") {
      db.group[from] = {
        nsfw: false,
        antilink: false,
        antiluar: false,
        antibot: false,
        antitagsw: false,
        antispamstc: false,
        autodl: false,
        mutebot: false,
      };
    }
    // Inisialisasi setting bot (onlyGc / autoclear / autobio dll).
    let karutaset = db.settings[botNumber];
    if (typeof karutaset !== "object") {
      db.settings[botNumber] = {
        status: 0,
        autobio: false,
        autobackup: false,
        autoclear: false,
        onlyGc: false,
      };
      karutaset = db.settings[botNumber];
    } else {
      if (!("autobio" in karutaset)) karutaset.autobio = false;
      if (!("autobackup" in karutaset)) karutaset.autobackup = false;
      if (!("autoclear" in karutaset)) karutaset.autoclear = false;
      if (!("onlyGc" in karutaset)) karutaset.onlyGc = false;
    }
    const isNsfw = isGroup ? db.group[from].nsfw : false;
    const isAntiLink = isGroup ? db.group[from].antilink : false;
    const isAntiTag = isGroup ? db.group[from].antitagsw : false;
    const isAntiSpamStc = isGroup ? db.group[from].antispamstc || false : false;
    const isMuteBot = isGroup ? db.group[from].mutebot || false : false;
    let prefix;
    if (karr.multi) {
      prefix = /^[°•π÷×¶∆£•²¢€¥®™✓_=|~!?#%^&.+-,\/\\©^]/.test(chats)
        ? chats.match(/^[°•π÷×¶∆£•²¢€¥®™✓_=|~!?#%^&.+-,\/\\©^]/gi)[0]
        : "#";
    } else {
      prefix = karr.nopref ? "" : defaultPrefix;
    }
    const body = chats.startsWith(prefix) ? chats : "";
    const q = chats.slice(command.length + 1, chats.length);
    const text = args.join(" ");
    const budy = chats.toLowerCase();
    const isCmd = chats.startsWith(prefix);
    const jam = moment.tz("asia/jakarta").format("HH:mm:ss");
    let dt = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a");
    const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1);
    const content = JSON.stringify(msg.message);
    ////FUNTION TANGGAL
    var buln = [
      "/01/",
      "/02/",
      "/03/",
      "/04/",
      "/05/",
      "/06/",
      "/07/",
      "/08/",
      "/09/",
      "/10/",
      "/11/",
      "/12/",
    ];
    var buln2 = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    var myHari = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    var tgel = new Date();
    var hri = tgel.getDate();
    var bulnh = tgel.getMonth();
    var thisHari = tgel.getDay(),
      thisDaye = myHari[thisHari];
    var yye = tgel.getYear();
    var syear = yye < 1000 ? yye + 1900 : yye;
    const jangwak = hri + "" + buln[bulnh] + "" + syear;
    const jangwak2 = syear + "" + buln[bulnh] + "" + hri;
    const janghar = thisDaye;
    if (fromMe) return;

    // --- Utility Functions ---
    const reply = (teks) => {
      return karr.sendMessage(
        from,
        {
          text: teks,
          mentions: parseMention(teks),
        },
        {
          quoted: msg,
          messageId: "KARUTA_" + makeid(9).toUpperCase(),
        },
      );
    };

    if (msg && !fromMe) {
      console.log(
        "->[\x1b[1;32mPESAN\x1b[1;37m]",
        color(
          moment(msg.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"),
          "yellow",
        ),
        color(`${chats} [${args.length}]`),
        "from",
        color(pushname),
        "in",
        color(groupName || "Private Chat"),
      );
    }

    const isImage = type == "imageMessage";
    const isVideo = type == "videoMessage";
    const isSticker = type == "stickerMessage";
    const isViewOnce = type == "viewOnceMessageV2";
    const isAudio = type == "audioMessage";
    const isQuotedImage = isQuotedMsg
      ? quotedMsg.type === "imageMessage"
        ? true
        : false
      : false;
    const isQuotedAudio = isQuotedMsg
      ? quotedMsg.type === "audioMessage"
        ? true
        : false
      : false;
    const isQuotedDocument = isQuotedMsg
      ? quotedMsg.type === "documentMessage"
        ? true
        : false
      : false;
    const isQuotedVideo = isQuotedMsg
      ? quotedMsg.type === "videoMessage"
        ? true
        : false
      : false;
    const isQuotedSticker = isQuotedMsg
      ? quotedMsg.type === "stickerMessage"
        ? true
        : false
      : false;
    const isQuotedViewOnce = isQuotedMsg
      ? quotedMsg.type === "viewOnceMessageV2"
        ? true
        : false
      : false;
    const mentionByTag =
      type == "extendedTextMessage" &&
      msg.message.extendedTextMessage.contextInfo != null
        ? msg.message.extendedTextMessage.contextInfo.mentionedJid
        : [];
    const mentionByReply =
      type == "extendedTextMessage" &&
      msg.message.extendedTextMessage.contextInfo != null
        ? msg.message.extendedTextMessage.contextInfo.participant || ""
        : "";
    const mention =
      typeof mentionByTag == "string" ? [mentionByTag] : mentionByTag;
    mention != undefined ? mention.push(mentionByReply) : [];
    const mentionUser = mention != undefined ? mention.filter((n) => n) : [];
    const wait = () => {
      karr.sendMessage(from, {
        react: {
          text: `⌛`,
          key: msg.key,
        },
      });
    };
    async function groupSatus(jid, content) {
      const inside = await generateWAMessageContent(content, {
        upload: karr.waUploadToServer,
      });
      const messageSecret = crypto.randomBytes(32);
      const mig = generateWAMessageFromContent(
        jid,
        {
          messageContextInfo: {
            messageSecret,
          },
          groupStatusMessageV2: {
            message: {
              ...inside,
              messageContextInfo: {
                messageSecret,
              },
            },
          },
        },
        {},
      );
      await karr.relayMessage(jid, mig.message, {
        messageId: mig.key.id,
      });
      return mig;
    }

    function mentions(teks, mems = [], id) {
      if (id == null || id == undefined || id == false) {
        let res = karr.sendMessage(from, {
          text: teks,
          mentions: mems,
        });
        return res;
      } else {
        let res = karr.sendMessage(
          from,
          {
            text: teks,
            mentions: mems,
          },
          {
            quoted: msg,
          },
        );
        return res;
      }
    }

    // ===== ENFORCEMENT PER-PESAN (sebelum switch) =====
    // onlyGc: bot hanya merespon di grup (owner tetap bebas di PM).
    if (db.settings?.[botNumber]?.onlyGc && !isGroup && !isOwner) return;

    // MUTE MEMBER: pesan dari member yang di-mute dihapus otomatis selama
    // bot admin. Admin grup & owner kebal.
    if (
      isGroup &&
      isBotGroupAdmins &&
      !fromMe &&
      !isGroupAdmins &&
      !isOwner &&
      getGroupMute(from).includes(senderlid)
    ) {
      try {
        await karr.sendMessage(from, {
          delete: {
            remoteJid: from,
            fromMe: false,
            id: msg.key.id,
            participant: msg.key.participant,
          },
        });
      } catch {}
      return;
    }

    // MUTEBOT: saat aktif, bot diam total untuk non-admin. Antilink tetap jalan.
    if (
      isGroup &&
      db.group[from]?.mutebot &&
      !isGroupAdmins &&
      !isOwner &&
      !fromMe
    ) {
      if (
        db.group[from]?.antilink &&
        isBotGroupAdmins &&
        typeof chats === "string" &&
        chats.includes("https://chat.whatsapp.com/")
      ) {
        try {
          const linkgce = await karr.groupInviteCode(from);
          if (!chats.includes(`https://chat.whatsapp.com/${linkgce}`)) {
            await karr.sendMessage(from, {
              delete: {
                remoteJid: from,
                fromMe: false,
                id: msg.key.id,
                participant: sender,
              },
            });
            await applyWarn(
              karr,
              from,
              sender,
              "Mengirim link grup lain",
              msg,
              { header: "GROUP LINK DETECTOR" },
            );
          }
        } catch {}
      }
      return;
    }

    // ANTILINK: hapus link grup lain dari non-admin + warn otomatis.
    if (
      isGroup &&
      isAntiLink &&
      isBotGroupAdmins &&
      !isGroupAdmins &&
      !isOwner &&
      !fromMe &&
      typeof chats === "string" &&
      chats.includes("https://chat.whatsapp.com/")
    ) {
      try {
        const linkgce = await karr.groupInviteCode(from);
        if (!chats.includes(`https://chat.whatsapp.com/${linkgce}`)) {
          await karr.sendMessage(from, {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: msg.key.id,
              participant: sender,
            },
          });
          await applyWarn(karr, from, sender, "Mengirim link grup lain", msg, {
            header: "GROUP LINK DETECTOR",
          });
          return;
        }
      } catch {}
    }

    // AFK: notifikasi saat user AFK di-tag, dan sambutan saat user AFK kembali.
    if (isGroup && !fromMe) {
      const groupAfk = getGroupAFK(from);
      const mentionUser1 = [
        ...new Set([
          ...(mentioned || []),
          ...(quotedMsg ? [quotedMsg.sender] : []),
        ]),
      ];
      for (const jid of mentionUser1) {
        const afkData = groupAfk[jid];
        if (!afkData || afkData.time < 0) continue;
        reply(
          `🌙 *Sedang AFK*\n\nSssttt! Orangnya sedang AFK, jangan di-tag dulu ya.\n\n• Alasan ╶ ${afkData.reason || "Tanpa alasan"}\n• Durasi ╶ ${clockString(new Date() - afkData.time)}`.trim(),
        );
      }
      const senderAfk = groupAfk[senderlid];
      if (senderAfk && senderAfk.time > -1) {
        reply(
          `👋 *Selamat Datang Kembali, @${sender.split("@")[0]}!*\n\n• Durasi AFK ╶ ${clockString(new Date() - senderAfk.time)}\n• Alasan ╶ ${senderAfk.reason || "Tanpa alasan"}`.trim(),
        );
        groupAfk[senderlid] = { time: -1, reason: "" };
      }
    }

    switch (command) {
      //// TARO CASE FITUR NYA DISINI ///
      //// MAIN COMMAND
      case prefix + "menu":
        {
          const inimenu = await import("./menu.js");
          inimenu.default(
            ucapanWaktu,
            janghar,
            jangwak,
            pushname,
            karr,
            from,
            prefix,
            msg,
          );
        }
        break;
      case prefix + "ping":
        {
          var timestamp = speed();
          var latensi = speed() - timestamp;
          reply(`*Pong!!*\nSpeed: ${latensi.toFixed(4)}s`);
        }
        break;
      case prefix + "speedtest":
        {
          let exec = promisify(cp.exec).bind(cp);
          let o;
          reply("Testing speed..");
          try {
            o = await exec("speedtest --share");
          } catch (e) {
            o = e;
          } finally {
            let { stdout, stderr } = o;
            let link = stdout.match(
              /https?:\/\/www\.speedtest\.net\/result\/\d+\.png/,
            )[0];
            if (stdout.trim()) reply(stdout);
            if (stderr.trim()) reply(stderr);
          }
        }
        break;
      case prefix + "sc":
      case prefix + "script":
        {
          let capt = `
*CATATAN PENGGUNAAN !!*
- Edit nomor owner di lib/setting.json
- Edit custom kode di lib/setting.json
- Pastikan versi NodeJS V20+
- Script ini 100% GRATIS

*TENTANH BOT INI*
- ✔️ | *Simple*
- ✔️ | *Multi Device* 
- ✔️ | *ESM  Code*
- ✔️ | *Case*
- ✔️ | *Baileys original Latest*
- ✔️ | *Thumbnail Message*
`;
          const btn = new Button()
            .setTitle("*ASHEMA ESM V1*")
            .setBody(capt)
            .setFooter("© Ashema Karuta")

            .addUrl("Ashema Script", "https://github.com/Karuta33/base-esm");
          await btn.run(from, karr, msg);
        }
        break;
      case prefix + "cpu":
      case prefix + "server":
      case prefix + "speed":
        {
          let timestamp = speed();
          let latensi = speed() - timestamp;
          exec(`neofetch --stdout`, (error, stdout, stderr, json) => {
            let child = stdout.toString("utf-8");
            let ssd = child.replace(/Memory:/, "Ram:");
            reply(
              `• *CPU:* ${ssd}*Kecepatan* : ${latensi.toFixed(4)} _ms_\n• *Memory:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem / 1024 / 1024)}MB\n• *OS:* ${os.version()}\n• *Platform:* ${os.platform()}\n• *Hostname:* ${os.hostname()}`,
            );
          });
        }
        break;
      case prefix + "ai":
        {
          if (!q) return reply("Masukan promt nya!");
          karr.sendPresenceUpdate("composing", from);
          try {
            let ai = await wxGpt(q);
            let capt = ai.data.result.replace(
              "欢迎使用 公益站! 站长合作邮箱：wxgpt@qq.com<br/>",
              " ",
            );
            reply(capt);
          } catch (err) {
            reply(`Request pending tunggu beberapa saat lagi..`);
          }
        }
        break;
      ///// FUN COMMAND
      case prefix + "akinator":
        {
          if (sesiaki.has(sender)) {
            return await karr.sendMessage(
              from,
              {
                text: `❌ Anda masih memiliki sesi permainan yang berjalan. Ketik *${prefix}akiend* untuk membatalkannya.`,
              },
              { quoted: msg },
            );
          }
          await karr.sendMessage(
            from,
            { text: "⏳ Menghubungkan ke Akinator... Pikirkan satu tokoh!" },
            { quoted: msg },
          );
          try {
            const aki = new Akinator({ region: "id", childMode: false });
            await aki.start();
            sesiaki.set(sender, aki);
            const menuTeks =
              `[ PERTANYAAN 1 ]\n\n${aki.question}\n\n` +
              `👉 Balas dengan nomor pilihan Anda:\n` +
              `*0* : Ya\n` +
              `*1* : Tidak\n` +
              `*2* : Saya Tidak Tahu\n` +
              `*3* : Mungkin\n` +
              `*4* : Mungkin Tidak\n\n` +
              `💡 Ketik *${prefix}akiend* untuk berhenti.`;

            await karr.sendMessage(from, { text: menuTeks }, { quoted: msg });
          } catch (err) {
            console.error(err);
            await karr.sendMessage(
              from,
              { text: "❌ Gagal memulai sesi Akinator. Silakan coba lagi." },
              { quoted: msg },
            );
          }
        }
        break;
      case prefix + "akiend":
        {
          if (!sesiaki.has(sender)) {
            return await karr.sendMessage(
              from,
              { text: "❌ Anda tidak sedang dalam sesi permainan." },
              { quoted: msg },
            );
          }
          sesiaki.delete(sender);
          return await karr.sendMessage(
            from,
            { text: "⏹️ Sesi permainan Akinator telah dihentikan." },
            { quoted: msg },
          );
        }
        break;
      case prefix + "tesmbti":
      case prefix + "tes-mbti":
        {
          if (mbti.hasSession(sender)) {
            return reply("Selesaikan dulu tes MBTI kamu yang sebelumnya!");
          }
          let capt = `*🧩 MBTI PERSONALITY TEST*

📜 CARA MENJAWAB:
Ketik angka 1 hingga 7 yang paling menggambarkan dirimu saat ini:

 1 ➔ Sangat Tidak Setuju
 2 ➔ Tidak Setuju
 3 ➔ Agak Tidak Setuju
 4 ➔ Netral
 5 ➔ Agak Setuju
 6 ➔ Setuju
 7 ➔ Sangat Setuju
 
Untuk menghentikan sesi pertanyaan ketik : *${prefix}mbtistop*

Sudah siap? Yuk, kita mulai pertanyaannya! 👇`;
          const btn = new Button()
            .setTitle(capt)
            .setFooter("© Ashema Community")
            .addReply("   MULAI TES NYA    ", prefix + "mbtistart");
          await btn.run(from, karr, msg);
        }
        break;
      case prefix + "mbtistart":
        {
          if (mbti.hasSession(sender)) {
            return reply("Selesaikan dulu tes MBTI kamu yang sebelumnya!");
          }
          await reply(
            `Memulai sesi tes MBTI...\nKamu akan di berikan 60 pertanyaan, jawablah setiap pertanyaan dengan jujur dan apa adanya (bukan berdasarkan apa yang orang lain harapkan darimu) agar hasilnya akurat!`,
          );
          await mbti.start(sender);
          reply(format(mbti.questionsTemplate[0]));
        }
        break;
      case prefix + "mbtistop":
        {
          if (!mbti.hasSession(sender)) {
            return reply("Kamu belum memulai sesi tes");
          }

          reply("⏹️ Sesi untuk tes mbti di hentikan");
          mbti.deleteSession(sender);
        }
        break;
      case prefix + "mbticareer":
        {
          if (!q) return;
          reply(q.replace(/<\/?p>/g, "\n"));
        }
        break;
      case prefix + "mbtirela": {
        if (!q) return;
        reply(q.replace(/<\/?p>/g, "\n"));
      }
      ///// CONVERTER MENU
      case prefix + "sticker":
      case prefix + "stiker":
      case prefix + "s":
        {
          var pname = setting.packname;
          var athor = setting.author;
          if (isImage || isQuotedImage) {
            wait();
            var media = await karr.downloadAndSaveMediaMessage(
              msg,
              "image",
              `./tmp/${sender}.jpeg`,
            );
            var opt = {
              packname: pname,
              author: athor,
            };
            karr
              .sendImageAsSticker(from, media, msg, opt)
              .then((res) => {
                fs.unlinkSync(media);
              })
              .catch((e) => reply("Error"));
          } else if (isVideo || isQuotedVideo) {
            wait();
            var media = await karr.downloadAndSaveMediaMessage(
              msg,
              "video",
              `./tmp/${sender}.jpeg`,
            );
            var opt = {
              packname: pname,
              author: athor,
            };
            karr
              .sendImageAsSticker(from, media, msg, opt)
              .then((res) => {
                fs.unlinkSync(media);
              })
              .catch((e) => reply("Error"));
          } else if (isQuotedSticker) {
            wait();
            var media =
              quotedMsg["stickerMessage"].isAnimated !== true
                ? await karr.downloadAndSaveMediaMessage(
                    msg,
                    "sticker",
                    `./tmp/${sender}.jpeg`,
                  )
                : await karr.downloadAndSaveMediaMessage(
                    msg,
                    "sticker",
                    `./tmp/${sender}.webp`,
                  );
            media =
              quotedMsg["stickerMessage"].isAnimated !== true
                ? media
                : (await webp2mp4File(media)).data;
            var opt = {
              packname: pname,
              author: athor,
            };
            quotedMsg["stickerMessage"].isAnimated !== true
              ? karr
                  .sendImageAsSticker(from, media, msg, opt)
                  .then((res) => {
                    fs.unlinkSync(media);
                  })
                  .catch((e) => reply("Error"))
              : karr
                  .sendVideoAsSticker(from, media, msg, opt)
                  .then((res) => {
                    fs.unlinkSync(`./tmp/${sender}.webp`);
                  })
                  .catch((e) => reply("Error"));
          } else {
            reply(
              `Kirim gambar/vidio dengan caption ${command} atau balas gambar/vidio yang sudah dikirim\nNote : Maximal vidio 10 detik!`,
            );
          }
        }
        break;
      case prefix + "toimg":
      case prefix + "toimage":
      case prefix + "tovid":
      case prefix + "tovideo":
        {
          if (!isQuotedSticker) return reply(`Reply stikernya!`);
          var stream = await downloadContentFromMessage(
            msg.message.extendedTextMessage?.contextInfo.quotedMessage
              .stickerMessage,
            "sticker",
          );
          var buffer = Buffer.from([]);
          for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
          }
          var rand1 = "tmp/" + getRandom(".webp");
          var rand2 = "tmp/" + getRandom(".png");
          fs.writeFileSync(`./${rand1}`, buffer);
          if (
            isQuotedSticker &&
            msg.message.extendedTextMessage.contextInfo.quotedMessage
              .stickerMessage.isAnimated !== true
          ) {
            exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
              fs.unlinkSync(`./${rand1}`);
              if (err) return reply("Error");
              karr.sendMessage(
                from,
                {
                  image: fs.readFileSync(`./${rand2}`),
                },
                {
                  quoted: msg,
                },
              );
              fs.unlinkSync(`./${rand2}`);
            });
          } else {
            webp2mp4File(`./${rand1}`).then(async (data) => {
              fs.unlinkSync(`./${rand1}`);
              karr.sendMessage(
                from,
                {
                  video: await getBuffer(data.data),
                },
                {
                  quoted: msg,
                },
              );
            });
          }
        }
        break;
      case prefix + "swm":
      case prefix + "wm":
        {
          var pname = q.split("|")[0] ? q.split("|")[0] : q;
          var athor = q.split("|")[1] ? q.split("|")[1] : "";
          if (isImage || isQuotedImage) {
            if (args.length < 2)
              return reply(`Penggunaan ${command} nama|author`);
            var media = await karr.downloadAndSaveMediaMessage(
              msg,
              "image",
              `./tmp/${sender}.jpeg`,
            );
            var opt = {
              packname: pname,
              author: athor,
            };
            karr
              .sendImageAsSticker(from, media, msg, opt)
              .then((res) => {
                fs.unlinkSync(media);
              })
              .catch((e) => reply(mess.error.api));
          } else if (isVideo || isQuotedVideo) {
            if (args.length < 2)
              return reply(`Penggunaan ${command} nama|author`);
            wait();
            var media = await karr.downloadAndSaveMediaMessage(
              msg,
              "video",
              `./tmp/${sender}.jpeg`,
            );
            var opt = {
              packname: pname,
              author: athor,
            };
            karr
              .sendImageAsSticker(from, media, msg, opt)
              .then((res) => {
                fs.unlinkSync(media);
              })
              .catch((e) => reply(mess.error.api));
          } else if (isQuotedSticker) {
            if (args.length < 2)
              return reply(`Penggunaan ${command} nama|author`);
            wait();
            var media =
              quotedMsg["stickerMessage"].isAnimated !== true
                ? await karr.downloadAndSaveMediaMessage(
                    msg,
                    "sticker",
                    `./tmp/${sender}.jpeg`,
                  )
                : await karr.downloadAndSaveMediaMessage(
                    msg,
                    "sticker",
                    `./tmp/${sender}.webp`,
                  );
            media =
              quotedMsg["stickerMessage"].isAnimated !== true
                ? media
                : (await webp2mp4File(media)).data;
            var opt = {
              packname: pname,
              author: athor,
            };
            quotedMsg["stickerMessage"].isAnimated !== true
              ? karr
                  .sendImageAsSticker(from, media, msg, opt)
                  .then((res) => {
                    fs.unlinkSync(media);
                  })
                  .catch((e) => reply(mess.error.api))
              : karr
                  .sendVideoAsSticker(from, media, msg, opt)
                  .then((res) => {
                    fs.unlinkSync(`./tmp/${sender}.webp`);
                  })
                  .catch((e) => reply(mess.error.api));
          } else {
            reply(
              `Kirim/Balas gambar/video/sticker dengan caption ${prefix}stickerwm nama|author atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`,
            );
          }
        }
        break;
      case prefix + "smeme":
      case prefix + "stikermeme":
      case prefix + "stickermeme":
      case prefix + "memestiker":
        {
          if (!q)
            return reply(
              `Masukan text contoh *#smeme Halo* Untuk satu text dan untuk membuat text atas dan bawah kalian bisa menggunakan *#smeme Hallo | Aku disini*`,
            );

          const opt = { packname: setting.packname, author: setting.author };

          let mediaPath, mediaType;

          if (isImage || isQuotedImage) {
            mediaType = "image";
            mediaPath = await karr.downloadAndSaveMediaMessage(
              msg,
              "image",
              `./tmp/${sender + Date.now()}.jpg`,
            );
          } else if (isQuotedSticker) {
            mediaType = "sticker";
            mediaPath = await karr.downloadAndSaveMediaMessage(
              msg,
              "sticker",
              `./tmp/${sender + Date.now()}.webp`,
            );
          } else {
            return reply(
              `Kirim Gambar atau balas Sticker dengan caption ${command} teks`,
            );
          }

          try {
            wait();
            const buffer = fs.readFileSync(mediaPath);
            const data = await uploadToImgBB(buffer, { expiration: "P1D" });

            if (!data?.image?.url)
              throw new Error("Upload gagal, url tidak ditemukan");
            const urls = data.image.url;

            let meme_url;
            if (q.includes("|")) {
              const atas = q.split("|")[0] || "-";
              const bawah = q.split("|")[1] || "";
              meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${urls}`;
            } else {
              meme_url = `https://api.memegen.link/images/custom/ /${encodeURIComponent(q)}.png?background=${urls}`;
            }

            await karr.sendImageAsSticker(from, meme_url, msg, opt);
          } catch (e) {
            console.error("[smeme]", e);
            reply(mess.error.api);
          } finally {
            if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
          }
        }
        break;
      case prefix + "iqc":
        {
          if (!q && !isQuotedMsg)
            return reply(
              "📸 *Butuh query*\n\nKetik query yang ingin ditampilkan.\nContoh: .iqc nama kamu",
            );
          wait();
          let fileName = sender + Date.now();
          let mediaPath;
          try {
            const nama = q || quotedMsg?.chats || quotedMsg?.text || "";

            if (!nama)
              return reply(
                "📸 *Butuh query*\n\nKetik query yang ingin ditampilkan.\nContoh: .iqc nama kamu",
              );
            const now = new Date();
            const jam = now.getHours().toString().padStart(2, "0");
            const menit = now.getMinutes().toString().padStart(2, "0");
            const waktu = `${jam}.${menit}`;
            const { generateIQC } = await import("iqc-canvas");

            const result = await generateIQC(nama, waktu, {
              baterai: [true, "100"],
              operator: true,
              timebar: true,
              wifi: true,
            });

            if (!result.success)
              return reply(
                `⚠️ *Gagal Generate IQC*\n\n${result.message || "Terjadi kesalahan."}`,
              );

            await karr.sendMessage(
              from,
              {
                image: result.image,
                caption: `*📸 IQC Generator*\n\n👤 *Query:* ${nama}\n⏰ *Waktu:* ${waktu}`,
              },
              { quoted: msg },
            );
          } catch (err) {
            reply(
              `⚠️ *Gagal Generate IQC*\n\n${err.message || "Terjadi kesalahan, coba lagi."}`,
            );
          } finally {
            if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
          }
        }
        break;
      case prefix + "qc":
        {
          wait();
          if (q) {
            if (q.includes("-d")) {
              if (isQuotedImage) {
                var media = await karr.downloadAndSaveMediaMessage(
                  msg,
                  "image",
                  `./tmp/${sender + Date.now()}.jpg`,
                );
                let data = await imgbbUploader(`${setting.imgbbkey}`, media);
                try {
                  var linkppuserp = await karr.profilePictureUrl(
                    mentionUser[0],
                    "image",
                  );
                } catch {
                  var linkppuserp =
                    "https://telegra.ph/file/e323980848471ce8e2150.png";
                }
                const getname = await karr.getName(mentionUser[0]);
                const json = {
                  type: "quote",
                  format: "png",
                  backgroundColor: "#1b1429",
                  width: 512,
                  height: 768,
                  scale: 2,
                  messages: [
                    {
                      entities: [],
                      media: {
                        url: data.display_url,
                      },
                      avatar: true,
                      from: {
                        id: 1,
                        name: getname,
                        photo: {
                          url: linkppuserp,
                        },
                      },
                      text: quotedMsg.chats,
                      replyMessage: {},
                    },
                  ],
                };
                const response = axios
                  .post("https://bot.lyo.su/quote/generate", json, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                    //https://bot.lyo.su/quote/generate
                  })
                  .then((res) => {
                    const buffer = Buffer.from(res.data.result.image, "base64");
                    var opt = {
                      packname: setting.packname,
                      author: setting.author,
                    };
                    karr.sendImageAsSticker(from, buffer, msg, opt);
                  });
                fs.unlinkSync(media);
              } else if (isQuotedMsg) {
                try {
                  var linkppuserp = await karr.profilePictureUrl(
                    mentionUser[0],
                    "image",
                  );
                } catch {
                  var linkppuserp =
                    "https://telegra.ph/file/e323980848471ce8e2150.png";
                }
                const getname = await karr.getName(mentionUser[0]);
                const json = {
                  type: "quote",
                  format: "png",
                  backgroundColor: "#1b1429",
                  width: 512,
                  height: 768,
                  scale: 2,
                  messages: [
                    {
                      entities: [],
                      avatar: true,
                      from: {
                        id: 1,
                        name: getname,
                        photo: {
                          url: linkppuserp,
                        },
                      },
                      text: quotedMsg.chats,
                      replyMessage: {},
                    },
                  ],
                };
                const response = axios
                  .post("https://bot.lyo.su/quote/generate", json, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                  .then((res) => {
                    const buffer = Buffer.from(res.data.result.image, "base64");
                    var opt = {
                      packname: setting.packname,
                      author: setting.author,
                    };
                    karr.sendImageAsSticker(from, buffer, msg, opt);
                  });
              } else if (q) {
                try {
                  var linkppuserp = await karr.profilePictureUrl(
                    sender,
                    "image",
                  );
                } catch {
                  var linkppuserp =
                    "https://telegra.ph/file/e323980848471ce8e2150.png";
                }
                const json = {
                  type: "quote",
                  format: "png",
                  backgroundColor: "#1b1429",
                  width: 512,
                  height: 768,
                  scale: 2,
                  messages: [
                    {
                      entities: [],
                      avatar: true,
                      from: {
                        id: 1,
                        name: pushname,
                        photo: {
                          url: linkppuserp,
                        },
                      },
                      text: q.replace("-d", ""),
                      replyMessage: {},
                    },
                  ],
                };
                const response = axios
                  .post("https://bot.lyo.su/quote/generate", json, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                  .then((res) => {
                    const buffer = Buffer.from(res.data.result.image, "base64");
                    var opt = {
                      packname: setting.packname,
                      author: setting.author,
                    };
                    karr.sendImageAsSticker(from, buffer, msg, opt);
                  });
              }
            } else {
              try {
                var linkppuserp = await karr.profilePictureUrl(sender, "image");
              } catch {
                var linkppuserp =
                  "https://telegra.ph/file/e323980848471ce8e2150.png";
              }
              const json = {
                type: "quote",
                format: "png",
                backgroundColor: "#FFFFFF",
                width: 512,
                height: 768,
                scale: 2,
                messages: [
                  {
                    entities: [],
                    avatar: true,
                    from: {
                      id: 1,
                      name: pushname,
                      photo: {
                        url: linkppuserp,
                      },
                    },
                    text: q,
                    replyMessage: {},
                  },
                ],
              };
              const response = axios
                .post("https://bot.lyo.su/quote/generate", json, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                .then((res) => {
                  const buffer = Buffer.from(res.data.result.image, "base64");
                  var opt = {
                    packname: setting.packname,
                    author: setting.author,
                  };
                  karr.sendImageAsSticker(from, buffer, msg, opt);
                });
            }
          } else if (isQuotedImage) {
            var media = await karr.downloadAndSaveMediaMessage(
              msg,
              "image",
              `./tmp/${sender + Date.now()}.jpg`,
            );
            data = await imgbbUploader(`${setting.imgbbkey}`, media);
            try {
              var linkppuserp = await karr.profilePictureUrl(
                mentionUser[0],
                "image",
              );
            } catch {
              var linkppuserp =
                "https://telegra.ph/file/e323980848471ce8e2150.png";
            }
            const getname = await karr.getName(mentionUser[0]);
            const json = {
              type: "quote",
              format: "png",
              backgroundColor: "#FFFFFF",
              width: 512,
              height: 768,
              scale: 2,
              messages: [
                {
                  entities: [],
                  media: {
                    url: data.display_url,
                  },
                  avatar: true,
                  from: {
                    id: 1,
                    name: getname,
                    photo: {
                      url: linkppuserp,
                    },
                  },
                  text: quotedMsg.chats,
                  replyMessage: {},
                },
              ],
            };
            const response = axios
              .post("https://bot.lyo.su/quote/generate", json, {
                headers: {
                  "Content-Type": "application/json",
                },
              })
              .then((res) => {
                const buffer = Buffer.from(res.data.result.image, "base64");
                var opt = {
                  packname: setting.packname,
                  author: setting.author,
                };
                karr.sendImageAsSticker(from, buffer, msg, opt);
              });
            fs.unlinkSync(media);
          } else if (isQuotedMsg) {
            try {
              var linkppuserp = await karr.profilePictureUrl(
                mentionUser[0],
                "image",
              );
            } catch {
              var linkppuserp =
                "https://telegra.ph/file/e323980848471ce8e2150.png";
            }
            const getname = await karr.getName(mentionUser[0]);
            const json = {
              type: "quote",
              format: "png",
              backgroundColor: "#FFFFFF",
              width: 512,
              height: 768,
              scale: 2,
              messages: [
                {
                  entities: [],
                  avatar: true,
                  from: {
                    id: 1,
                    name: getname,
                    photo: {
                      url: linkppuserp,
                    },
                  },
                  text: quotedMsg.chats,
                  replyMessage: {},
                },
              ],
            };
            const response = axios
              .post("https://bot.lyo.su/quote/generate", json, {
                headers: {
                  "Content-Type": "application/json",
                },
              })
              .then((res) => {
                const buffer = Buffer.from(res.data.result.image, "base64");
                var opt = {
                  packname: setting.packname,
                  author: setting.author,
                };
                karr.sendImageAsSticker(from, buffer, msg, opt);
              });
          } else {
            reply(`Kirim perintah ${command} teks
Atau reply chat ketik ${command}
gunakan -d untuk mode dark contoh :
${command} Halo -d
reply ${command} -d
`);
          }
        }
        break;
      //// GROUP COMMAND
      case prefix + "tagall":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          let teks = `*TAG ALL MEMBER*\nPesan : ${q ? q : "kosong"}\n\n`;
          for (let mem of groupMembers) {
            teks += `⭔ @${mem.id.split("@")[0]}\n`;
          }
          karr.sendMessage(
            from,
            {
              text: teks,
              mentions: groupMembers.map((a) => a.id),
            },
            {
              quoted: msg,
            },
          );
        }
        break;
      case prefix + "accall":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          try {
            let groupMetadata = await karr.groupMetadata(from);
            let pendingRequests = await karr.groupRequestParticipantsList(from);
            if (!pendingRequests || pendingRequests.length === 0)
              return reply(
                "❗Tidak ada permintaan bergabung yang perlu disetujui!",
              );
            for (let user of pendingRequests) {
              await karr.groupRequestParticipantsUpdate(
                from,
                [user.jid],
                "approve",
              );
            }
            reply(
              `✅ Berhasil menerima semua *${pendingRequests.length}* permintaan bergabung di grup *${groupMetadata.subject}*!`,
            );
          } catch (e) {
            console.log(e);
            reply("❌ Terjadi kesalahan saat memproses permintaan!");
          }
        }
        break;
      case prefix + "rejectall":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          try {
            let groupMetadata = await karr.groupMetadata(from);
            let pendingRequests = await karr.groupRequestParticipantsList(from);

            if (!pendingRequests || pendingRequests.length === 0)
              return reply(
                "❗ Tidak ada permintaan bergabung yang perlu ditolak!",
              );

            for (let user of pendingRequests) {
              await karr.groupRequestParticipantsUpdate(
                from,
                [user.jid],
                "reject",
              );
            }

            reply(
              `🚫 Semua *${pendingRequests.length}* permintaan bergabung di grup *${groupMetadata.subject}* telah ditolak.`,
            );
          } catch (e) {
            console.log(e);
            reply("❌ Terjadi kesalahan saat memproses penolakan!");
          }
        }
        break;
      case prefix + "delete":
      case prefix + "del":
      case prefix + "d":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isQuotedMsg) return reply(`Balas chat yang ingin dihapus`);
          if (quotedMsg.fromMe) {
            karr.sendMessage(from, {
              delete: {
                fromMe: true,
                id: quotedMsg.id,
                remoteJid: from,
              },
            });
          } else if (!quotedMsg.fromMe) {
            karr.sendMessage(from, {
              delete: {
                remoteJid: from,
                fromMe: false,
                id: quotedMsg.id,
                participant: mentionUser[0],
              },
            });
          }
        }
        break;
      case prefix + "listadmin":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          let no = 1;
          let teks = "*LIST ADMIN*";
          for (let i of getGroupAdminsid(groupMembers)) {
            let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : i;
            yeh = Object.keys(store.presences[from]);
            isOnline = yeh.includes(i);
            teks += `\n${no++} @${i.split("@")[0]}\n`;
            teks += ` Status : ${isOnline ? "Online✅" : "Offline🚫"}`;
          }
          reply2(teks);
        }
        break;
      case prefix + "dor":
      case prefix + "kick":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (mentionUser.length !== 0) {
            karr
              .groupParticipantsUpdate(from, [mentionUser[0]], "remove")
              .then((res) => {
                mentions(
                  `Sukses mengeluarkan @${mentionUser[0].split("@")[0]}`,
                  [mentionUser[0]],
                  true,
                );
              })
              .catch(() => reply(mess.error.api));
          } else if (isQuotedMsg) {
            karr
              .groupParticipantsUpdate(from, [quotedMsg.sender], "remove")
              .then((res) => {
                mentions(
                  `Sukses mengeluarkan @${quotedMsg.sender.split("@")[0]}`,
                  [quotedMsg.sender],
                  true,
                );
              })
              .catch(() => reply(mess.error.api));
          } else {
            reply(`Tag atau balas pesan member yang ingin di kick`);
          }
        }
        break;
      case prefix + "promote":
      case prefix + "pm":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (mentionUser.length !== 0) {
            karr
              .groupParticipantsUpdate(from, [mentionUser[0]], "promote")
              .then((res) => {
                mentions(
                  `Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai admin`,
                  [mentionUser[0]],
                  true,
                );
              })
              .catch(() => reply(mess.error.api));
          } else if (isQuotedMsg) {
            karr
              .groupParticipantsUpdate(from, [quotedMsg.sender], "promote")
              .then((res) => {
                mentions(
                  `Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai admin`,
                  [quotedMsg.sender],
                  true,
                );
              })
              .catch(() => reply(mess.error.api));
          } else {
            reply(`Tag atau balas pesan member yang ingin dijadikan admin`);
          }
        }
        break;
      case prefix + "demote":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (mentionUser.length !== 0) {
            karr
              .groupParticipantsUpdate(from, [mentionUser[0]], "demote")
              .then((res) => {
                mentions(
                  `Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai member biasa`,
                  [mentionUser[0]],
                  true,
                );
              })
              .catch(() => reply(mess.error.api));
          } else if (isQuotedMsg) {
            karr
              .groupParticipantsUpdate(from, [quotedMsg.sender], "demote")
              .then((res) => {
                mentions(
                  `Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai member biasa`,
                  [quotedMsg.sender],
                  true,
                );
              })
              .catch(() => reply(mess.error.api));
          } else {
            reply(
              `Tag atau balas pesan admin yang ingin dijadikan member biasa`,
            );
          }
        }
        break;
      case prefix + "swgc":
        {
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (isImage || isQuotedImage) {
            var mediar = await karr.downloadAndSaveMediaMessage(
              msg,
              "image",
              `./tmp/${sender}.jpeg`,
            );
            if (isQuotedMsg) {
              let options = {
                image: fs.readFileSync(`./tmp/${sender}.jpeg`),
                caption: quotedMsg.chats ? quotedMsg.chats : "",
              };
              await groupSatus(from, options);
              reply("Status terkirim");
            } else {
              let options = {
                image: fs.readFileSync(`./tmp/${sender}.jpeg`),
                caption: q ? q : "",
              };
              await groupSatus(from, options);
              reply("Status terkirim");
            }
            fs.unlinkSync(mediar);
          } else if (isVideo || isQuotedVideo) {
            var mediar = await karr.downloadAndSaveMediaMessage(
              msg,
              "video",
              `./tmp/${sender}.mp4`,
            );
            if (isQuotedMsg) {
              let options = {
                video: fs.readFileSync(`./tmp/${sender}.mp4`),
                caption: quotedMsg.chats ? quotedMsg.chats : "",
              };
              await groupSatus(from, options);
              reply("Status terkirim");
            } else {
              let options = {
                video: fs.readFileSync(`./tmp/${sender}.mp4`),
                caption: q ? q : "",
              };
              await groupSatus(from, options);
              reply("Status terkirim");
            }
            fs.unlinkSync(mediar);
          } else {
            reply(
              `Kirim gambar/vidio dengan caption ${command} atau balas gambar/vidio yang sudah dikirim`,
            );
          }
        }
        break;
      case prefix + "linkgrup":
      case prefix + "link":
      case prefix + "linkgc":
      case prefix + "linkgroup":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          var url = await karr
            .groupInviteCode(from)
            .catch(() => reply(mess.error.api));
          let link = "https://chat.whatsapp.com/" + url;
          const btn = new Button()
            .setTitle(`• Nama grup : ${groupName}\n• Id : ${from}`)
            .setFooter("© Ashema Karuta")

            .addUrl("LINK NYA", link)
            .addCopy("COPPY LINK", link);
          await btn.run(from, karr, msg);
        }
        break;
      case prefix + "fitnah":
        {
          if (args.length < 2)
            return reply(
              `Kirim perintah *${command}* @tag|pesantarget|pesanbot`,
            );
          var org = q.split("|")[0];
          var target = q.split("|")[1];
          var bot = q.split("|")[2];
          if (!org.startsWith("@")) return reply("Tag orangnya");
          if (!target) return reply(`Masukkan pesan target!`);
          if (!bot) return reply(`Masukkan pesan bot!`);
          var mens = parseMention2(target);
          var msg1 = {
            key: {
              fromMe: false,
              participant: `${parseMention2(org)}`,
              remoteJid: from ? from : "",
            },
            message: {
              extemdedTextMessage: {
                text: `${target}`,
                contextInfo: {
                  mentionedJid: mens,
                },
              },
            },
          };
          var msg2 = {
            key: {
              fromMe: false,
              participant: `${parseMention2(org)}`,
              remoteJid: from ? from : "",
            },
            message: {
              conversation: `${target}`,
            },
          };
          karr.sendMessage(
            from,
            {
              text: bot,
              mentions: mentioned,
            },
            {
              quoted: mens.length > 2 ? msg1 : msg2,
            },
          );
        }
        break;
      case prefix + "play":
        {
          if (!q) return reply(`Masukan Query!`);
          wait();
          var dat = await yts(q);
          let dataa = dat.videos[0];
          var initk = `
 *══ DATA DI DAPATKAN ══*

*${dataa.title}*
> | Duration : ${dataa.timestamp}
> | Viewers : ${dataa.views}
> | Upload At : ${dataa.ago}
> | Author : ${dataa.author.name}
> | https://youtu.be/${dataa.videoId}

_Wait sending audio...._
`;

          let textnya = await reply(initk);
          let datal = await ytmp3(`https://youtu.be/${dataa.videoId}`);
          let downloadURL = datal.data.result.downloadURL; // tambah .data
          karr.sendMessage(
            from,
            {
              audio: { url: downloadURL },
              mimetype: "audio/mp4",
              fileName: `${dataa.title}.mp3`,
            },
            {
              quoted: textnya,
            },
          );
        }
        break;
      //// DOWNLOADER COMMAND
      case prefix + "tiktok":
      case prefix + "ttdl":
      case prefix + "tt":
        {
          if (!q) return reply("Masukan Url");
          if (!isUrl(q)) return reply("Duhh itu bukan url!!");
          if (!args[1].includes("tiktok.com"))
            return reply("Link nya gak valid");
          wait();
          let anu = await tikdown(q);
          karr.sendMessage(
            from,
            {
              video: {
                url: anu.data.video,
              },
              caption: anu.data.title,
            },
            {
              quoted: msg,
            },
          );
        }
        break;
      case prefix + "igdl":
      case prefix + "ig":
        {
          if (!q) return reply("Masukan Url");
          if (!isUrl(q)) return reply("Duhh itu bukan url!!");
          if (!args[1].includes("instagram.com"))
            return reply("Link nya gak valid");
          let anu = await instagram(q);
          wait();
          if (anu.data.media_type == "reel") {
            for (let i of anu.data.video) {
              karr.sendMessage(
                from,
                {
                  video: {
                    url: i,
                  },
                  caption: anu.data.title,
                },
                {
                  quoted: msg,
                },
              );
            }
          } else if (anu.data.media_type == "image") {
            for (let i of anu.data.images) {
              karr.sendMessage(
                from,
                {
                  video: {
                    url: i,
                  },
                  caption: anu.data.title,
                },
                {
                  quoted: msg,
                },
              );
            }
          } else {
            reply("Media tidak support");
          }
        }
        break;
      case prefix + "xdl":
      case prefix + "twitter":
        {
          if (!q) return reply("Masukan Url");
          if (!isUrl(q)) return reply("Duhh itu bukan url!!");
          if (!args[1].includes("https://x.com"))
            return reply("Link nya gak valid");
          wait();
          let anu = await twitterdown(q);
          karr.sendMessage(
            from,
            {
              video: {
                url: anu.data.HD,
              },
              caption: `TWITTER DOWNLOADER`,
            },
            {
              quoted: msg,
            },
          );
        }
        break;
      case prefix + "fbdl":
      case prefix + "facebook":
        {
          if (!q) return reply("Masukan Url");
          if (!isUrl(q)) return reply("Duhh itu bukan url!!");
          if (!args[1].includes("facebook.com"))
            return reply("Link nya gak valid");
          wait();
          let anu = await fbdown2(q, "Nayan");
          karr.sendMessage(
            from,
            {
              video: {
                url: anu.media.hd,
              },
              caption: anu.media.title,
            },
            {
              quoted: msg,
            },
          );
        }
        break;
      case prefix + "ytdl":
      case prefix + "yt":
        {
          if (!q) return reply("Masukan Url");
          if (!isUrl(q)) return reply("Duhh itu bukan url!!");
          if (!args[1].includes("youtu")) return reply("Link nya gak valid");
          wait();
          let anu = await ytdown(q);
          karr.sendMessage(
            from,
            {
              video: {
                url: anu.data.video_hd,
              },
              caption: anu.data.title,
            },
            {
              quoted: msg,
            },
          );
        }
        break;
      case prefix + "threads":
      case prefix + "thdl":
        {
          if (!q) return reply("Masukan Url");
          if (!isUrl(q)) return reply("Duhh itu bukan url!!");
          if (!args[1].includes("threads.com"))
            return reply("Link nya gak valid");
          wait();
          let anu = await threads(q);
          karr.sendMessage(
            from,
            {
              video: {
                url: anu.data.video,
              },
              caption: anu.data.title,
            },
            {
              quoted: msg,
            },
          );
        }
        break;
      case prefix + "spotifydl":
        {
          if (!q) return reply("Masukan Url");
          if (!q.includes("spotify.com")) return reply("Link nya gak valid");
          if (q.includes("playlist"))
            return reply("Untuk saat ini tidak dapat mendownload playlist!");
          wait();
          let anu = await SpotifyDL(q);
          let capt = `
*${anu.data.details.title}*
> - Artist : ${anu.data.details.artists}
> - Durasi : ${clockString(anu.data.details.duration_ms)}

_Wait sending audio..._
`;
          await reply(q + "\n" + capt);

          karr.sendMessage(
            from,
            {
              audio: {
                url: anu.data.download_url,
              },
              mimetype: "audio/mp4",
              fileName: `${anu.data.details.title}.mp3`,
            },
            {
              quoted: msg,
            },
          );
          karr.sendMessage(
            from,
            {
              document: {
                url: anu.data.download_url,
              },
              fileName: `${anu.data.details.title}.mp3`,
              mimetype: "audio/mp3",
            },
            {
              quoted: msg,
            },
          );
        }
        break;
      //// RELIGI COMMAND
      case prefix + "quran":
      case prefix + "alquran":
        {
          let heh = `Gunakan nomor surah!, bisa lihat nomor surah di ${prefix}allsurah 

Contoh penggunaan:

- ${command} 1 (full surah)

- ${command} 1:3 (1 ayat saja)

1:3 berarti Al Fatihah ayat 3`;
          if (!q) return reply(heh);
          try {
            if (q.includes(":")) {
              let teks1 = q.split(":")[0];
              let teks2 = q.split(":")[1];
              var data = await surah(teks1);
              let num = await mathjs.evaluate(`${teks2}-1`);
              reply(
                `${data.data.ayat[num].teksArab}\n\n${data.data.ayat[num].teksLatin}\n\n_${data.data.ayat[num].teksIndonesia}_(${data.data.namaLatin}:${teks2})`,
              ).catch((err) => reply(`RESULT ${q} NOT FOUND`));
            } else {
              var data = await surah(q);
              var teks = `${data.data.nama} ( ${data.data.namaLatin} )\n\n`;
              for (let i of data.data.ayat) {
                teks += `(${i.nomorAyat}) ${i.teksArab}\n${i.teksLatin}\n\n`;
              }
              reply(teks).catch((err) => reply(`RESULT ${q} NOT FOUND`));
            }
          } catch (err) {
            reply(`RESULT ${q} NOT FOUND`);
          }
        }
        break;
      case prefix + "listsurah":
      case prefix + "allsurah":
        {
          allsurah().then((data) => {
            var teks = `List Surah Al-Qur\'an\n\n`;
            for (let i of data.result) {
              teks += `*Nomor :* ${i.index}\n*Surah :* ${i.surah} (${i.latin})\n*Jumlah Ayat :* ${i.jumlah_ayat}\n\n`;
            }
            teks += `Jika ingin mengambil salah satu Surah ketik ${prefix}alquran nomor atau ${prefix}alquran nomor:ayat`;
            reply(teks);
          });
        }
        break;
      case prefix + "quranaudio":
      case prefix + "alquranaudio":
        {
          let heh = `Gunakan nomor surah untuk mengambil audio bisa lihat nomor surah di ${prefix}allsurah 

Contoh penggunaan:

- ${command} 1 (full surah)

- ${command} 1:3 (1 ayat saja)

1:3 berarti Al Fatihah ayat 3`;
          if (!q) return reply(heh);
          wait();
          try {
            if (q.includes(":")) {
              let anu = await quranAudio(q);
              karr
                .sendMessage(
                  from,
                  {
                    audio: {
                      url: anu.data.audio,
                    },
                    mimetype: "audio/mpeg",
                    ptt: true,
                  },
                  {
                    quoted: msg,
                  },
                )
                .catch((err) => reply(`RESULT ${q} NOT FOUND`));
            } else {
              let data = await surah(q);
              karr
                .sendMessage(
                  from,
                  {
                    audio: {
                      url: data.data.audioFull?.["01"],
                    },
                    mimetype: "audio/mpeg",
                    ptt: true,
                  },
                  {
                    quoted: msg,
                  },
                )
                .catch((err) => reply(`RESULT ${q} NOT FOUND`));
            }
          } catch (err) {
            reply(`RESULT ${q} NOT FOUND`);
          }
        }
        break;
      case prefix + "kisahnabi":
        {
          if (!q)
            return reply(`Masukan nama nabi di bawah ini \n
 Adam 
 Idris 
 Nuh 
 Hud 
 Saleh 
 Ibrahim 
 Ismail 
 Ishaq 
 Luth 
 Yaqub 
 Yusuf 
 Syuaib 
 Ayyub 
 Dzulkifli 
 Musa 
 Harun 
 Daud 
 Sulaiman 
 Ily 
 Ilya 
 Yunus 
 Zakaria 
 Yahya 
 Isa 
 Muhammad
 
 Contoh : ${command} isa
 `);
          try {
            let heh = q.toLowerCase();
            if (heh.includes("muhammad")) {
              let heh = q.toLowerCase().replace("muhammad", "muhamad");
            }
            let anu = await fetchJson(
              `https://github.com/YukiShima4/Skreper/raw/master/religi/kisah%20nabi/${heh}.json`,
            );
            reply(
              `*Kisah nabi ${anu[0].name}* \n\n${anu[0].description}`,
            ).catch((e) => reply(`RESULT ${q} NOT FOUND`));
          } catch (err) {
            reply(`RESULT ${q} NOT FOUND`);
          }
        }
        break;
      case prefix + "randomdoa":
        {
          let anuk = await randomDoa();
          let anu = pickRandom(anuk.result);
          reply(`${anu.doa}\n\n${anu.arab}\n${anu.latin}\n\n${anu.id}`).catch(
            (err) => reply(`RESULT ${q} NOT FOUND`),
          );
        }
        break;
      //// GROUP MANAGEMENT - WELCOME / LEFT
      case prefix + "welcome":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (args[1] === "on") {
            if (isWelcome) return reply(`ℹ️ *Welcome* sudah aktif.`);
            welcome.push({
              jid: from,
              welcome: `Welcome @user`,
              left: `Sayonara @user`,
            });
            fs.writeFileSync(
              "./database/group/welcome.json",
              JSON.stringify(welcome, null, 2),
            );
            reply(
              `✅ *WELCOME AKTIF*\n\n• Ubah teks sambutan ╶ ${prefix}setwelcome --help\n• Ubah teks perpisahan ╶ ${prefix}setleft --help`,
            );
          } else if (args[1] === "off") {
            let anu = getPosiSaying(from);
            if (anu === null) return reply(`ℹ️ *Welcome* memang belum aktif.`);
            welcome.splice(anu, 1);
            fs.writeFileSync(
              "./database/group/welcome.json",
              JSON.stringify(welcome, null, 2),
            );
            reply(
              `🚫 *WELCOME NONAKTIF*\n\nSambutan & perpisahan member dimatikan.`,
            );
          } else {
            reply(
              `⚙️ *WELCOME*\n\n• Gunakan ╶ ${command} on/off\n• Status ╶ ${isWelcome ? "🟢 Aktif" : "🔴 Nonaktif"}`,
            );
          }
        }
        break;
      case prefix + "setwelcome":
      case prefix + "setwelkom":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isWelcome)
            return reply(
              `Welcome di group ini belum di aktifkan, kirim perintah ${prefix + "welcome"} lalu pencet on untuk mengaktifkan!`,
            );
          if (args.length < 2)
            return reply(
              `Kirim perintah *${command}* teks\nUntuk penjelasan pemakaian yang lebih detail, ketik *${command} --help*`,
            );
          if (args[1] === "--help") {
            reply(
              `Command Ini Berfungsi Untuk Mengganti Teks Welcome\n\n*Penggunaan :*\n- ${command} teks baru\n\n*List Option :*\n- @user _untuk mentions new member_\n- @pushname _untuk nama new mem_\n- @subject _untuk nama group_\n- @desc _untuk deskripsi group_\n- @member _untuk jumblah member_\n\nContoh :\n*${command}* Hai @user selamat datang di group @subject`,
            );
          } else {
            let posiw = getPosiSaying(from);
            welcome[posiw].welcome = q;
            fs.writeFileSync(
              "./database/group/welcome.json",
              JSON.stringify(welcome, null, 2),
            );
            reply(`✅ Teks *welcome* berhasil diubah:\n\n${q}`);
          }
        }
        break;
      case prefix + "setleft":
      case prefix + "setout":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isWelcome)
            return reply(
              `Welcome di group ini belum di aktifkan, kirim perintah ${prefix + "welcome"} lalu pencet on untuk mengaktifkan!`,
            );
          if (args.length < 2)
            return reply(
              `Kirim perintah *${command}* teks\nUntuk penjelasan pemakaian yang lebih detail, ketik *${command} --help*`,
            );
          if (args[1] === "--help") {
            reply(
              `Command Ini Berfungsi Untuk Mengganti Teks Left\n\n*Penggunaan :*\n- ${command} teks baru\n\n*List Option :*\n- @user _untuk mentions new member_\n- @pushname _untuk nama new mem_\n- @subject _untuk nama group_\n- @desc _untuk deskripsi group_\n- @member _untuk jumblah member_\n\nContoh :\n*${command}* Yah @user keluar dari group @subject`,
            );
          } else {
            let posil = getPosiSaying(from);
            welcome[posil].left = q;
            fs.writeFileSync(
              "./database/group/welcome.json",
              JSON.stringify(welcome, null, 2),
            );
            reply(`✅ Teks *left* berhasil diubah:\n\n${q}`);
          }
        }
        break;
      case prefix + "group":
      case prefix + "grup":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (args[1] == "close") {
            karr.groupSettingUpdate(from, "announcement");
            reply(
              `Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`,
            );
          } else if (args[1] == "open") {
            karr.groupSettingUpdate(from, "not_announcement");
            reply(
              `Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`,
            );
          } else {
            reply(
              `⚙️ *Pilih Opsi*\n\nGunakan open / close.\nContoh: ${command} close`,
            );
          }
        }
        break;
      case prefix + "mutebot":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (args[1] === "on") {
            if (isMuteBot) return reply(`ℹ️ *Mutebot* sudah aktif.`);
            db.group[from].mutebot = true;
            reply(
              "🔇 *MUTEBOT AKTIF*\n\nBot hanya merespon perintah dari admin.\nFitur antilink & antitagsw tetap berjalan.",
            );
          } else if (args[1] === "off") {
            if (!isMuteBot) return reply(`ℹ️ *Mutebot* sudah nonaktif.`);
            db.group[from].mutebot = false;
            reply(
              "🔊 *MUTEBOT NONAKTIF*\n\nBot kembali merespon semua member.",
            );
          } else {
            reply(
              `⚙️ *MUTEBOT*\n\n• Gunakan ╶ ${command} on/off\n• Status ╶ ${isMuteBot ? "🔇 Aktif" : "🔊 Nonaktif"}`,
            );
          }
        }
        break;
      case prefix + "mute":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          const target =
            mentioned?.[0] || msg.message?.[type]?.contextInfo?.participant;
          if (!target)
            return reply(
              `🔇 *MUTE MEMBER*\n\nTag atau reply member yang ingin dibungkam.\n\n• Contoh ╶ ${command} @user`,
            );
          const muteList = getGroupMute(from);
          if (muteList.includes(target))
            return karr.sendMessage(
              from,
              {
                text: `ℹ️ @${target.split("@")[0]} sudah dalam keadaan mute.`,
                mentions: [target],
              },
              { quoted: msg },
            );
          muteList.push(target);
          await karr.sendMessage(
            from,
            {
              text: `🔇 *MEMBER DI-MUTE*\n\n• User ╶ @${target.split("@")[0]}\n\nSetiap pesan dari member ini akan dihapus otomatis selama bot menjadi admin.\n\n› Batalkan dengan *${prefix}unmute @user*`,
              mentions: [target],
            },
            { quoted: msg },
          );
        }
        break;
      case prefix + "unmute":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          const target =
            mentioned?.[0] || msg.message?.[type]?.contextInfo?.participant;
          if (!target)
            return reply(
              `🔊 *UNMUTE MEMBER*\n\nTag atau reply member yang ingin dibebaskan.\n\n• Contoh ╶ ${command} @user`,
            );
          const muteList = getGroupMute(from);
          const idx = muteList.indexOf(target);
          if (idx === -1)
            return karr.sendMessage(
              from,
              {
                text: `ℹ️ @${target.split("@")[0]} tidak sedang di-mute.`,
                mentions: [target],
              },
              { quoted: msg },
            );
          muteList.splice(idx, 1);
          await karr.sendMessage(
            from,
            {
              text: `🔊 *MUTE DICABUT*\n\n• User ╶ @${target.split("@")[0]}\n\nMember ini kembali bisa mengirim pesan.`,
              mentions: [target],
            },
            { quoted: msg },
          );
        }
        break;
      case prefix + "mutelist":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          const muteList = getGroupMute(from);
          if (!muteList.length)
            return reply(
              "ℹ️ *Tidak Ada Mute*\n\nTidak ada member yang sedang di-mute di grup ini.",
            );
          const list = muteList
            .map((j, i) => `${i + 1}. @${j.split("@")[0]}`)
            .join("\n");
          await karr.sendMessage(
            from,
            { text: `🔇 *DAFTAR MUTE*\n\n${list}`, mentions: muteList },
            { quoted: msg },
          );
        }
        break;
      case prefix + "antilink":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (args[1] === "on") {
            if (isAntiLink) return reply(`ℹ️ *Antilink* sudah aktif.`);
            db.group[from].antilink = true;
            reply(
              "✅ *ANTILINK AKTIF*\n\nPesan yang mengandung link grup lain akan dihapus & diberi peringatan otomatis.",
            );
          } else if (args[1] === "off") {
            if (!isAntiLink) return reply(`ℹ️ *Antilink* sudah nonaktif.`);
            db.group[from].antilink = false;
            reply(
              "🚫 *ANTILINK NONAKTIF*\n\nLink grup lain tidak lagi dihapus.",
            );
          } else {
            reply(
              `⚙️ *ANTILINK*\n\n• Gunakan ╶ ${command} on/off\n• Status ╶ ${isAntiLink ? "🟢 Aktif" : "🔴 Nonaktif"}`,
            );
          }
        }
        break;
      case prefix + "antitagsw":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (args[1] === "on") {
            if (isAntiTag) return reply(`ℹ️ *Anti Tag SW* sudah aktif.`);
            db.group[from].antitagsw = true;
            reply(
              "✅ *ANTI TAG SW AKTIF*\n\nTag status/SW dari non-admin akan dihapus & diberi peringatan otomatis.",
            );
          } else if (args[1] === "off") {
            if (!isAntiTag) return reply(`ℹ️ *Anti Tag SW* sudah nonaktif.`);
            db.group[from].antitagsw = false;
            reply(
              "🚫 *ANTI TAG SW NONAKTIF*\n\nTag status/SW tidak lagi dihapus.",
            );
          } else {
            reply(
              `⚙️ *ANTI TAG SW*\n\n• Gunakan ╶ ${command} on/off\n• Status ╶ ${isAntiTag ? "🟢 Aktif" : "🔴 Nonaktif"}`,
            );
          }
        }
        break;
      case prefix + "afk":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          const reason = q || "Nothing";
          if (reason.length > 100)
            return reply(
              "⚠️ *Alasan Terlalu Panjang*\n\nGunakan alasan maksimal 100 karakter.",
            );
          const groupAfk = getGroupAFK(from);
          groupAfk[senderlid] = { time: +new Date(), reason: reason };
          reply(
            `🌙 *AFK MODE*\n\nMode AFK berhasil diaktifkan.\n\n• Nama ╶ @${sender.split("@")[0]}\n• Alasan ╶ ${reason}`,
          );
        }
        break;
      case prefix + "warn":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          const target = mentioned?.[0] || quotedMsg?.sender;
          if (!target)
            return reply("Tag atau reply user yang ingin diberi warn!");
          const reason = q || "Tidak ada alasan";
          const groupData = getGroupWarn(from);
          if (!groupData.warn[target])
            groupData.warn[target] = { count: 0, reasons: [] };
          groupData.warn[target].count += 1;
          groupData.warn[target].reasons.push(reason);
          const currentWarn = groupData.warn[target].count;
          const warnLimit = groupData.warnLimit;
          const tag = `@${target.split("@")[0]}`;
          if (currentWarn >= warnLimit) {
            await karr.sendMessage(
              from,
              {
                text: `⚠️ *PERINGATAN MAKSIMUM!*\n\n👤 User: ${tag}\n🔢 Warn: ${currentWarn}/${warnLimit}\n📋 Alasan: ${reason}\n\n🚫 User telah dikeluarkan dari grup karena melewati batas warn!`,
                mentions: [target],
              },
              { quoted: msg },
            );
            await karr.groupParticipantsUpdate(from, [target], "remove");
            groupData.warn[target] = { count: 0, reasons: [] };
          } else {
            await karr.sendMessage(
              from,
              {
                text: `⚠️ *PERINGATAN!*\n\n👤 User: ${tag}\n🔢 Warn: ${currentWarn}/${warnLimit}\n📋 Alasan: ${reason}\n\n${warnLimit - currentWarn} warn lagi dikick otomatis!`,
                mentions: [target],
              },
              { quoted: msg },
            );
          }
        }
        break;
      case prefix + "unwarn":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          const target = mentioned?.[0] || quotedMsg?.sender;
          if (!target)
            return reply("Tag atau reply user yang ingin dihapus warnnya!");
          const { warn, warnLimit } = getGroupWarn(from);
          if (!warn[target] || warn[target].count === 0)
            return reply("User ini tidak memiliki warn!");
          warn[target].count -= 1;
          warn[target].reasons.pop();
          await karr.sendMessage(
            from,
            {
              text: `✅ *Warn Dihapus!*\n\n👤 User: @${target.split("@")[0]}\n🔢 Sisa Warn: ${warn[target].count}/${warnLimit}`,
              mentions: [target],
            },
            { quoted: msg },
          );
        }
        break;
      case prefix + "resetwarn":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          const target = mentioned?.[0] || quotedMsg?.sender;
          if (!target)
            return reply("Tag atau reply user yang ingin direset warnnya!");
          const { warn } = getGroupWarn(from);
          warn[target] = { count: 0, reasons: [] };
          await karr.sendMessage(
            from,
            {
              text: `✅ *Warn Direset!*\n\n👤 User: @${target.split("@")[0]}\n🔢 Warn: 0`,
              mentions: [target],
            },
            { quoted: msg },
          );
        }
        break;
      case prefix + "warnlist":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          const { warn, warnLimit } = getGroupWarn(from);
          const entries = Object.entries(warn).filter(([, v]) => v.count > 0);
          if (entries.length === 0)
            return reply("Tidak ada user yang memiliki warn di grup ini!");
          let mentionsW = [];
          const list = entries
            .map(([jid, data]) => {
              mentionsW.push(jid);
              return `👤 @${jid.split("@")[0]}\n   🔢 Warn: ${data.count}/${warnLimit}\n   📋 ${data.reasons.join(", ")}`;
            })
            .join("\n\n");
          await karr.sendMessage(
            from,
            { text: `📋 *DAFTAR WARN GRUP*\n\n${list}`, mentions: mentionsW },
            { quoted: msg },
          );
        }
        break;
      case prefix + "setwarnlimit":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          const limit = parseInt(q);
          if (isNaN(limit) || limit < 1 || limit > 10)
            return reply("Masukkan angka antara 1–10!");
          const groupData = getGroupWarn(from);
          groupData.warnLimit = limit;
          await karr.sendMessage(
            from,
            { text: `✅ Batas warn grup diubah menjadi *${limit}*` },
            { quoted: msg },
          );
        }
        break;
      case prefix + "setopen":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!q)
            return reply(
              `Format: *${prefix}setopen HH:MM*\nContoh: *${prefix}setopen 06:00*`,
            );
          const [hourStr, minuteStr] = q.trim().split(":");
          const hour = parseInt(hourStr);
          const minute = parseInt(minuteStr ?? "0");
          if (
            isNaN(hour) ||
            isNaN(minute) ||
            hour < 0 ||
            hour > 23 ||
            minute < 0 ||
            minute > 59
          )
            return reply(
              "Format jam salah! Gunakan format HH:MM, contoh: 06:00",
            );
          const schedule = getGroupSchedule(from);
          schedule.open = { hour, minute, enabled: true };
          reply(
            `✅ *Jadwal Buka Grup Diset!*\n\n🕐 Grup akan otomatis *dibuka* setiap hari pukul *${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}*`,
          );
        }
        break;
      case prefix + "setclose":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isBotGroupAdmins) return reply(mess.BotAdmin);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          if (!q)
            return reply(
              `Format: *${prefix}setclose HH:MM*\nContoh: *${prefix}setclose 22:00*`,
            );
          const [hourStr, minuteStr] = q.trim().split(":");
          const hour = parseInt(hourStr);
          const minute = parseInt(minuteStr ?? "0");
          if (
            isNaN(hour) ||
            isNaN(minute) ||
            hour < 0 ||
            hour > 23 ||
            minute < 0 ||
            minute > 59
          )
            return reply(
              "Format jam salah! Gunakan format HH:MM, contoh: 22:00",
            );
          const schedule = getGroupSchedule(from);
          schedule.close = { hour, minute, enabled: true };
          reply(
            `✅ *Jadwal Tutup Grup Diset!*\n\n🕐 Grup akan otomatis *ditutup* setiap hari pukul *${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}*`,
          );
        }
        break;
      case prefix + "delopen":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          const schedule = getGroupSchedule(from);
          schedule.open = { hour: null, minute: null, enabled: false };
          reply("✅ Jadwal buka otomatis berhasil *dinonaktifkan*!");
        }
        break;
      case prefix + "delclose":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
          const schedule = getGroupSchedule(from);
          schedule.close = { hour: null, minute: null, enabled: false };
          reply("✅ Jadwal tutup otomatis berhasil *dinonaktifkan*!");
        }
        break;
      case prefix + "jadwal":
        {
          if (!isGroup) return reply(mess.OnlyGrup);
          const schedule = getGroupSchedule(from);
          const { open, close } = schedule;
          const openStr = open.enabled
            ? `🟢 Buka  : *${String(open.hour).padStart(2, "0")}:${String(open.minute).padStart(2, "0")}* setiap hari`
            : `🟢 Buka  : *Tidak diset*`;
          const closeStr = close.enabled
            ? `🔴 Tutup : *${String(close.hour).padStart(2, "0")}:${String(close.minute).padStart(2, "0")}* setiap hari`
            : `🔴 Tutup : *Tidak diset*`;
          reply(
            `📅 *JADWAL GRUP*\n\n${openStr}\n${closeStr}\n\n_Gunakan ${prefix}setopen / ${prefix}setclose untuk mengubah jadwal_`,
          );
        }
        break;
      //// OWNER COMMAND
      case prefix + "onlygc":
      case prefix + "onlygrup":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          const set = db.settings[botNumber];
          if (args[1] === "on") {
            if (set.onlyGc) return reply(`ℹ️ *Only Grup* sudah aktif.`);
            set.onlyGc = true;
            reply(
              "✅ *ONLY GRUP AKTIF*\n\nBot hanya merespon di dalam grup. Pesan pribadi (PM) diabaikan kecuali dari owner.",
            );
          } else if (args[1] === "off") {
            if (!set.onlyGc) return reply(`ℹ️ *Only Grup* sudah nonaktif.`);
            set.onlyGc = false;
            reply(
              "🚫 *ONLY GRUP NONAKTIF*\n\nBot kembali merespon di chat pribadi (PM).",
            );
          } else {
            reply(
              `⚙️ *ONLY GRUP*\n\n• Gunakan ╶ ${command} on/off\n• Status ╶ ${set.onlyGc ? "🟢 Aktif" : "🔴 Nonaktif"}`,
            );
          }
        }
        break;
      case prefix + "autoclear":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          const set = db.settings[botNumber];
          if (args[1] === "on") {
            if (set.autoclear) return reply(`ℹ️ *Autoclear* sudah aktif.`);
            set.autoclear = true;
            reply(
              "✅ *AUTOCLEAR AKTIF*\n\nFolder tmp dibersihkan otomatis tiap *30 menit*.",
            );
          } else if (args[1] === "off") {
            if (!set.autoclear) return reply(`ℹ️ *Autoclear* sudah nonaktif.`);
            set.autoclear = false;
            reply(
              "🚫 *AUTOCLEAR NONAKTIF*\n\nPembersihan tmp otomatis dimatikan.",
            );
          } else {
            reply(
              `⚙️ *AUTOCLEAR*\n\n• Gunakan ╶ ${command} on/off\n• Status ╶ ${set.autoclear ? "🟢 Aktif" : "🔴 Nonaktif"}`,
            );
          }
        }
        break;
      case prefix + "restart":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          await reply(
            "╭─❍ *RESTART*\n│\n├ ♻️ Sedang merestart bot...\n│ Mohon tunggu sebentar.\n│\n╰─❍",
          );
          try {
            fs.writeFileSync(
              "./database/restart.json",
              JSON.stringify({ chat: from, timestamp: Date.now() }),
            );
          } catch {}
          exec("pm2 restart main", (err) => {
            if (err) process.exit(0);
          });
        }
        break;
      case prefix + "cleartmp":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          try {
            for (const f of fs.readdirSync("./tmp")) {
              try {
                fs.rmSync(path.join("./tmp", f), {
                  recursive: true,
                  force: true,
                });
              } catch {}
            }
          } catch {}
          reply("✅ *Cache Dibersihkan*\n\nSeluruh cache berhasil dihapus.");
        }
        break;
      case prefix + "clearsession":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          const folderPath = "./session";
          const excludedFile = "creds.json";
          fs.readdir(folderPath, (err, files) => {
            if (err) return;
            files.forEach((file) => {
              if (file !== excludedFile) {
                fs.unlink(path.join(folderPath, file), () => {});
              }
            });
          });
          reply("✅ *Sesi Dibersihkan*\n\nSession berhasil dihapus.");
        }
        break;
      case prefix + "backup":
      case prefix + "downloadsc":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          reply("⚙️ *Menjalankan...*\n\nMohon tunggu sebentar.");

          let cp = require("child_process");
          let { promisify } = require("util");
          let exec = promisify(cp.exec).bind(cp);
          const fs = require("fs");

          const backupFileName = `Ashema${hri}-${buln2[bulnh]}.zip`;

          try {
            await exec(
              `zip -r ${backupFileName} database lib message main.js package.json session tmp`,
              { maxBuffer: 1024 * 1024 * 500 },
            );

            let sesi = fs.readFileSync(backupFileName);

            await karr.sendMessage(
              setting.ownerNumber,
              {
                document: sesi,
                mimetype: "application/zip",
                fileName: backupFileName,
              },
              { quoted: msg },
            );

            await reply(
              `✅ *Backup Terkirim*\n\nFile *${backupFileName}* telah dikirim ke owner.`,
            );

            return await exec(`rm -rf ${backupFileName}`);
          } catch (e) {
            console.error(e);
            return reply(`⚠️ *Backup Gagal*\n\n${e.message}`);
          }
        }
        break;
      case prefix + "sendsessi":
      case prefix + "getsession":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          karr.sendMessage(
            from,
            {
              document: fs.readFileSync("./session/creds.json"),
              mimetype: "jpg/application",
              fileName: "creds.json",
            },
            { quoted: msg },
          );
        }
        break;
      case prefix + "setnamebot":
      case prefix + "setname":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          if (!q) return reply(`✏️ *Cara Pakai*\n\nContoh: ${command} teks`);
          karr.updateProfileName(q);
          reply(`✅ *Nama Bot Diubah*\n\nNama bot kini: *${q}*`);
        }
        break;
      case prefix + "setbio":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          if (!q) return reply(`✏️ *Cara Pakai*\n\nContoh: ${command} teks`);
          if (db.settings[botNumber].autobio)
            return reply(
              `Auto bio sedang menyala tidak bisa menggunakan fitur tersebut matikan dulu dengan cara ${prefix}autobio`,
            );
          karr.setStatus(`${q}`);
          reply(`✅ *Bio Diubah*\n\nBio kini: *${q}*`);
        }
        break;
      case prefix + "setpp":
      case prefix + "setppbot":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          if (isImage || isQuotedImage) {
            var media = await karr.downloadAndSaveMediaMessage(
              msg,
              "image",
              "ppbot.jpeg",
            );
            if (args[1] == "panjang") {
              var { img } = await generateProfilePicture(media);
              await karr.query({
                tag: "iq",
                attrs: {
                  to: botNumber,
                  type: "set",
                  xmlns: "w:profile:picture",
                },
                content: [
                  { tag: "picture", attrs: { type: "image" }, content: img },
                ],
              });
              fs.unlinkSync(media);
              reply("✅ *Berhasil*\n\nPerintah berhasil dijalankan.");
            } else {
              await karr.updateProfilePicture(botNumber, { url: media });
              fs.unlinkSync(media);
              reply("✅ *Berhasil*\n\nPerintah berhasil dijalankan.");
            }
          } else {
            reply(
              `Kirim/balas gambar dengan caption ${command} untuk mengubah foto profil bot`,
            );
          }
        }
        break;
      case prefix + "getcase":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          if (!q)
            return reply(`✏️ *Cara Pakai*\n\nContoh: ${command} case_name`);
          try {
            var dataCase = getCase(args[1]);
            const Rich = new AIRich()
              .addCode("javascript", dataCase)
              .addSource([
                [
                  "https://i.ibb.co/Cp2JxVsH/09cbcafa6576.jpg",
                  "ASHEMA COMMUNITY",
                ],
              ]);
            Rich.run(from, karr);
          } catch {
            reply(
              `⚠️ *Tidak Terdaftar*\n\n${args[1]} tidak terdaftar di ashema.js.`,
            );
          }
        }
        break;
      case prefix + "getfunction":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          if (!q)
            return reply(`✏️ *Cara Pakai*\n\nContoh: ${command} case_name`);
          try {
            let evaled = await eval(`${q}+''`);
            if (typeof evaled !== "string") evaled = inspect(evaled);
            const Rich = new AIRich()
              .addCode("javascript", evaled)
              .addSource([
                [
                  "https://i.ibb.co/Cp2JxVsH/09cbcafa6576.jpg",
                  "ASHEMA COMMUNITY",
                ],
              ]);
            Rich.run(from, karr);
          } catch (err) {
            reply(`${err}`);
          }
        }
        break;
      case prefix + "addcase":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          const quoted = msg.quotedMsg;
          const code = (
            quoted?.conversation ||
            quoted?.extendedTextMessage?.text ||
            quoted?.imageMessage?.caption ||
            quoted?.videoMessage?.caption ||
            ""
          ).trim();
          if (!code)
            return reply(
              `⚙️ *ADD CASE*\n\nReply pesan berisi kode case, lalu ketik *${command}*.\n\nContoh kode:\ncase prefix + 'halo':{\nreply('halo juga')\n}`,
            );
          if (!/case\s+prefix/.test(code))
            return reply(
              "⚠️ Kode yang di-reply harus berupa case (mengandung `case prefix`).",
            );
          const mNama = code.match(/prefix\s*\+?\s*['"`]([a-z0-9]+)['"`]/i);
          const nama = mNama ? mNama[1].toLowerCase() : null;
          if (!nama)
            return reply(
              "⚠️ Tidak bisa membaca nama case dari kode (contoh: case prefix + 'halo':).",
            );
          const srcA = fs.readFileSync(__filename).toString();
          const dupRe = new RegExp(
            `case\\s*prefix\\s*\\+?\\s*['"\`]${nama}['"\`]\\s*:`,
          );
          if (dupRe.test(srcA)) return reply(`⚠️ Case *${nama}* sudah ada.`);
          const linesA = srcA.split("\n");
          const marker = linesA.findLastIndex((l) =>
            l.includes("__ADDCASE_MARKER__"),
          );
          if (marker === -1)
            return reply(
              "⚠️ *Marker Tidak Ditemukan*\n\nPenanda addcase tidak ada di dalam file.",
            );
          const block = code.split("\n");
          if (!block.some((l) => /\bbreak\b/.test(l)))
            block.push("        break;");
          const newLinesA = [...linesA];
          newLinesA.splice(marker, 0, ...block);
          const newContentA = newLinesA.join("\n");
          const execpA = promisify(cp.exec);
          const tmpCheckA = `${__dirname}/.addcase_check.js`;
          fs.writeFileSync(tmpCheckA, newContentA);
          try {
            await execpA(`node --check "${tmpCheckA}"`);
          } catch (e) {
            fs.unlinkSync(tmpCheckA);
            return reply(
              `⚠️ *KODE TIDAK VALID* (syntax error) — dibatalkan.\n\n${(e.stderr || e.message || "").split("\n").slice(0, 4).join("\n")}`,
            );
          }
          fs.unlinkSync(tmpCheckA);
          fs.writeFileSync(__filename, newContentA);
          reply(
            `✅ *CASE DITAMBAHKAN*\n\n• Nama ╶ ${prefix}${nama}\n• Case di tambahkan di baris ke ╶ *${marker + 1}*\n• Jumlah baris ╶ *${block.length}*\n\n_Case langsung aktif (hot-reload)._`,
          );
        }
        break;
      case prefix + "delcase":
        {
          if (!isOwner) return reply(mess.OnlyOwner);
          if (!q)
            return reply(
              `⚙️ *DEL CASE*\n\n• Format ╶ ${command} nama\n• Contoh ╶ ${command} halo`,
            );
          const nama = q.trim().toLowerCase();
          const srcD = fs.readFileSync(__filename).toString();
          const linesD = srcD.split("\n");
          const caseRe = new RegExp(
            `case\\s*prefix\\s*\\+?\\s*['"\`]${nama}['"\`]\\s*:`,
          );
          const start = linesD.findIndex((l) => caseRe.test(l));
          if (start === -1) return reply(`⚠️ Case *${nama}* tidak ditemukan.`);
          let end = start;
          while (end < linesD.length && !/\bbreak\b\s*;?/.test(linesD[end]))
            end++;
          if (end >= linesD.length)
            return reply(
              "⚠️ *Gagal Memproses*\n\nTidak bisa menentukan akhir blok case.",
            );
          const removed = end - start + 1;
          const newContentD = [
            ...linesD.slice(0, start),
            ...linesD.slice(end + 1),
          ].join("\n");
          const execpD = promisify(cp.exec);
          const tmpCheckD = `${__dirname}/.delcase_check.js`;
          fs.writeFileSync(tmpCheckD, newContentD);
          try {
            await execpD(`node --check "${tmpCheckD}"`);
          } catch (e) {
            fs.unlinkSync(tmpCheckD);
            return reply(
              `⚠️ Penghapusan dibatalkan — hasilnya membuat syntax error.\n\n${(e.stderr || e.message || "").split("\n").slice(0, 4).join("\n")}`,
            );
          }
          fs.unlinkSync(tmpCheckD);
          fs.writeFileSync(__filename, newContentD);
          reply(
            `🗑️ *CASE DIHAPUS*\n\n• Nama ╶ ${prefix}${nama}\n• Dihapus mulai baris ke ╶ *${start + 1}*\n• Total baris ╶ *${removed}*`,
          );
        }
        break;
      // __ADDCASE_MARKER__ (jangan hapus baris ini — penanda lokasi addcase)
      default:
        /// RESPON AKINATOR
        if (sesiaki.has(sender) && !isCmd) {
          if (isImage) return;
          if (isSticker) return;
          if (isVideo) return;
          if (!chats) return;
          const aki = sesiaki.get(sender);
          async function kirimPertanyaanBerikutnya(karr, sender, aki) {
            let emot = "🧐";
            if (Math.round(aki.progress) > 50) {
              emot = "😣";
            } else if (Math.round(aki.progress) > 80) {
              emot = "😖";
            }
            const menuTeks =
              `[ PERTANYAAN ${aki.step + 1} ]\n` +
              `Progress: ${Math.round(aki.progress)}%  ${emot}\n\n` +
              `*${aki.question}*\n\n` +
              `👉 Balas dengan nomor:\n` +
              `*0* : Ya\n` +
              `*1* : Tidak\n` +
              `*2* : Saya Tidak Tahu\n` +
              `*3* : Mungkin\n` +
              `*4* : Mungkin Tidak\n\n` +
              `💡 Ketik *${prefix}akiend* untuk berhenti.`;

            await karr.sendMessage(from, { text: menuTeks }, { quoted: msg });
          }
          const jawabanId = parseInt(chats, 10);
          if (isNaN(jawabanId) || jawabanId < 0 || jawabanId > 4) {
            return;
          }

          try {
            await aki.answer(jawabanId);
            if (aki.isWin) {
              await karr.sendMessage(
                from,
                { text: "🧐 Hmm... Akinator sudah punya jawaban! Sebentar..." },
                { quoted: msg },
              );
              const teksHasil =
                `🏆 *TEBAKAN AKINATOR!* 🏆\n\n` +
                `Nama Tokoh: *${aki.sugestion_name}*\n` +
                `Deskripsi: _${aki.sugestion_desc}_\n\n` +
                `Terima kasih sudah bermain! Ketik ${prefix}*akinator* jika ingin bermain lagi.`;
              await karr.sendMessage(
                from,
                {
                  image: { url: aki.sugestion_photo },
                  caption: teksHasil,
                },
                { quoted: msg },
              );
              sesiaki.delete(sender);
            } else {
              await kirimPertanyaanBerikutnya(karr, sender, aki);
            }
          } catch (err) {
            console.error(err);
            await karr.sendMessage(
              from,
              {
                text: "❌ Terjadi kesalahan saat memproses jawaban. Sesi dihentikan.",
              },
              { quoted: msg },
            );
            sesiaki.delete(sender);
          }
        }
        //// RESPON MBTI
        if (mbti.hasSession(sender) && !isCmd) {
          if (isImage) return;
          if (isSticker) return;
          if (isVideo) return;
          if (!chats) return;
          if (isNaN(chats)) {
            return reply("Balas menggunakan angka saja.");
          }

          const userInput = parseInt(chats);

          if (userInput < 1 || userInput > 7) {
            return reply(
              "⚠️ Pilihan salah. Harap balas dengan angka *1* hingga *7*.\n\n" +
                "1 = Sangat Tidak Setuju\n" +
                "4 = Netral\n" +
                "7 = Sangat Setuju",
            );
          }

          const actualValue = userInput - 4;
          try {
            mbti.answer(sender, actualValue);
          } catch (err) {
            return reply(err.message);
          }
          let nextStep = mbti.getStep(sender);

          if (nextStep < 60) {
            let petunjuk = `\n\n_Balas dengan angka *1* (Sangat Tidak Setuju) sampai *7* (Sangat Setuju)_`;
            reply(
              `[${nextStep + 1}/60] ` +
                format(mbti.questionsTemplate[nextStep]) +
                petunjuk,
            );
          } else {
            try {
              const result = await mbti.submit(sender);
              let aku = `🧩Anda Adalah Seorang *${result.raw.typeCode}*\n\n*${result.raw.socialMediaTitle}*\n${result.raw.content.intro.parts[0].replace(/<\/?p>/g, "\n")}`;
              const btn = new Button()
                .setImage(result.raw.content.intro.image.src)
                .setTitle(aku)
                .setFooter("© Ashema Community")
                .addUrl("Lihat Hasil", result.url, true)
                .addReply(
                  "CAREER",
                  `${prefix}mbticareer ${result.raw.content.career.intro}`,
                )
                .addReply(
                  "Relationships",
                  `${prefix}mbtirela ${result.raw.content.relationships.intro}`,
                );
              await btn.run(from, karr, msg);
            } catch (err) {
              mbti.deleteSession(sender);
            }
          }
          return;
        }
        if (chats.startsWith("> ")) {
          if (!isOwner) return;
          try {
            reply(
              util.format(await eval(`(async () => { ${chats.slice(2)} })()`)),
            );
          } catch (e) {
            reply(util.format(e));
          }
        } else if (chats.startsWith("$ ")) {
          if (!isOwner) return;
          exec(chats.slice(2), (err, stdout) => {
            if (err) return reply(`${err}`);
            if (stdout) reply(`${stdout}`);
          });
        } else if (chats.startsWith("x ") || chats.startsWith("< ")) {
          if (!isOwner) return;
          try {
            const codeToEval = chats.slice(2);
            let evaled = await eval(codeToEval);
            if (typeof evaled !== "string") {
              evaled = inspect(evaled);
            }
            reply(`${evaled}`);
          } catch (err) {
            reply(`${err}`);
          }
        }
    }
  } catch (err) {
    console.log(color("[ERROR]", "red"), err);
    karr.sendMessage(
      msg.key.remoteJid,
      {
        text: `Maaf terjadi kesalahan`,
      },
      {
        quoted: msg,
      },
    );
    karr.sendMessage(
      "6285811597011@s.whatsapp.net",
      {
        text: `*[TERJADI ERROR]*\n${err}`,
      },
      {
        quoted: msg,
      },
    );
  }
};
