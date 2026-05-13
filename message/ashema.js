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
import { inspect } from 'util';
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import { pathToFileURL } from 'url';
import fetch from 'node-fetch';
import { exec, spawn } from "child_process";
import chalk from 'chalk';
import cp from 'child_process';
import speed from 'performance-now';
import { promisify } from 'util';
import setting from '../lib/settings.json' with { type: 'json' };
const { ownerNumber, prefix: defaultPrefix } = setting;
//// IMPORT LIB
import { ndown, instagram, tikdown, ytdown, threads, twitterdown, fbdown2, GDLink, pintarest, capcut, likee, alldown, alldownV2, spotifySearch, soundcloudSearch, spotifyDl, soundcloud,terabox } from "../lib/downloader.js"
import { wxGpt, SpotifyDL, igStalk } from "../lib/azmi-api.js"
import { 
    serialize, getBuffer, fetchJson, fetchText, getRandom,
    getGroupAdmins, runtime, runtime2, sleep, generateProfilePicture,
    makeid, makeid2, removeEmojis, calculate_age, bytesToSize, checkBandwidth 
} from "../lib/myfunc.js";

import { 
    smsg, formatp, tanggal, formatDate, getTime, isUrl, 
    clockString, jsonformat, parseMention, reSize 
} from "../lib/otherfunc.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

moment.tz.setDefault("Asia/Jakarta").locale("id");

export default async ( karr, msg, m) => {
    try {
        const { type, isQuotedMsg, quotedMsg, mentioned, now, fromMe, isBaileys } = msg;
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