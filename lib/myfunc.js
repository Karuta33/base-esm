import bail from "@whiskeysockets/baileys";
import axios from "axios";
import fs from "fs";
import fetch from "node-fetch";
import { Jimp } from "jimp";
import osUtils from "node-os-utils";

export const serialize = (conn, msg) => {
    msg.isGroup = msg.key.remoteJid.endsWith('@g.us');
    try {
        const berak = Object.keys(msg.message)[0];
        msg.type = berak;
    } catch {
        msg.type = null;
    }
    
    try {
        const context = msg.message[msg.type].contextInfo.quotedMessage;
        if (context["ephemeralMessage"]) {
            msg.tipuAn = context.ephemeralMessage.message;
        } else {
            msg.tipuAn = context;
        }
        msg.istipuAn = true;
        msg.tipuAn.sender = msg.message[msg.type].contextInfo.participant;
        msg.tipuAn.fromMe = msg.tipuAn.sender === conn.user.id.split(':')[0] + '@s.whatsapp.net';
        msg.tipuAn.type = Object.keys(msg.tipuAn)[0];
        
        let ane = msg.tipuAn;
        msg.tipuAn.chats = (ane.type === 'conversation' && ane.conversation) ? ane.conversation : 
                             (ane.type == 'imageMessage') && ane.imageMessage.caption ? ane.imageMessage.caption : 
                             (ane.type == 'documentMessage') && ane.documentMessage.caption ? ane.documentMessage.caption : 
                             (ane.type == 'videoMessage') && ane.videoMessage.caption ? ane.videoMessage.caption : 
                             (ane.type == 'extendedTextMessage') && ane.extendedTextMessage.text ? ane.extendedTextMessage.text : 
                             (ane.type == 'buttonsMessage') && ane.buttonsMessage.contentText ? ane.buttonsMessage.contentText : "";
        
        msg.tipuAn.id = msg.message[msg.type].contextInfo.stanzaId;
        msg.tipuAn.key = { 
            remoteJid: msg.key.remoteJid, 
            fromMe: ane.fromMe, 
            id: ane.id, 
            participant: msg.isGroup ? ane.sender : undefined 
        };
        msg.tipuAn.key.device = bail.getDevice(msg.message[msg.type].contextInfo.stanzaId);
    } catch {
        msg.tipuAn = null;
        msg.istipuAn = false;
    }
     try {
        msg.quotedMsg = msg.message[msg.type].contextInfo.quotedMessage;
    } catch {
        msg.quotedMsg = null;
    }
    try {
        const mention = msg.message[msg.type].contextInfo.mentionedJid;
        msg.mentioned = mention;
    } catch {
        msg.mentioned = [];
    }
    
    if (msg.isGroup) {
        msg.sender = msg.participant;
    } else {
        msg.sender = msg.key.remoteJid;
    }
    if (msg.key.fromMe) {
        msg.sender = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    }

    msg.from = msg.key.remoteJid;
    msg.now = msg.messageTimestamp;
    msg.fromMe = msg.key.fromMe;
    msg.creator = 'KARUTA';

    return msg;
};

export const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
};

export const getBuffer = async (url, options = {}) => {
    try {
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        });
        return res.data;
    } catch (e) {
        console.log(`Error : ${e}`);
    }
};

export const fetchJson = (url, options) => new Promise((resolve, reject) => {
    fetch(url, options)
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => reject(err));
});

export const fetchText = (url, options) => new Promise((resolve, reject) => {
    fetch(url, options)
        .then(response => response.text())
        .then(text => resolve(text))
        .catch(err => reject(err));
});

export const getGroupAdmins = function(participants) {
    let admins = [];
    for (let i of participants) {
        i.admin !== null ? admins.push(i.jid) : '';
    }
    return admins;
};

export const getGroupAdminsid = function(participants) {
    let admins = [];
    for (let i of participants) {
        i.admin !== null ? admins.push(i.id) : '';
    }
    return admins;
};

export const runtime = function(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
};

export const runtime2 = function(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + ":" : "";
    var hDisplay = h > 0 ? h + ":" : "";
    var mDisplay = m > 0 ? m + ":" : "";
    var sDisplay = s > 0 ? s : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
};

export const removeEmojis = (string) => {
    const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return string.replace(regex, '');
};

export const calculate_age = (dob) => {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
};

export const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const url = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'));
};

export const generateProfilePicture = async(buffer) => {
    const jimp_1 = await jimp.read(buffer);
    const resz = jimp_1.getWidth() > jimp_1.getHeight() ? jimp_1.resize(550, jimp.AUTO) : jimp_1.resize(jimp.AUTO, 650);
    return {
        img: await resz.getBufferAsync(jimp.MIME_JPEG)
    };
};

export const makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const makeid2 = (length) => {
    let result = '';
    const characters = '1234567890';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const UserAgent = () => {
    const UA = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0"
        // ... (sisanya tetap sama)
    ];
    return UA[Math.floor(Math.random() * UA.length)];
};

export const fixNumber = (number) => {
    const str = String(number).split("").reverse().join("");
    const arr = str.match(/\d{1,3}/g);
    let arr2 = arr.join(".").split("").reverse().join("");
    return arr2;
};

export const bytesToSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const checkBandwidth = async() => {
    let ind = 0;
    let out = 0;
    const stats = await osUtils.netstat.stats();
    for (let i of stats) {
        ind += parseInt(i.inputBytes);
        out += parseInt(i.outputBytes);
    }
    return {
        download: bytesToSize(ind),
        upload: bytesToSize(out),
    };
};

export const reSize = async(buffer, ukur1, ukur2) => {
    const baper = await jimp.read(buffer);
    return await baper.resize(ukur1, ukur2).getBufferAsync(jimp.MIME_JPEG);
};
