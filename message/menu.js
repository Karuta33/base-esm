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
> | ${prefix}speedtest [Speed bot]
> | ${prefix}ping [Check Bot]
> | ${prefix}cpu [Device info]
> | ${prefix}script [Script Bot]
> | ${prefix}play [Search Song]
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
> | ${prefix}qc [qc sticker]

*${ps}GROUP COMMAND${ps}*
> | ${prefix}kick [Remove member]
> | ${prefix}tagall [Tag all member]
> | ${prefix}accall [Acc join]
> | ${prefix}rejectall [Rej join]
> | ${prefix}delete [Delete msg]
> | ${prefix}promote [Promote member]
> | ${prefix}demote [Demote admin]
> | ${prefix}swgc [Status gc]
> | ${prefix}fitnah [Fitnah mem]
> | ${prefix}linkgrup [Link Group]

*${ps}RELIGI COMMAND${ps}*
> | ${prefix}quran [Get surah]
> | ${prefix}listsurah [List surah]
> | ${prefix}quranaudio [Audio suran]
> | ${prefix}kisahnabi [Kisah nabi]
> | ${prefix}randomdoa [Get doa]

`
await karr.sendWithThumbnail(from, { 
  text: mn, 
  title: 'Ashema Simple Bot', 
  body: '© Ashema Karuta', 
  thumbnailUrl: 'https://i.ibb.co/TMc3KT4h/187645ae0f10.jpg',
  sourceUrl: 'https://instagram.com/Yukishima3_' 
})
}