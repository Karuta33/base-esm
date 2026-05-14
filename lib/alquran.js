import { fetchJson } from "../lib/myfunc.js";
import axios from "axios"

export const allsurah = () => {
   return new Promise((resolve, reject) => {
     fetchJson('https://equran.id/api/surat')
     .then((data) => {
       let result = { status: 200, msg: "Succes!", result: [] }
       for (let i of data) {
         var option = { index: i.nomor, surah: i.nama, latin: i.nama_latin, jumlah_ayat: i.jumlah_ayat, wahyu: i.tempat_turun, arti: i.arti, desk: i.deskripsi, audio: i.audio }
         result.result.push(option)
       }
       resolve(result)
     }).catch((e) => {
       var data = { status: 404, msg: "Error!" }
       resolve(data)
     })
   })
}
export const getSurah = (surah, ayat) => {
   return new Promise((resolve, reject) => {
    if (ayat !== undefined) {
     fetchJson(`https://api.quran.sutanlab.id/surah/${surah}/${ayat}`)
     .then(async(data) => {
      if (data.code == 404) return resolve({ status: 404, msg: data.message.replace('Ayah', 'Ayat') })
       let result = {
         status: 200,
         msg: "Succes!",
         result: {
           index_surah: surah,
           surah: data.data.surah.name.short,
           surah_id: data.data.surah.name.transliteration.id,
           wahyu: data.data.surah.revelation.id,
           ayat: ayat,
           arab: data.data.text.arab,
           latin: data.data.text.transliteration.en,
           id: data.data.translation.id,
           en: data.data.translation.en,
           audio: data.data.audio.secondary[0]
         }
       }
       resolve(result)
     }).catch((err) => {
       resolve({ status: 404, msg: "Error!" })
       console.log(err)
     })
    } else {
     fetchJson(`https://api.quran.sutanlab.id/surah/${surah}`)
     .then(async(data) => {
      if (data.code == 404) return resolve({ status: 404, msg: data.message })
       var anu = (await exports.allsurah()).result[surah - 1]
       let result = {
         status: 200,
         msg: "Succes!",
         result: {
          index_surah: surah,
          surah: data.data.name.short,
          surah_id: data.data.name.transliteration.id,
          wahyu: data.data.revelation.id,
          total_ayat: anu.jumlah_ayat,
          audio: anu.audio,
          data: []
         }
       }
       for (let i of data.data.verses) {
         var opt = { index_ayat: i.number.inSurah, ayat: i.text.arab, latin: i.text.transliteration.en, id: i.translation.id, en: i.translation.en, audio: i.audio.secondary[0] }
         result.result.data.push(opt)
       }
       resolve(result)
     }).catch((err) => {
       resolve({ status: 404, msg: "Error!" })
       console.log(err)
     })
    }
   })
}
export const quranAudio = (no) => {
   return new Promise((resolve, reject) => {
     fetchJson('https://api.alquran.cloud/v1/ayah/'+no+'/ar.alafasy')
     .then((data) => {
       resolve(data)
     }).catch((e) => {
       resolve(data)
     })
   })
}
export const randomDoa = (no) => {
   return new Promise((resolve, reject) => {
     fetchJson('https://raw.githubusercontent.com/Kieza17/doa-harian/main/doa-harian/doa-harian.json')
     .then((data) => {
       resolve(data)
     }).catch((e) => {
       resolve(data)
     })
   })
}
export const surah = (nomor) => {
  return new Promise((resolve, reject) => {
        axios.get('https://equran.id/api/v2/surat/'+nomor).then(({data}) => {
            const result = {
                status: 200,
                ...data
            }
            resolve(result)
        }).catch(reject)
    })
}