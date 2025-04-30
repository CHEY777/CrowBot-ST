//Code created by chey wa.me/918116781147

import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    
    // Check if someone is mentioned or a message is quoted
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]; // If someone is mentioned, use them
    } else if (m.quoted) {
        who = m.quoted.sender; // If a message is quoted, use the sender of that message
    } else {
        who = m.sender; // Otherwise, use the sender
    }

    let name = conn.getName(who); // Name of the mentioned person or sender
    let name2 = conn.getName(m.sender); // Name of the user who sends the command
    m.react('👋');

    // Build the message depending on whether someone is mentioned or not
    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` hello \`${name || who}\`, how are you?`; // Use saved name or number
    } else if (m.quoted) {
        str = `\`${name2}\` hello \`${name || who}\`, how are you feeling today?`; // Message when quoting another user
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
        
        // Send the message with the selected video and message
        let mentions = [who]; // Mention the user who was tagged or quoted
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions }, { quoted: m });
    }
}

handler.help = ['hello/hola @tag'];
handler.tags = ['emox'];
handler.command = ['hello','hola'];
handler.group = true;

export default handler;
