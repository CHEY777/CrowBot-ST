// By WillZek >> https://github.com/CheySan

import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return m.reply(`🍭 Please enter a search term for YouTube.\n> *Example:* ${usedPrefix + command} crow edits`);
    }

    try {
        // YouTube Search API
        let api = await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`);
        let res = await api.json();

        if (!res?.data?.length) throw new Error('No results found');

        let result = res.data[0];

        let caption = `✨ *Title:* ${result.title}\n⌛ *Duration:* ${result.duration}\n📎 *Link:* ${result.url}\n📆 *Published:* ${result.publishedAt}`;
        let thumb = result.image;

        // Send video thumbnail and info
        await conn.sendMessage(m.chat, {
            image: { url: thumb },
            caption: caption
        }, { quoted: m });

        // Fetch MP3 download link
        let dl = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(result.url)}`);
        let mp3 = await dl.json();

        if (!mp3?.result?.download?.url) {
            throw new Error('Could not retrieve audio');
        }

        // Send MP3 audio
        await conn.sendMessage(m.chat, {
            audio: { url: mp3.result.download.url },
            mimetype: 'audio/mpeg'
        }, { quoted: m });

    } catch (e) {
        m.reply(`*Could not find results for your search.*\nReason: ${e.message}`);
        await m.react('✖️');
    }
};

handler.command = ['play', 'paudio'];
handler.help = ['play <text>'];
handler.tags = ['downloader'];

export default handler;
