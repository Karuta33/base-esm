import makeWASocket, {
	fetchLatestBaileysVersion,
	BufferJSON,
	DisconnectReason,
	useMultiFileAuthState,
	delay,
	downloadContentFromMessage,
	jidDecode,
	generateForwardMessageContent,
	generateWAMessage,
	getContentType,
	getDevice,
	generateMessageID,
	generateWAMessageFromContent,
	proto,
	prepareWAMessageMedia,
	makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import figlet from "figlet";
import fs from "fs";
import FileType from 'file-type';
import moment from 'moment';
import chalk from 'chalk';
import logg from 'pino';
import NodeCache from "node-cache";
import readline from "readline";
import {
	parsePhoneNumber
} from "libphonenumber-js";
import os from 'os';
import {
	Jimp
} from "jimp"
import util from "util";
import clui from 'clui';
import path from 'path';
import pino from 'pino';
import PhoneNumber from 'awesome-phonenumber';
import {
	fileURLToPath
} from 'url';
import {
	serialize,
	getBuffer,
	fetchJson,
	fetchText,
	getRandom,
	getGroupAdmins,
	runtime,
	sleep,
	generateProfilePicture,
	makeid,
	makeid2,
	removeEmojis,
	calculate_age,
	bytesToSize,
	checkBandwidth
} from "./lib/myfunc.js";
import {
	makeInMemoryStore
} from "./lib/store.js"
import {
	imageToWebp,
	videoToWebp,
	writeExifImg,
	writeExifVid
} from "./lib/exif.js"
import {
	color,
	mylog,
	infolog
} from "./lib/color.js";

const {
	Spinner
} = clui;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY');
let setting = JSON.parse(fs.readFileSync('./lib/settings.json'));

const pairingCode = true;
const useMobile = false;
const pairingNumber = "";
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

function title() {
	console.clear();
	console.log(chalk.bold.yellow(figlet.textSync('ASHEMA KITSUNE', {
		font: 'Standard',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 90,
		whitespaceBreak: false
	})));
	console.log(chalk.yellow(`\n${chalk.yellow('[ CREATE BY KARUTA ]')}\n\n${chalk.red('ASHEMA KITSUNE')} : ${chalk.white('WhatsApp Bot')}\n${chalk.red('Follow Insta Dev')} : ${chalk.white('@Yukishima3_')}\n${chalk.red('Message Me On Telegram')} : ${chalk.white('@Ashemakrta')}\n`));
}

function nocache(module, cb = () => {}) {
	console.log(`Module ${module} sedang diperhatikan terhadap perubahan`);
	fs.watchFile(path.resolve(__dirname, module), async () => {
		cb(module);
	});
}

const reconnect = new Spinner(chalk.redBright(` reconnecting..`));
const store = makeInMemoryStore({
	logger: pino({
		level: 'silent'
	}),
	maxMessagesPerChat: 500 // optional
})

const getPosiSaying = (from, _db) => {
	let posi = null;
	Object.keys(_db).forEach((i) => {
		if (_db[i].jid === from) {
			posi = i;
		}
	});
	return posi;
};

async function WaConnect() {
	const ConnectToWhatsApp = async () => {
		const {
			state,
			saveCreds
		} = await useMultiFileAuthState(`./session`);
		const {
			version,
			isLatest
		} = await fetchLatestBaileysVersion();
		const msgRetryCounterCache = new NodeCache();

		const karr = makeWASocket({
			logger: pino({
				level: "silent"
			}),
			printQRInTerminal: false,
			auth: state,
			browser: ["Ubuntu", "Firefox", "20.0.0"],
			retryRequestDelayMs: 5000,
		});

		title();

		store.bind(karr.ev);

		if (!karr.authState.creds.registered) {
			console.log("\nSilahkan masukan nomor whatsapp anda");
			const inputNumber = await question('MASUKKAN NOMOR (628xxx) : ');
			const number = inputNumber.replace(/[^0-9]/g, '');

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
		karr.multi = true
		karr.nopref = false
		karr.mode = 'public'
		karr.spam = []
		const ashemaHandler = await import('./message/ashema.js');

		karr.ev.on('messages.upsert', async m => {
			if (!m.messages) return;
			let msg = m.messages[0];
			try {
				if (msg.message.messageContextInfo) delete msg.message.messageContextInfo
			} catch {}
			msg = serialize(karr, msg);
			msg.isBaileys = msg.key.id.startsWith('BAE5');
			msg.Device = await getDevice(msg.key.id);

			// Memanggil handler
			ashemaHandler.default(store, karr, msg, m);
		});

		karr.ev.on('connection.update', async (update) => {
			const {
				connection,
				lastDisconnect
			} = update;
			if (connection === 'close') {
				lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ?
					ConnectToWhatsApp() :
					console.log('connection logged out...');
			} else if (connection === 'open') {
				console.log('Bot connected to server');
				karr.sendMessage('6285811597011@s.whatsapp.net', {
					text: `*BOT CONNECTED*\n*• Name :* ${karr.user.name}\n*• Owner :* @${setting.ownerNumber.split("@")[0]}\n*• Platform :* ${os.platform()}\n*• WhatsApp Version :* v${version.join('.')}`,
					mentions: [setting.ownerNumber]
				});
			  karr.newsletterFollow("120363408368002483@newsletter")
			}
		});

		karr.ev.on('creds.update', saveCreds);

		// Helper methods (sama seperti di original)
		karr.decodeJid = (jid) => {
			if (!jid) return jid;
			if (/:\d+@/gi.test(jid)) {
				let decode = jidDecode(jid) || {};
				return decode.user && decode.server && decode.user + '@' + decode.server || jid;
			} else return jid;
		};
		karr.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
			let type = await karr.getFile(path, true)
			let {
				res,
				data: file,
				filename: pathFile
			} = type
			if (res && res.status !== 200 || file.length <= 65536) {
				try {
					throw {
						json: JSON.parse(file.toString())
					}
				} catch (e) {
					if (e.json) throw e.json
				}
			}
			let opt = {
				filename
			}
			if (quoted) opt.quoted = quoted
			if (!type)
				if (options.asDocument) options.asDocument = true
			let mtype = '',
				mimetype = type.mime
			if (/webp/.test(type.mime)) mtype = 'sticker'
			else if (/image/.test(type.mime)) mtype = 'image'
			else if (/video/.test(type.mime)) mtype = 'video'
			else if (/audio/.test(type.mime))(
				convert = await (ptt ? toPTT : toAudio)(file, type.ext),
				file = convert.data,
				pathFile = convert.filename,
				mtype = 'audio',
				mimetype = 'audio/ogg; codecs=opus'
			)
			else mtype = 'document'
			return await karr.sendMessage(jid, {
				...options,
				caption,
				ptt,
				[mtype]: {
					url: pathFile
				},
				mimetype
			}, {
				...opt,
				...options
			})
		}
		karr.getFile = async (PATH, returnAsFilename) => {
			let res, filename;
			let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0);
			if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer');
			let type = await FileType.fromBuffer(data) || {
				mime: 'application/octet-stream',
				ext: '.bin'
			};
			if (data && returnAsFilename && !filename) {
				filename = path.join(__dirname, './tmp/' + new Date * 1 + '.' + type.ext);
				await fs.promises.writeFile(filename, data);
			}
			return {
				res,
				filename,
				...type,
				data
			};
		};
		karr.reply = (from, content, msg) => karr.sendMessage(from, {
			text: content
		}, {
			quoted: msg
		})
		karr.allfitur = () => fs.readFileSync('./message/ashema.js').toString().split(`break`).length
		karr.ws.on('CB:call', async (json) => {
			const callerId = json.content[0].attrs['call-creator']
			karr.sendMessage(callerId, {
				text: '*Maaf bot tidak dapat menjawab call*'
			})
			await sleep(10000)
		})
		karr.sendContact = async (jid, kon, quoted = '', opts = {}) => {
			let list = []
			for (let i of kon) {
				list.push({
					lisplayName: await karr.getName(i + '@s.whatsapp.net'),
					vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await karr.getName(i + '@s.whatsapp.net')}\nFN:${await karr.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
				})
			}
			return karr.sendMessage(jid, {
				contacts: {
					displayName: `${list.length} Kontak`,
					contacts: list
				},
				...opts
			}, {
				quoted
			})
		}
		karr.sendMessageFromContent = async (jid, message, options = {}) => {
			var option = {
				contextInfo: {},
				...options
			}
			var prepare = await generateWAMessageFromContent(jid, message, option)
			await karr.relayMessage(jid, prepare.message, {
				messageId: prepare.key.id
			})
			return prepare
		}

		function parseMention(text = '') {
			return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
		}

		karr.sendWithThumbnail = async (jid, options = {}, msg) => {
			const {
				text = '',
					title = '',
					body = '',
					thumbnailUrl,
					sourceUrl = ''
			} = options

			const thumbRes = await fetch(thumbnailUrl, {
				headers: {
					'User-Agent': 'Mozilla/5.0'
				}
			})

			const raw = Buffer.from(await thumbRes.arrayBuffer())

			const image = await Jimp.read(raw)

			image.scaleToFit({
				w: 1024,
				h: 576
			})

			const compressed = await image
				.getBuffer("image/jpeg", {
					quality: 90
				})

			const uploaded = await prepareWAMessageMedia({
				image: compressed
			}, {
				upload: karr.waUploadToServer,
				mediaTypeOverride: 'thumbnail-link'
			})

			const im = uploaded.imageMessage

			await karr.relayMessage(jid, {
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
					thumbnailWidth: image.bitmap.width || 1024
				}
			}, {
				messageId: generateMessageID()
			})
		}
		karr.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
			let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
			let buffer
			if (options && (options.packname || options.author)) {
				buffer = await writeExifImg(buff, options)
			} else {
				buffer = await imageToWebp(buff)
			}
			await karr.sendMessage(jid, {
					sticker: {
						url: buffer
					},
					...options
				}, {
					quoted
				})
				.then(response => {
					fs.unlinkSync(buffer)
					return response
				})
		}
		karr.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
			let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
			let buffer
			if (options && (options.packname || options.author)) {
				buffer = await writeExifVid(buff, options)
			} else {
				buffer = await videoToWebp(buff)
			}
			await karr.sendMessage(jid, {
					sticker: {
						url: buffer
					},
					...options
				}, {
					quoted
				})
				.then(response => {
					fs.unlinkSync(buffer)
					return response
				})
		}
		karr.downloadAndSaveMediaMessage = async (msg, type_file, path_file) => {
			if (type_file === 'image') {
				var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
				let buffer = Buffer.from([])
				for await (const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'video') {
				var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
				let buffer = Buffer.from([])
				for await (const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'sticker') {
				var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
				let buffer = Buffer.from([])
				for await (const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'audio') {
				var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
				let buffer = Buffer.from([])
				for await (const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			}
		}
	};

	ConnectToWhatsApp().catch(err => console.log(err));
}

WaConnect();