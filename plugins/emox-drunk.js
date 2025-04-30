//Code created by chey wa.me/918116781147

import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;

    // Check if someone is mentioned or a message is quoted
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]; // If there's a mention, use that
    } else if (m.quoted) {
        who = m.quoted.sender; // If a message is quoted, use its sender
    } else {
        who = m.sender; // Otherwise, use the message sender
    }

    let name = conn.getName(who); // Name of the mentioned person or sender
    let name2 = conn.getName(m.sender); // Name of the user sending the command
    m.react('🍺');

    // Build the message depending on the context
    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` is drinking with \`${name || who}\`.`;
    } else if (m.quoted) {
        str = `\`${name2}\` got drunk together with \`${name || who}\`.`;
    } else {
        str = `\`${name2}\` is very drunk.`.trim();
    }
    
    if (m.isGroup) {
        let pp = 'https://qu.ax/VPXAF.mp4'; 
        let pp2 = 'https://qu.ax/JJwdG.mp4'; 
        let pp3 = 'https://qu.ax/BHgcX.mp4';
        let pp4 = 'https://qu.ax/SmJNk.mp4';
        let pp5 = 'https://qu.ax/bLUOB.mp4';
        let pp6 = 'https://qu.ax/mDURZ.mp4';
        let pp7 = 'https://qu.ax/KTFrC.mp4';
        let pp8 = 'https://qu.ax/blVqp.mp4';
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8];
        const video = videos[Math.floor(Math.random() * videos.length)];
        
        // Send the video with the message
        let mentions = [who];
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions }, { quoted: m });
    }
}

handler.help = ['drunk/borracho @tag'];
handler.tags = ['emox'];
handler.command = ['drunk', 'borracho'];
handler.group = true;

export default handler;
