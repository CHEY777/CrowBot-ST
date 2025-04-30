import axios from "axios";
import yts from "yt-search";
import config from '../config.cjs';

const song = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");
  
  if (cmd !== 'song') return;

  if (args.length === 0 || !args.join(" ")) {
    return m.reply("💖🌸✨ *Please provide a song name or keywords to search for~* 💞🎶🔍💖");
  }

  const searchQuery = args.join(" ");
  m.reply("💗🦋🔍 *Searching for your song sweetie...* 💝⏳🎧💗");

  try {
    const search = await yts(searchQuery);
    if (!search.videos || search.videos.length === 0) {
      return m.reply(`💔😿 *Aww no results found for* "${searchQuery}". *Try another lovely song~* 💖🎵💞`);
    }

    const video = search.videos[0];
    const url = video.url;

    const sources = [
      `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
      `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
      `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
      `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
    ];

    let videoLink;
    for (const src of sources) {
      try {
        const res = await axios.get(src);
        const json = res.data;
        videoLink = json.data?.dl || json.result?.download?.url || json.downloads?.url || json.data?.download?.url;
        if (videoLink) break;
      } catch (e) {
        console.error(`Error from source ${src}:`, e.message);
      }
    }

    if (!videoLink) {
      return m.reply("💔😿 *Couldn't fetch video, try again later sweetie!*");
    }

    await gss.sendMessage(
      m.from,
      {
        video: { url: videoLink },
        mimetype: "video/mp4",
        caption: `💖🎥 *Here you go love!* ${video.title}`,
      },
      { quoted: m }
    );

  } catch (error) {
    console.error(error);
    m.reply("💔😱 *Oops! Something went wrong. Try again darling.*");
  }
};

export default song;
