import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const audioFormats = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const videoFormats = ['360', '480', '720', '1080', '1440', '4k'];

const ddownr = {
  download: async (url, format) => {
    if (!audioFormats.includes(format) && !videoFormats.includes(format)) {
      throw new Error('Unsupported format. Please check the list of available formats.');
    }

    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    try {
      const response = await axios.request(config);

      if (response.data && response.data.success) {
        const { id, title, info } = response.data;
        const { image } = info;
        const downloadUrl = await ddownr.checkProgress(id);

        return {
          id,
          image,
          title,
          downloadUrl
        };
      } else {
        throw new Error('Failed to get video details.');
      }
    } catch (error) {
      console.error('Download Error:', error);
      throw error;
    }
  },

  checkProgress: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    try {
      while (true) {
        const response = await axios.request(config);

        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Progress Error:', error);
      throw error;
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `✎ Please enter the name of the song to download.`, m);
    }

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('No results found for your search.');
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const formattedViews = formatViews(views);
    const infoMessage = `「✦」Downloading *${title}*\n\n> ✦Channel:  *${videoInfo.author.name || 'Unknown'}*\n> ✰ Views:  *${formattedViews}*\n> ⴵ Duration: *${timestamp}*\n> ✐ Published: *${ago}*\n> 🜸 Link: ${url}\n`;
    const thumb = (await conn.getFile(thumbnail))?.data;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: packname,
          body: dev,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };

    await conn.reply(m.chat, infoMessage, m, JT);

    if (['play', 'yta', 'mp3'].includes(command)) {
      const api = await ddownr.download(url, 'mp3');  // normal mp3 quality
      const result = api.downloadUrl;
      await conn.sendMessage(m.chat, { audio: { url: result }, mimetype: "audio/mpeg" }, { quoted: m });

    } else if (['play2', 'ytv', 'mp4'].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const { data, result, downloads } = await res.json();
          let downloadUrl = data?.dl || result?.download?.url || downloads?.url || data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: 'video/mp4',
              caption: `✎ Here is your video`,
              thumbnail: thumb
            }, { quoted: m });
            break;
          }
        } catch (e) {
          console.error(`Error from source ${source}:`, e.message);
        }
      }

      if (!success) {
        return m.reply(`✱ *Unable to download video:* No valid download link found.`);
      }
    } else {
      throw new Error("Unrecognized command.");
    }
  } catch (error) {
    return m.reply(`𓁏 *Error:* ${error.message}`);
  }
};

handler.command = handler.help = ['play', 'play2', 'mp3', 'yta', 'mp4', 'ytv'];
handler.tags = ['downloader'];

export default handler;

function formatViews(views) {
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'k (' + views.toLocaleString() + ')';
  } else {
    return views.toString();
  }
}
