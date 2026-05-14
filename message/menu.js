import pcg from '../package.json' with { type: 'json' };
import { makeid } from "../lib/myfunc.js";
export default async (ucapanWaktu, janghar, jangwak, pushname, karr, from, prefix, msg) => {
let ps = '`'
let mn =`
👋🏻 ${ucapanWaktu} ${pushname}

${janghar} ${jangwak}
Fitur bot : ${karr.allfitur()}
Versi Bot : ${pcg.version}
Total Module : ${Object.keys(pcg.dependencies).length}

*${ps}MAIN COMMAND${ps}*
> | ${prefix}menu [Menu bot]
> | ${prefix}ping [Check Bot]
> | ${prefix}cpu [Device info]
> | ${prefix}ai [Ai]

*${ps}DOWNLOADER COMMAND${ps}*
> | ${prefix}ttdl [TikTok]
> | ${prefix}igdl [Instagram]
> | ${prefix}fbdl [Facebook]
> | ${prefix}thdl [Threads]
> | ${prefix}xdl [Twitter]
> | ${prefix}spotifydl [Spotify]
> | ${prefix}ytdl [Youtube]

*${ps}CONVERTER COMMAND${ps}*
> | ${prefix}stiker [Make sticker]
> | ${prefix}toimg [Stikcter to img]
> | ${prefix}tovid [Sticker to vid]
> | ${prefix}smeme [Meme sticker]
> | ${prefix}swm [Take sticker]

*${ps}GROUP COMMAND${ps}*
> | ${prefix}kick [Remove member]
> | ${prefix}tagall [Tag all member]
> | ${prefix}accall [Acc join]
> | ${prefix}rejectall [Rej join]
> | ${prefix}delete [Delete msg]
> | ${prefix}listadmin [List admin]
> | ${prefix}promote [Promote member]
> | ${prefix}demote [Demote admin]
> | ${prefix}swgc [Status gc]
> | ${prefix}fitnah [Fitnah mem]
`
await karr.sendMessage(from, { text: mn }, { quoted: msg, messageId: 'KARUTA_' + makeid(9).toUpperCase() })
}