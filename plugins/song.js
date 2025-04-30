import axios from "axios";
import yts from "yt-search";
import config from '../config.cjs';

const song = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");

  if (cmd === "song") {
    if (args.length === 0 || !args.join(" ")) {
      return m.reply("💖🌸✨ *Please provide a song name or keywords to search for~* 💞🎶🔍💖");
    }

    const searchQuery = args.join(" ");
    m.reply("💗🦋🔍 *Searching for your song sweetie...* 💝⏳🎧💗");

    try {
      const searchResults = await yts(searchQuery);
      if (!searchResults.videos || searchResults.videos.length === 0) {
        return m.reply(`💔😿 *Aww no results found for* "${searchQuery}". *Try another lovely song~* 💖🎵💞`);
      }

      const firstResult = searchResults.videos[0];
      const videoUrl = firstResult.url;

      const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${videoUrl}`;
      const response = await axios.get(apiUrl);

      if (!response.data.success) {
        return m.reply(`💔😖 *Oh no! Couldn't fetch* "${searchQuery}". *Maybe try again my love?* 💖🌈💝`);
      }

      const { title, download_url } = response.data.result;

      await gss.sendMessage(
        m.from,
        {
          video: { url: download_url },
          mimetype: "video/mp4",
          caption: `💖🎶✨ *${title}* ✨🎶💖\n\n💝🌸 *Powered By* ᥴꫝꫀꪗ-𝙎𝙖𝙣 🔮 *with lots of love~* 💖💕💘`,
        },
        { quoted: m }
      );

    } catch (error) {
      console.error(error);
      m.reply("💔😱 *Oh dear! Something went wrong...* 💖 *Try again sweetheart?* 💝🥺💗");
    }
  }
};

export default song;
