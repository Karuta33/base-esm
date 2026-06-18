import makeWASocket, {
  fetchLatestBaileysVersion,
  DisconnectReason,
  useMultiFileAuthState,
  delay,
  downloadContentFromMessage,
  jidDecode,
  getDevice,
  generateMessageID,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
} from "@whiskeysockets/baileys";
import figlet from "figlet";
import fs from "fs";
import FileType from "file-type";
import chalk from "chalk";
import moment from "moment";
import chokidar from "chokidar";
import readline from "readline";
import os from "os";
import { Jimp } from "jimp";
import path from "path";
import pino from "pino";
import { fileURLToPath, pathToFileURL } from "url";
import { serialize, getBuffer, sleep, getGroupAdmins } from "./lib/myfunc.js";
import { makeInMemoryStore } from "./lib/store.js";
import { createGroupMetaCache } from "./lib/group-cache.js";
import { applyWarn } from "./lib/warn.js";
import {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
} from "./lib/exif.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let setting = JSON.parse(fs.readFileSync("./lib/settings.json"));
if (!fs.existsSync("./database/group"))
  fs.mkdirSync("./database/group", { recursive: true });
if (!fs.existsSync("./database/group/welcome.json"))
  fs.writeFileSync("./database/group/welcome.json", "[]");
let welcome = JSON.parse(fs.readFileSync("./database/group/welcome.json"));
if (!fs.existsSync("./database/database.json")) {
  fs.writeFileSync(
    "./database/database.json",
    JSON.stringify(
      {
        database: {},
        game: {},
        settings: {},
        group: {},
        others: {},
        users: {},
        banned: {},
      },
      null,
      2,
    ),
  );
}
global.db = JSON.parse(fs.readFileSync("./database/database.json"));
for (const k of [
  "database",
  "game",
  "settings",
  "group",
  "others",
  "users",
  "banned",
]) {
  if (typeof global.db[k] !== "object" || global.db[k] === null)
    global.db[k] = {};
}
let _lastDbSnapshot = "";
setInterval(() => {
  const snapshot = JSON.stringify(global.db, null, 2);
  if (snapshot === _lastDbSnapshot) return;
  _lastDbSnapshot = snapshot;
  fs.writeFileSync("./database/database.json", snapshot);
}, 60 * 1000);

let _schedulersStarted = false;
let ashema = await import(pathToFileURL(path.resolve("./message/ashema.js")));
const getPosiSaying = (from, _db) => {
  let posi = null;
  _db.forEach((v, i) => {
    if (v.jid === from) posi = i;
  });
  return posi;
};
function watchAshema() {
  const filePath = path.resolve("./message/ashema.js");

  let reloading = false;
  const reloadFile = async () => {
    if (reloading) return;
    reloading = true;
    try {
      const url = `${pathToFileURL(filePath).href}?update=${Date.now()}`;
      const module = await import(url);
      ashema = module;
      console.log(
        chalk.green(
          `[Reload] ashema.js berhasil diperbarui! ${moment().format("HH:mm:ss DD/MM/YYYY")}`,
        ),
      );
    } catch (error) {
      console.error(
        chalk.red(`[Error] Gagal me-reload ashema.js:`),
        error.message,
      );
    } finally {
      reloading = false;
    }
  };

  const watcher = chokidar.watch(filePath, {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 50,
    },
  });

  watcher
    .on("add", reloadFile)
    .on("change", reloadFile)
    .on("unlink", () =>
      console.log(chalk.yellow(`[Watch] ashema.js terhapus, menunggu...`)),
    )
    .on("error", (err) =>
      console.error(chalk.red(`[Watch] Error watcher:`), err.message),
    );

  console.log(chalk.cyan(`Memantau perubahan pada ./message/ashema.js ...`));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

function title() {
  console.clear();
  console.log(
    chalk.bold.yellow(
      figlet.textSync("ASHEMA KITSUNE", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 90,
        whitespaceBreak: false,
      }),
    ),
  );
  console.log(
    chalk.yellow(
      `\n${chalk.yellow("[ CREATE BY KARUTA ]")}\n\n${chalk.red("ASHEMA KITSUNE")} : ${chalk.white("WhatsApp Bot")}\n${chalk.red("Follow Insta Dev")} : ${chalk.white("@Yukishima3_")}\n${chalk.red("Message Me On Telegram")} : ${chalk.white("@Ashemakrta")}\n`,
    ),
  );
}

const store = makeInMemoryStore({
  logger: pino({
    level: "silent",
  }),
  maxMessagesPerChat: 500,
});
store.startAutoSave("./session/store.json");
const groupCache = createGroupMetaCache({ store });

async function WaConnect() {
  watchAshema();
  const ConnectToWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    const { version } = await fetchLatestBaileysVersion();

    const karr = makeWASocket({
      logger: pino({
        level: "silent",
      }),
      printQRInTerminal: false,
      auth: state,
      browser: ["Ubuntu", "Firefox", "20.0.0"],
      retryRequestDelayMs: 5000,
      cachedGroupMetadata: groupCache.cachedGroupMetadata,
      getMessage: async (key) => {
        const msg = store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      },
    });

    title();

    store.bind(karr.ev);
    groupCache.attach(karr);

    if (!karr.authState.creds.registered) {
      console.log("\nSilahkan masukan nomor whatsapp anda");
      const inputNumber = await question("MASUKKAN NOMOR (628xxx) : ");
      const number = inputNumber.replace(/[^0-9]/g, "");

      if (!number) {
        console.log("❌ Nomor tidak valid! Harap jalankan ulang.");
        process.exit();
      }

      console.log(`\n[!] Menunggu koneksi socket...`);
      await delay(3000);

      const customCode = setting.customCode;
      try {
        const code = await karr.requestPairingCode(number, customCode);
        console.log(`\nKode anda : ${code}`);
        console.log("[ INFO ] Masukkan kode di atas pada WhatsApp Anda.\n");
      } catch (err) {
        console.log("\n[!] Gagal request code. Silakan restart server.\n", err);
      }
    }
    karr.multi = true;
    karr.nopref = false;
    karr.mode = "public";
    karr.spam = [];

    karr.ev.on("messages.upsert", async (m) => {
      if (!m.messages) return;
      let msg = m.messages[0];
      try {
        if (msg.message.messageContextInfo)
          delete msg.message.messageContextInfo;
      } catch {}
      msg = serialize(karr, msg);
      msg.isBaileys = msg.key.id.startsWith("BAE5");
      msg.Device = await getDevice(msg.key.id);

      // Inisialisasi pengaturan default grup (dipakai antilink/antitagsw/mutebot dll).
      const _from = msg.key.remoteJid;
      const _isGroup = _from.endsWith("@g.us");
      if (_isGroup && typeof global.db.group[_from] !== "object") {
        global.db.group[_from] = {
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

      // === ANTI TAG SW: hapus tag status/SW dari non-admin + warn otomatis ===
      if (
        _isGroup &&
        global.db.group[_from]?.antitagsw &&
        msg.message?.groupStatusMentionMessage
      ) {
        try {
          const meta = await groupCache.getGroupMetadata(_from);
          const admins = getGroupAdmins(meta ? meta.participants : []);
          const senderTag = msg.key.participantAlt || msg.participantAlt;
          if (!admins.includes(senderTag)) {
            await karr.sendMessage(_from, {
              delete: {
                remoteJid: _from,
                fromMe: msg.key.fromMe,
                id: msg.key.id,
                participant: msg.key.participant,
              },
            });
            await applyWarn(
              karr,
              _from,
              senderTag,
              "Mengirim tag status/SW",
              null,
              { header: "「 STATUS TAG DETECTOR 」" },
            );
          }
        } catch (err) {
          console.error("Gagal proses antitagsw:", err?.message || err);
        }
      }

      ashema.default(store, karr, msg, m, welcome);
    });

    karr.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
          ? ConnectToWhatsApp()
          : console.log("connection logged out...");
      } else if (connection === "open") {
        console.log("Bot connected to server");
        karr.sendMessage(setting.ownerNumber, {
          text: `*BOT CONNECTED*\n*• Name :* ${karr.user.name}\n*• Owner :* @${setting.ownerNumber.split("@")[0]}\n*• Platform :* ${os.platform()}\n*• WhatsApp Version :* v${version.join(".")}`,
          mentions: [setting.ownerNumber],
        });
        karr.newsletterFollow("120363409494362642@newsletter");
      }
    });

    karr.ev.on("creds.update", saveCreds);

    // === SCHEDULER: buka/tutup grup otomatis + autoclear tmp ===
    if (!_schedulersStarted) {
      _schedulersStarted = true;
      setInterval(async () => {
        try {
          const now = new Date();
          const curH = now.getHours();
          const curM = now.getMinutes();
          for (const [groupId, groupData] of Object.entries(
            global.db.group || {},
          )) {
            const schedule = groupData?.schedule;
            if (!schedule) continue;
            const { close, open } = schedule;
            if (
              close?.enabled &&
              close.hour === curH &&
              close.minute === curM
            ) {
              if (!close.done) {
                close.done = true;
                try {
                  await karr.groupSettingUpdate(groupId, "announcement");
                  await karr.sendMessage(groupId, {
                    text: `🔴 *GRUP DITUTUP*\n\nGrup otomatis ditutup pukul *${String(close.hour).padStart(2, "0")}:${String(close.minute).padStart(2, "0")}*\nHanya admin yang dapat mengirim pesan.`,
                  });
                } catch (e) {
                  close.done = false;
                  console.error(`Gagal menutup grup ${groupId}:`, e.message);
                }
              }
            } else if (close?.enabled) {
              close.done = false;
            }
            if (open?.enabled && open.hour === curH && open.minute === curM) {
              if (!open.done) {
                open.done = true;
                try {
                  await karr.groupSettingUpdate(groupId, "not_announcement");
                  await karr.sendMessage(groupId, {
                    text: `🟢 *GRUP DIBUKA*\n\nGrup otomatis dibuka pukul *${String(open.hour).padStart(2, "0")}:${String(open.minute).padStart(2, "0")}*\nSemua member kini dapat mengirim pesan.`,
                  });
                } catch (e) {
                  open.done = false;
                  console.error(`Gagal membuka grup ${groupId}:`, e.message);
                }
              }
            } else if (open?.enabled) {
              open.done = false;
            }
          }
        } catch (err) {
          console.error("Scheduler error:", err?.message || err);
        }
      }, 60 * 1000);

      // Autoclear folder tmp tiap 30 menit (jika diaktifkan owner).
      setInterval(
        async () => {
          try {
            const botNumber = karr.user.id.split(":")[0] + "@s.whatsapp.net";
            if (!global.db.settings?.[botNumber]?.autoclear) return;
            for (const f of fs.readdirSync("./tmp")) {
              try {
                fs.rmSync(path.join("./tmp", f), {
                  recursive: true,
                  force: true,
                });
              } catch {}
            }
            console.log("[AUTOCLEAR] tmp dibersihkan");
          } catch (e) {
            console.error("autoclear:", e.message);
          }
        },
        30 * 60 * 1000,
      );
    }

    karr.ev.on("group-participants.update", async (data) => {
      const posi = getPosiSaying(data.id, welcome);
      if (posi === null) return;
      try {
        const groupData = await groupCache.getGroupMetadata(data.id);
        const { subject, desc, participants } = groupData;
        const memeg = participants.length;
        console.log(
          "group-participants.update " + subject + " - Action: " + data.action,
        );

        for (const participant of data.participants) {
          // Ambil JID asli dari phoneNumber bila tersedia, jika tidak pakai id/lid
          const jidUser = participant.phoneNumber
            ? participant.phoneNumber
            : participant.id;
          let pushname;
          try {
            pushname = await karr.getName(jidUser);
          } catch {
            pushname = jidUser.split("@")[0];
          }

          if (data.action == "add") {
            const teksw = welcome[posi].welcome
              .replace(/@user/gi, `@${jidUser.split("@")[0]}`)
              .replace(/@subject/gi, subject)
              .replace(/@pushname/gi, pushname)
              .replace(/@desc/gi, desc || "")
              .replace(/@member/gi, memeg);
            await karr.sendMessage(data.id, {
              text: teksw,
              mentions: [jidUser],
            });
          } else if (data.action == "remove") {
            const teksl = welcome[posi].left
              .replace(/@user/gi, `@${jidUser.split("@")[0]}`)
              .replace(/@subject/gi, subject)
              .replace(/@pushname/gi, pushname)
              .replace(/@desc/gi, desc || "")
              .replace(/@member/gi, memeg);
            await karr.sendMessage(data.id, {
              text: teksl,
              mentions: [jidUser],
            });
          }
        }
      } catch (e) {
        console.error("Error di group-participants.update:", e);
      }
    });
    karr.decodeJid = (jid) => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return (
          (decode.user && decode.server && decode.user + "@" + decode.server) ||
          jid
        );
      } else return jid;
    };
    karr.sendFile = async (
      jid,
      path,
      filename = "",
      caption = "",
      quoted,
      ptt = false,
      options = {},
    ) => {
      let type = await karr.getFile(path, true);
      let { res, data: file, filename: pathFile } = type;
      if ((res && res.status !== 200) || file.length <= 65536) {
        try {
          throw {
            json: JSON.parse(file.toString()),
          };
        } catch (e) {
          if (e.json) throw e.json;
        }
      }
      let opt = {
        filename,
      };
      if (quoted) opt.quoted = quoted;
      if (!type) if (options.asDocument) options.asDocument = true;
      let mtype = "",
        mimetype = type.mime;
      if (/webp/.test(type.mime)) mtype = "sticker";
      else if (/image/.test(type.mime)) mtype = "image";
      else if (/video/.test(type.mime)) mtype = "video";
      else if (/audio/.test(type.mime))
        ((convert = await (ptt ? toPTT : toAudio)(file, type.ext)),
          (file = convert.data),
          (pathFile = convert.filename),
          (mtype = "audio"),
          (mimetype = "audio/ogg; codecs=opus"));
      else mtype = "document";
      return await karr.sendMessage(
        jid,
        {
          ...options,
          caption,
          ptt,
          [mtype]: {
            url: pathFile,
          },
          mimetype,
        },
        {
          ...opt,
          ...options,
        },
      );
    };
    karr.getFile = async (PATH, returnAsFilename) => {
      let res, filename;
      let data = Buffer.isBuffer(PATH)
        ? PATH
        : /^data:.*?\/.*?;base64,/i.test(PATH)
          ? Buffer.from(PATH.split`,`[1], "base64")
          : /^https?:\/\//.test(PATH)
            ? await (res = await fetch(PATH)).buffer()
            : fs.existsSync(PATH)
              ? ((filename = PATH), fs.readFileSync(PATH))
              : typeof PATH === "string"
                ? PATH
                : Buffer.alloc(0);
      if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
      let type = (await FileType.fromBuffer(data)) || {
        mime: "application/octet-stream",
        ext: ".bin",
      };
      if (data && returnAsFilename && !filename) {
        filename = path.join(
          __dirname,
          "./tmp/" + new Date() * 1 + "." + type.ext,
        );
        await fs.promises.writeFile(filename, data);
      }
      return {
        res,
        filename,
        ...type,
        data,
      };
    };
    karr.reply = (from, content, msg) =>
      karr.sendMessage(
        from,
        {
          text: content,
        },
        {
          quoted: msg,
        },
      );
    karr.allfitur = () =>
      fs.readFileSync("./message/ashema.js").toString().split(`break`).length;
    karr.ws.on("CB:call", async (json) => {
      const callerId = json.content[0].attrs["call-creator"];
      karr.sendMessage(callerId, {
        text: "*Maaf bot tidak dapat menjawab call*",
      });
      await sleep(10000);
    });
    karr.sendContact = async (jid, kon, quoted = "", opts = {}) => {
      let list = [];
      for (let i of kon) {
        list.push({
          lisplayName: await karr.getName(i + "@s.whatsapp.net"),
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await karr.getName(i + "@s.whatsapp.net")}\nFN:${await karr.getName(i + "@s.whatsapp.net")}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        });
      }
      return karr.sendMessage(
        jid,
        {
          contacts: {
            displayName: `${list.length} Kontak`,
            contacts: list,
          },
          ...opts,
        },
        {
          quoted,
        },
      );
    };
    karr.sendMessageFromContent = async (jid, message, options = {}) => {
      var option = {
        contextInfo: {},
        ...options,
      };
      var prepare = await generateWAMessageFromContent(jid, message, option);
      await karr.relayMessage(jid, prepare.message, {
        messageId: prepare.key.id,
      });
      return prepare;
    };

    function parseMention(text = "") {
      return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
        (v) => v[1] + "@s.whatsapp.net",
      );
    }

    karr.sendWithThumbnail = async (jid, options = {}, msg) => {
      const {
        text = "",
        title = "",
        body = "",
        thumbnailUrl,
        sourceUrl = "",
      } = options;

      const thumbRes = await fetch(thumbnailUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      const raw = Buffer.from(await thumbRes.arrayBuffer());

      const image = await Jimp.read(raw);

      image.scaleToFit({
        w: 1024,
        h: 576,
      });

      const compressed = await image.getBuffer("image/jpeg", {
        quality: 90,
      });

      const uploaded = await prepareWAMessageMedia(
        {
          image: compressed,
        },
        {
          upload: karr.waUploadToServer,
          mediaTypeOverride: "thumbnail-link",
        },
      );

      const im = uploaded.imageMessage;

      await karr.relayMessage(
        jid,
        {
          extendedTextMessage: {
            text: `${sourceUrl}\n\n${text}`,
            matchedText: sourceUrl,
            description: body,
            title,
            previewType: 0,
            renderLargerThumbnail: true,

            jpegThumbnail: im.jpegThumbnail,
            thumbnailDirectPath: im.directPath,
            thumbnailSha256: im.fileSha256,
            thumbnailEncSha256: im.fileEncSha256,
            mediaKey: im.mediaKey,
            mediaKeyTimestamp: im.mediaKeyTimestamp,

            thumbnailHeight: image.bitmap.height || 576,
            thumbnailWidth: image.bitmap.width || 1024,
          },
        },
        {
          messageId: generateMessageID(),
        },
      );
    };
    karr.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
      let buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
          ? Buffer.from(path.split`,`[1], "base64")
          : /^https?:\/\//.test(path)
            ? await await getBuffer(path)
            : fs.existsSync(path)
              ? fs.readFileSync(path)
              : Buffer.alloc(0);
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
      } else {
        buffer = await imageToWebp(buff);
      }
      await karr
        .sendMessage(
          jid,
          {
            sticker: {
              url: buffer,
            },
            ...options,
          },
          {
            quoted,
          },
        )
        .then((response) => {
          fs.unlinkSync(buffer);
          return response;
        });
    };
    karr.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
      let buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
          ? Buffer.from(path.split`,`[1], "base64")
          : /^https?:\/\//.test(path)
            ? await await getBuffer(path)
            : fs.existsSync(path)
              ? fs.readFileSync(path)
              : Buffer.alloc(0);
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
      } else {
        buffer = await videoToWebp(buff);
      }
      await karr
        .sendMessage(
          jid,
          {
            sticker: {
              url: buffer,
            },
            ...options,
          },
          {
            quoted,
          },
        )
        .then((response) => {
          fs.unlinkSync(buffer);
          return response;
        });
    };
    karr.downloadAndSaveMediaMessage = async (msg, type_file, path_file) => {
      if (type_file === "image") {
        var stream = await downloadContentFromMessage(
          msg.message.imageMessage ||
            msg.message.extendedTextMessage?.contextInfo.quotedMessage
              .imageMessage,
          "image",
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(path_file, buffer);
        return path_file;
      } else if (type_file === "video") {
        var stream = await downloadContentFromMessage(
          msg.message.videoMessage ||
            msg.message.extendedTextMessage?.contextInfo.quotedMessage
              .videoMessage,
          "video",
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(path_file, buffer);
        return path_file;
      } else if (type_file === "sticker") {
        var stream = await downloadContentFromMessage(
          msg.message.stickerMessage ||
            msg.message.extendedTextMessage?.contextInfo.quotedMessage
              .stickerMessage,
          "sticker",
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(path_file, buffer);
        return path_file;
      } else if (type_file === "audio") {
        var stream = await downloadContentFromMessage(
          msg.message.audioMessage ||
            msg.message.extendedTextMessage?.contextInfo.quotedMessage
              .audioMessage,
          "audio",
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(path_file, buffer);
        return path_file;
      }
    };
  };

  ConnectToWhatsApp().catch((err) => console.log(err));
}

WaConnect();
