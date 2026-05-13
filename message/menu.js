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
> | ${prefix}menu
> | ${prefix}ping
> | ${prefix}cpu
> | ${prefix}ai

*${ps}DOWNLOADER COMMAND${ps}*
> | ${prefix}ttdl [TikTok]
> | ${prefix}igdl [Instagram]
> | ${prefix}fbdl [Facebook]
> | ${prefix}thdl [Threads]
> | ${prefix}xdl [Twitter]
> | ${prefix}spotifydl [Spotify]
> | ${prefix}ytdl [Youtube]
`
await karr.sendMessage(from, { text: mn }, { quoted: msg, messageId: 'KARUTA_' + makeid(9).toUpperCase() })
}