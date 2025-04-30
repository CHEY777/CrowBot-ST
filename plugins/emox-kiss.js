//Code created by WillZek wa.me/50557865603

import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    
    // Check if someone is mentioned or a message is quoted
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]; // If there's a mention, use it
    } else if (m.quoted) {
        who = m.quoted.sender; // If a message is quoted, use the sender of that message
    } else {
        who = m.sender; // Otherwise, use the command sender
    }

    let name = conn.getName(who); // Name of the mentioned person or sender
    let name2 = conn.getName(m.sender); // Name of the user who sent the command
    m.react('🫦');

    // Build the message depending on whether there is a mention or not
    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` gave a kiss to \`${name || who}\` ( ˘ ³˘)♥.`; // Use contact name or number
    } else if (m.quoted) {
        str = `\`${name2}\` kissed \`${name || who}\` 🫦.`; // Message when quoting another user
    } else {
        str = `\`${name2}\` kissed themselves ( ˘ ³˘)♥`.trim();
    }
    
    if (m.isGroup) {
        let pp1 = 'https://telegra.ph/file/d6ece99b5011aedd359e8.mp4';
        let pp2 = 'https://telegra.ph/file/d6ece99b5011aedd359e8.mp4';
        let pp3 = 'https://telegra.ph/file/ba841c699e9e039deadb3.mp4';
        let pp4 = 'https://telegra.ph/file/ba841c699e9e039deadb3.mp4';
        let pp5 = 'https://telegra.ph/file/6497758a122357bc5bbb7.mp4';
        let pp6 = 'https://telegra.ph/file/6497758a122357bc5bbb7.mp4';
        let pp7 = 'https://telegra.ph/file/8c0f70ed2bfd95a125993.mp4';
        let pp8 = 'https://telegra.ph/file/8c0f70ed2bfd95a125993.mp4';
        let pp9 = 'https://telegra.ph/file/826ce3530ab20b15a496d.mp4';
        let pp10 = 'https://telegra.ph/file/826ce3530ab20b15a496d.mp4';
        let pp11 = 'https://telegra.ph/file/f66bcaf1effc14e077663.mp4';   
        let pp12 = 'https://telegra.ph/file/f66bcaf1effc14e077663.mp4';
        let pp13 = 'https://telegra.ph/file/e1dbfc56e4fcdc3896f08.mp4';
        let pp14 = 'https://telegra.ph/file/e1dbfc56e4fcdc3896f08.mp4';
        let pp15 = 'https://telegra.ph/file/0fc525a0d735f917fd25b.mp4';
        let pp16 = 'https://telegra.ph/file/0fc525a0d735f917fd25b.mp4';
        let pp17 = 'https://telegra.ph/file/68643ac3e0d591b0ede4f.mp4';
        let pp18 = 'https://telegra.ph/file/68643ac3e0d591b0ede4f.mp4';
        let pp19 = 'https://telegra.ph/file/af0fe6eb00bd0a8a9e3a0.mp4';
    
        const videos = [pp1, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10, pp11, pp12, pp13, pp14, pp15, pp16, pp17, pp18, pp19];
        const video = videos[Math.floor(Math.random() * videos.length)];
        
        // Send the message with the video and the corresponding message
        let mentions = [who]; // Mention the user that was quoted or mentioned
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions }, { quoted: m });
    }
}

handler.help = ['kiss/besar @tag'];
handler.tags = ['emox'];
handler.command = ['kiss','besar'];
handler.group = true;

export default handler;
