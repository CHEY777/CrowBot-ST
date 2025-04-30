import axios from 'axios';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import fs from 'fs';
import { pipeline } from 'stream/promises';

const song = async (m, gss) => {
  const prefix = '.'; // Change to your actual prefix if different
  const body = m.body || '';
  
  if (!body.startsWith(`${prefix}song`)) return;

  const args = body.slice(prefix.length + 'song'.length).trim();
  
  if (!args) {
    return m.reply(`🎵 *Usage:* ${prefix}song <song name>\nExample: ${prefix}song Dynamite BTS`);
  }

  try {
    // Step 1: Search YouTube
    m.reply('🔍 Searching for your song...');
    const searchResults = await yts(args);
    
    if (!searchResults.videos.length) {
      return m.reply('❌ No results found. Try a different song name.');
    }

    const video = searchResults.videos[0];
    m.reply(`📥 Downloading: *${video.title}* (${video.timestamp})`);

    // Step 2: Download video
    const videoStream = ytdl(video.url, {
      quality: 'highest',
      filter: format => format.container === 'mp4'
    });

    // Step 3: Send video
    await gss.sendMessage(
      m.from,
      {
        video: { stream: videoStream },
        mimetype: 'video/mp4',
        caption: `🎬 *${video.title}*\n⏱️ Duration: ${video.timestamp}\n\n🔗 ${video.url}\n\nPowered by AnyaBot 🎵`
      },
      { quoted: m }
    );

  } catch (error) {
    console.error('Song error:', error);
    m.reply(`❌ Error: ${error.message}\nPlease try again later.`);
    
    // Fallback to API if direct download fails
    try {
      const apiUrl = `https://ytdl.raganork-api.xyz/?url=${encodeURIComponent(video.url)}`;
      const response = await axios.get(apiUrl);
      
      if (response.data?.downloadUrl) {
        await gss.sendMessage(
          m.from,
          {
            video: { url: response.data.downloadUrl },
            mimetype: 'video/mp4',
            caption: `🎬 *${video.title}* (API fallback)`
          },
          { quoted: m }
        );
      }
    } catch (apiError) {
      console.error('API fallback failed:', apiError);
    }
  }
};

export default song;
