// Code created by chey wa.me/918116781147

import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    
    // Check if someone is mentioned or if a message is quoted
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]; // If there's a mention, use that
    } else if (m.quoted) {
        who = m.quoted.sender; // If a message is quoted, use the sender of that message
    } else {
        who = m.sender; // Otherwise, use the sender of the message
    }

    let name = conn.getName(who); // Get the name of the mentioned person or the sender
    let name2 = conn.getName(m.sender); // Get the name of the user sending the command
    m.react('🫂');

    // Construct the message depending on whether there's a mention or not
    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` gave a big hug to \`${name || who}\`.`; // Use scheduled name or number if not saved
    } else if (m.quoted) {
        str = `\`${name2}\` hugged \`${name || who}\`.`; // Message when quoting another user
    } else {
        str = `\`${name2}\` hugged themselves`.trim();
    }
    
    if (m.isGroup) {
        let pp = 'https://telegra.ph/file/6a3aa01fabb95e3558eec.mp4'; 
        let pp2 = 'https://telegra.ph/file/0e5b24907be34da0cbe84.mp4'; 
        let pp3 = 'https://telegra.ph/file/6bc3cd10684f036e541ed.mp4';
        let pp4 = 'https://telegra.ph/file/3e443a3363a90906220d8.mp4';
        let pp5 = 'https://telegra.ph/file/56d886660696365f9696b.mp4';
        let pp6 = 'https://telegra.ph/file/3eeadd9d69653803b33c6.mp4';
        let pp7 = 'https://telegra.ph/file/436624e53c5f041bfd597.mp4';
        let pp8 = 'https://telegra.ph/file/5866f0929bf0c8fe6a909.mp4';
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8];
        const video = videos[Math.floor(Math.random() * videos.length)];
        
        // Send the message with the video and the corresponding text
        let mentions = [who]; // Mention the user that was cited or mentioned
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions }, { quoted: m });
    }
}

handler.help = ['hug/abrazar @tag'];
handler.tags = ['emox'];
handler.command = ['hug', 'abrazar'];
handler.group = true;

export default handler;
