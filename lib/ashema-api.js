const BaseUrl = "https://ashema.my.id";
/* Free api no key no limit asal wajar */

/* ============================================================
   HELPER
   ============================================================ */

function buildResult(data) {
  return { status: 200, data };
}

function apiFetch(url) {
  return fetch(url)
    .then((r) => r.json())
    .then((data) => buildResult(data));
}

/* ============================================================
   MISC
   ============================================================ */

/** Tanya AI via WxGPT */
export function wxGpt(question) {
  return apiFetch(
    BaseUrl + "/d/misc/wxgpt?prompt=" + encodeURIComponent(question),
  );
}

/** Tanya AI via Gemini 3.1 Flash */
export function gemini(prompt) {
  return apiFetch(
    BaseUrl + "/d/misc/gemini-3.1-flash?prompt=" + encodeURIComponent(prompt),
  );
}

/** Ambil berita terbaru dari Kompas (misc) */
export function kompasNews() {
  return apiFetch(BaseUrl + "/d/misc/kompas");
}

/* ============================================================
   FETCHER  –  ambil detail / download dari URL
   ============================================================ */

/** Download TikTok (tanpa watermark) */
export function TikTokDL(url) {
  return apiFetch(BaseUrl + "/d/fetcher/tiktok?url=" + encodeURIComponent(url));
}

/** Download Spotify track */
export function SpotifyDL(link) {
  return apiFetch(
    BaseUrl + "/d/fetcher/spotify?url=" + encodeURIComponent(link),
  );
}

/** Download SoundCloud track */
export function SoundCloudDL(url) {
  return apiFetch(
    BaseUrl + "/d/fetcher/soundcloud?url=" + encodeURIComponent(url),
  );
}

/** Download semua (YouTube, dll) via yt-dlp */
export function DownAll(link) {
  return fetch(
    "https://api-ytdlp.vercel.app/info?url=" + encodeURIComponent(link),
  )
    .then((r) => r.json())
    .then((data) => buildResult(data));
}

/** Fetch halaman beranda / daftar anime Anichin */
export function AnichinList() {
  return apiFetch(BaseUrl + "/d/fetcher/anichin");
}

/** Fetch detail episode Anichin dari URL episode */
export function AnichinEps(url) {
  return apiFetch(
    BaseUrl + "/d/fetcher/anichin_eps?url=" + encodeURIComponent(url),
  );
}

/** Fetch daftar / beranda LK21 */
export function LK21List() {
  return apiFetch(BaseUrl + "/d/fetcher/lk21");
}

/** Fetch detail manga Samehada dari URL */
export function SamehadaDetail(url) {
  return apiFetch(
    BaseUrl + "/d/fetcher/samehada?url=" + encodeURIComponent(url),
  );
}

/** Fetch halaman chapter Samehada dari URL chapter */
export function SamehadaChapter(url) {
  return apiFetch(
    BaseUrl + "/d/fetcher/samehada_chp?url=" + encodeURIComponent(url),
  );
}

/** Fetch detail manga Shinigami dari URL */
export function ShinigamiDetail(url) {
  return apiFetch(
    BaseUrl + "/d/fetcher/shinigami?url=" + encodeURIComponent(url),
  );
}

/** Fetch halaman chapter Shinigami dari URL chapter */
export function ShinigamiChapter(url) {
  return apiFetch(
    BaseUrl + "/d/fetcher/shinigami_chp?url=" + encodeURIComponent(url),
  );
}

/** Fetch detail Webtoon dari URL */
export function WebtoonDetail(url) {
  return apiFetch(
    BaseUrl + "/d/fetcher/webtoon?url=" + encodeURIComponent(url),
  );
}

/** Fetch chapter Webtoon dari URL chapter */
export function WebtoonChapter(url) {
  return apiFetch(
    BaseUrl + "/d/fetcher/webtoon_chp?url=" + encodeURIComponent(url),
  );
}

/** Fetch info aplikasi Uptodown dari URL */
export function UptodownDetail(url) {
  return apiFetch(
    BaseUrl + "/d/fetcher/uptodown?url=" + encodeURIComponent(url),
  );
}

/** Fetch lowongan kerja Glints dari URL */
export function GlintsFetch(url) {
  return apiFetch(BaseUrl + "/d/fetcher/glints?url=" + encodeURIComponent(url));
}

/** Fetch berita Kompas dari URL artikel */
export function KompasFetch(url) {
  return apiFetch(BaseUrl + "/d/fetcher/kompas?url=" + encodeURIComponent(url));
}

/** Generic URL fetcher */
export function fetchUrl(url) {
  return apiFetch(BaseUrl + "/d/fetcher/fetch?url=" + encodeURIComponent(url));
}

/* ============================================================
   FINDER  –  cari / search
   ============================================================ */

/** Cari anime di Anichin */
export function AnichinSearch(query) {
  return apiFetch(BaseUrl + "/d/finder/anichin?q=" + encodeURIComponent(query));
}

/** Cari video di Bilibili/BStation */
export function BStationSearch(query) {
  return apiFetch(
    BaseUrl + "/d/finder/bstation?q=" + encodeURIComponent(query),
  );
}

/** Cari template CapCut */
export function CapCutSearch(query) {
  return apiFetch(BaseUrl + "/d/finder/capcut?q=" + encodeURIComponent(query));
}

/** Cari lowongan kerja di Glints */
export function GlintsSearch(query) {
  return apiFetch(BaseUrl + "/d/finder/glints?q=" + encodeURIComponent(query));
}

/** Cari spesifikasi HP di GSMArena */
export function GSMArenaSearch(query) {
  return apiFetch(
    BaseUrl + "/d/finder/gsmarena?q=" + encodeURIComponent(query),
  );
}

/** Cari artikel di Kompas */
export function KompasSearch(query) {
  return apiFetch(BaseUrl + "/d/finder/kompas?q=" + encodeURIComponent(query));
}

/** Cari film di LK21 */
export function LK21Search(query) {
  return apiFetch(BaseUrl + "/d/finder/lk21?q=" + encodeURIComponent(query));
}

/** Cari gambar di Pinterest */
export function Pinterest(query) {
  return apiFetch(
    BaseUrl + "/d/finder/pinterest?q=" + encodeURIComponent(query),
  );
}

/** Cari aplikasi di Play Store */
export function PlayStoreSearch(query) {
  return apiFetch(
    BaseUrl + "/d/finder/playstore?q=" + encodeURIComponent(query),
  );
}

/** Cari manga di Samehada */
export function SamehadaSearch(query) {
  return apiFetch(
    BaseUrl + "/d/finder/samehada?q=" + encodeURIComponent(query),
  );
}

/** Cari manga di Shinigami */
export function ShinigamiSearch(query) {
  return apiFetch(
    BaseUrl + "/d/finder/shinigami?q=" + encodeURIComponent(query),
  );
}

/** Cari lagu di SoundCloud */
export function SoundCloudSearch(query) {
  return apiFetch(
    BaseUrl + "/d/finder/soundcloud?q=" + encodeURIComponent(query),
  );
}

/** Cari lagu/artist di Spotify */
export function SpotifySearch(query) {
  return apiFetch(BaseUrl + "/d/finder/spotify?q=" + encodeURIComponent(query));
}

/** Cari nomor telepon via TrueCaller */
export function TrueCaller(query) {
  return apiFetch(
    BaseUrl + "/d/finder/truecaller?q=" + encodeURIComponent(query),
  );
}

/** Cari aplikasi di Uptodown */
export function UptodownSearch(query) {
  return apiFetch(
    BaseUrl + "/d/finder/uptodown?q=" + encodeURIComponent(query),
  );
}

/** Cari webtoon */
export function WebtoonSearch(query) {
  return apiFetch(BaseUrl + "/d/finder/webtoon?q=" + encodeURIComponent(query));
}

/** Cari sticker */
export function StickerSearch(query) {
  return apiFetch(BaseUrl + "/d/tools/sticker?q=" + encodeURIComponent(query));
}

/* ============================================================
   VIEWER  –  lihat profil / data akun
   ============================================================ */

/** Stalk profil Instagram via username */
export function igStalk(username) {
  return apiFetch(
    BaseUrl + "/d/finder/igstalk?username=" + encodeURIComponent(username),
  );
}

/** Lihat konten Instagram dari URL post/reel/story */
export function igViewer(url) {
  return apiFetch(
    BaseUrl + "/d/viewer/instagram?url=" + encodeURIComponent(url),
  );
}

/* ============================================================
   TOOLS  –  fitur interaktif
   ============================================================ */

/** Tes kepribadian MBTI 16Personalities (60 soal) */
export class Mbti16Personalities {
  constructor() {
    this.apiUrl = BaseUrl + "/d/tools/mbti";
    this.sessions = new Map();
    this.questionsTemplate = null;
  }

  hasSession(id) {
    return this.sessions.has(id);
  }

  getStep(id) {
    const session = this.sessions.get(id);
    return session ? session.step : 0;
  }

  deleteSession(id) {
    this.sessions.delete(id);
  }

  async _initSession(id) {
    const session = this.sessions.get(id);
    if (!session) return;

    try {
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getQuestion" }),
      });
      const data = await res.json();
      this.questionsTemplate = data.result;

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "init" }),
      });
      const result = await response.json();

      if (result.success) {
        session.cookieString = result.result.cookieString;
        session.csrfToken = result.result.csrfToken;
      }
    } catch (error) {
      console.error("Gagal inisiasi sesi dari API:", error);
    }
  }

  async start(id, gender = "Male") {
    this.sessions.set(id, {
      answers: [],
      step: 0,
      cookieString: "",
      csrfToken: "",
      email: `mbti_${id.replace(/[^0-9]/g, "") || Date.now()}@gmail.com`,
      gender,
    });
    await this._initSession(id);
  }

  answer(id, value) {
    const session = this.sessions.get(id);
    if (!session)
      throw new Error("Sesi tidak ditemukan. Silahkan mulai tes baru.");
    if (value < -3 || value > 3)
      throw new Error("Jawaban harus antara -3 hingga 3.");
    session.answers.push(value);
    session.step++;
  }

  async submit(id) {
    const session = this.sessions.get(id);
    if (!session) throw new Error("Sesi tidak ditemukan.");
    if (session.answers.length !== 60)
      throw new Error(
        `Jawaban belum lengkap! Baru ${session.answers.length} dari 60.`,
      );

    try {
      const formattedQuestions = this.questionsTemplate.map((text, index) => ({
        text,
        answer: session.answers[index],
        index,
      }));

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          questions: formattedQuestions,
          email: session.email,
          gender: session.gender,
          csrfToken: session.csrfToken,
          cookieString: session.cookieString,
        }),
      });

      const result = await response.json();
      if (!result.success)
        throw new Error(result.error || "Gagal memproses hasil MBTI di API.");

      this.deleteSession(id);
      return { success: true, url: result.result.url, raw: result.result.raw };
    } catch (error) {
      throw new Error(`MBTI_ENGINE_ERROR: ${error.message}`);
    }
  }
}

/** Game tebak karakter Akinator */
export class Akinator {
  constructor(config = { region: "id", childMode: false }) {
    this.apiUrl = BaseUrl + "/d/tools/akinator";
    this.region = config.region || "id";
    this.childMode = config.childMode || false;

    this.session = null;
    this.signature = null;
    this.step = 0;
    this.progress = 0;
    this.question = null;
    this.isWin = false;
    this.sugestion_name = null;
    this.sugestion_desc = null;
    this.sugestion_photo = null;
  }

  async start() {
    try {
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          region: this.region,
          childMode: this.childMode,
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      this.session = result.data.session;
      this.signature = result.data.signature;
      this.question = result.data.question;
      this.step = 0;
      this.progress = 0;
      this.isWin = false;

      return this;
    } catch (e) {
      throw new Error(`Gagal memulai sesi: ${e.message}`);
    }
  }

  async answer(ansId) {
    try {
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "answer",
          region: this.region,
          childMode: this.childMode,
          step: this.step,
          progress: this.progress,
          session: this.session,
          signature: this.signature,
          ansId,
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      const data = result.data;
      if (data.isWin) {
        this.isWin = true;
        this.sugestion_name = data.suggestion.name;
        this.sugestion_desc = data.suggestion.desc;
        this.sugestion_photo = data.suggestion.photo;
      } else {
        this.step = data.step;
        this.progress = data.progress;
        this.question = data.question;
      }

      return this;
    } catch (e) {
      throw new Error(`Gagal mengirim jawaban: ${e.message}`);
    }
  }
}
export async function uploadToImgBB(imageBuffer, options = {}) {
  const { expiration } = options;
  const ua =
    "Mozilla/5.0 (Linux; Android 16; Infinix X6837 Build/BP2A.250605.031.A2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.215 Mobile Safari/537.36";

  const homeRes = await fetch("https://imgbb.com/", {
    headers: { "User-Agent": ua },
  });
  if (!homeRes.ok) throw new Error(`Home HTTP Error: ${homeRes.status}`);

  const html = await homeRes.text();
  const tokenMatch = html.match(/auth_token\s*=\s*"([a-f0-9]+)"/);
  if (!tokenMatch) throw new Error("Failed to extract auth_token");
  const authToken = tokenMatch[1];

  const cookieHeader = homeRes.headers.get("set-cookie") || "";
  const phpSessIdMatch = cookieHeader.match(/PHPSESSID=([^;]+)/);
  const phpSessId = phpSessIdMatch ? phpSessIdMatch[1] : "";

  const data = new FormData();
  data.append("source", new Blob([imageBuffer]), "image.jpg");
  data.append("type", "file");
  data.append("action", "upload");
  data.append("timestamp", Date.now().toString());
  data.append("auth_token", authToken);
  if (expiration) data.append("expiration", expiration);

  const uploadRes = await fetch("https://imgbb.com/json", {
    method: "POST",
    headers: {
      "User-Agent": ua,
      Accept: "application/json",
      origin: "https://imgbb.com",
      referer: "https://imgbb.com/",
      Cookie: phpSessId ? `PHPSESSID=${phpSessId}` : "",
    },
    body: data,
  });

  if (!uploadRes.ok) throw new Error(`Upload HTTP Error: ${uploadRes.status}`);
  return await uploadRes.json();
}
