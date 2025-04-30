//Code created by chey wa.me/918116781147

import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    
    // Check if someone is mentioned or a message is quoted
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    m.react('👋');

    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` hello \`${name || who}\`, how are you?`;
    } else if (m.quoted) {
        str = `\`${name2}\` hello \`${name || who}\`, how are you feeling today?`;
    } else {
        str = `\`${name2}\` greetings to everyone in the group, how are you all doing?`.trim();
    }
    
    if (m.isGroup) {
        let pp = 'https://qu.ax/EcRBE.mp4'; 
        let pp2 = 'https://qu.ax/oARle.mp4'; 
        let pp3 = 'https://qu.ax/eQXQh.mp4';
        let pp4 = 'https://qu.ax/ddLrC.mp4';
        let pp5 = 'https://qu.ax/oalOG.mp4';
        let pp6 = 'https://qu.ax/nYJ.mp4';
        let pp7 = 'https://qu.ax/bkcz.mp4';
        let pp8 = 'https://qu.ax/oARle.mp4';
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8];
        const video = videos[Math.floor(Math.random() * videos.length)];

        const mentions = [who];
        
        // Send video greeting message
        await conn.sendMessage(m.chat, {
            video: { url: video },
            gifPlayback: true,
            caption: str,
            mentions
        }, { quoted: m });

        // Send voice menu audio
        await conn.sendMessage(m.chat, {
            audio: {
                url: 'https://github.com/CHEY777/CHEY-DATA/raw/refs/heads/main/autovoice/menunew.m4a'
            },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: m });
    }
}

handler.help = ['hello/hola @tag'];
handler.tags = ['emox'];
handler.command = ['hello', 'hola'];
handler.group = true;

export default handler;
