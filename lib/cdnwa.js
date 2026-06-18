import { prepareWAMessageMedia } from "@whiskeysockets/baileys";

export async function toUrl(_client, path, mediaType = "document") {
  if (!path) throw new Error("Url or buffer needed");

  const media = await prepareWAMessageMedia(
    {
      [mediaType]: Buffer.isBuffer(path) ? path : { url: path },
    },
    {
      upload: _client.waUploadToServer,
      jid: "\u0040\u006e\u0065\u0077\u0073\u006c\u0065\u0074\u0074\u0065\u0072",
    },
  );

  return Object.values(media)[0]?.url;
}
export async function resolveMedia(
  _client,
  media,
  mediaType = "image",
  {
    resolveUrl = false,
    resolveWAUrl = false,
    result = "url",
    resize = false,
    width = 300,
    height = 300,
  } = {},
) {
  const isUrl = (str) => /^https?:\/\/.+/i.test(str);
  const isWAUrl = (str) => /^https?:\/\/[^/]*\.whatsapp\.net\//i.test(str);

  if (Array.isArray(media)) {
    return Promise.all(
      media.map((item) =>
        resolveMedia(_client, item, mediaType, {
          resolveUrl,
          resolveWAUrl,
          result,
          resize,
          width,
          height,
        }),
      ),
    );
  }

  const originalIsBuffer = Buffer.isBuffer(media);

  if (typeof media === "string" && isUrl(media)) {
    if (isWAUrl(media)) {
      if (resolveWAUrl) {
        media = await fetchBuffer(media, {}, { silent: true });
      } else if (!resolveUrl) {
        if (result === "url") return media;
        media = await fetchBuffer(media, {}, { silent: true });
      }
    } else {
      if (!resolveUrl) {
        if (result === "url") return media;
        media = await fetchBuffer(media, {}, { silent: true });
      } else {
        media = await fetchBuffer(media, {}, { silent: true });
      }
    }
  }

  if (typeof media === "string" && !isUrl(media)) {
    media = Buffer.from(media, "base64");
  }

  if (!Buffer.isBuffer(media) || !media.length) {
    return;
  }

  if (resize && Buffer.isBuffer(media)) {
    media = await resizeMedia(media, width, height);
  }

  if (result === "buffer") return media;
  if (result === "base64") return media.toString("base64");

  return toUrl(_client, media, mediaType);
}
async function fetchBuffer(url, headers = {}, { silent = false } = {}) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    if (!silent) throw err;
  }
}
async function resizeMedia(buffer, width, height) {
  const sharp = (await import("sharp")).default;
  return sharp(buffer).resize(width, height).toBuffer();
}
