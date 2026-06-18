import pcg from "../package.json" with { type: "json" };
import { makeid } from "../lib/myfunc.js";
export default async (
  ucapanWaktu,
  janghar,
  jangwak,
  pushname,
  karr,
  from,
  prefix,
  msg,
) => {
  let ps = "`";
  let mn = `
👋🏻 ${ucapanWaktu} ${pushname}

${janghar} ${jangwak}
Fitur bot : ${karr.allfitur()}
Versi Bot : ${pcg.version}
Total Module : ${Object.keys(pcg.dependencies).length}

*${ps}FUN COMMAND${ps}*
> | ${prefix}akinator [Game akinator]
> | ${prefix}tes-mbti [Test Mbti]

*${ps}MAIN COMMAND${ps}*
> | ${prefix}menu [Menu bot]
> | ${prefix}speedtest [Speed bot]
> | ${prefix}ping [Check Bot]
> | ${prefix}cpu [Device info]
> | ${prefix}script [Script Bot]
> | ${prefix}play [Search Song]
> | ${prefix}ai [Ai]
> | ${prefix}cdnwa [To Url]

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
> | ${prefix}iqc [iqc image]

*${ps}GROUP MANAGEMENT${ps}*
> | ${prefix}kick [Remove member]
> | ${prefix}tagall [Tag all member]
> | ${prefix}accall [Acc join]
> | ${prefix}rejectall [Rej join]
> | ${prefix}delete [Delete msg]
> | ${prefix}promote [Promote member]
> | ${prefix}demote [Demote admin]
> | ${prefix}listadmin [Daftar admin]
> | ${prefix}swgc [Status gc]
> | ${prefix}fitnah [Fitnah mem]
> | ${prefix}linkgrup [Link Group]
> | ${prefix}group [Buka/tutup grup]
> | ${prefix}welcome [On/off welcome]
> | ${prefix}setwelcome [Set sambutan]
> | ${prefix}setleft [Set perpisahan]
> | ${prefix}mutebot [Mute bot]
> | ${prefix}mute [Mute member]
> | ${prefix}unmute [Unmute member]
> | ${prefix}mutelist [Daftar mute]
> | ${prefix}antilink [Anti link]
> | ${prefix}antitagsw [Anti tag SW]
> | ${prefix}afk [Mode AFK]
> | ${prefix}warn [Warn member]
> | ${prefix}unwarn [Unwarn member]
> | ${prefix}resetwarn [Reset warn]
> | ${prefix}warnlist [Daftar warn]
> | ${prefix}setwarnlimit [Limit warn]
> | ${prefix}setopen [Auto buka gc]
> | ${prefix}setclose [Auto tutup gc]
> | ${prefix}delopen [Hapus auto buka]
> | ${prefix}delclose [Hapus auto tutup]
> | ${prefix}jadwal [Jadwal grup]

*${ps}OWNER COMMAND${ps}*
> | ${prefix}addcase [Tambah case]
> | ${prefix}delcase [Hapus case]
> | ${prefix}getcase [Ambil case]
> | ${prefix}getfunction [Ambil fungsi]
> | ${prefix}cleartmp [Bersihkan tmp]
> | ${prefix}restart [Restart bot]
> | ${prefix}backup [Backup bot]
> | ${prefix}onlygc [Khusus grup]
> | ${prefix}autoclear [Auto clear tmp]
> | ${prefix}setname [Set nama bot]
> | ${prefix}setbio [Set bio bot]
> | ${prefix}setppbot [Set PP bot]
> | ${prefix}getsession [Ambil sesi]
> | ${prefix}clearsession [Hapus sesi]

*${ps}RELIGI COMMAND${ps}*
> | ${prefix}quran [Get surah]
> | ${prefix}listsurah [List surah]
> | ${prefix}quranaudio [Audio suran]
> | ${prefix}kisahnabi [Kisah nabi]
> | ${prefix}randomdoa [Get doa]

`;
  await karr.sendWithThumbnail(from, {
    text: mn,
    title: "Ashema Simple Bot",
    body: "© Ashema Karuta",
    thumbnailUrl:
      "https://raw.githubusercontent.com/AzumiMiCucu/dbdb/refs/heads/main/187645ae0f10.jpg",
    sourceUrl: "https://www.ashema.my.id",
  });
};
