// Code created by Destroy wa.me/584120346669

import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    if (!db.data.chats[m.chat].nsfw && m.isGroup) {
        return m.reply('[❗] +18 commands are disabled in this group.\n> If you are an admin and want to enable them, use .enable nsfw');
    }

    // Check if someone is mentioned or a message is quoted
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]; // If mentioned, use that
    } else if (m.quoted) {
        who = m.quoted.sender; // If quoting a message, use that sender
    } else {
        who = m.sender; // Otherwise, use the sender
    }

    let name = conn.getName(who); // Name of the mentioned or quoted person
    let name2 = conn.getName(m.sender); // Name of the user who sends the command
    m.react('🥵');

    // Build message depending on mention/quote
    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` did it passionately with \`${name || who}\`.`;
    } else if (m.quoted) {
        str = `\`${name2}\` strongly took \`${name || who}\`.`;
    } else {
        str = `\`${name2}\` is getting it on! >.<`.trim();
    }

    if (m.isGroup) {
        // Array of video URLs
        const videos = [
            'https://telegra.ph/file/6ea4ddf2f9f4176d4a5c0.mp4',
            'https://telegra.ph/file/66535b909845bd2ffbad9.mp4',
            'https://telegra.ph/file/1af11cf4ffeda3386324b.mp4',
            'https://telegra.ph/file/e2beba258ba83f09a34df.mp4',
            'https://telegra.ph/file/21543bac2383ce0fc6f51.mp4',
            'https://telegra.ph/file/1baf2e8577d5118c03438.mp4',
            'https://telegra.ph/file/7638618cf43e499007765.mp4',
            'https://telegra.ph/file/1c7d59e637f8e5915dbbc.mp4',
            'https://telegra.ph/file/e7078700d16baad953348.mp4',
            'https://telegra.ph/file/100ba1caee241e5c439de.mp4',
            'https://telegra.ph/file/3b1d6ef30a5e53518b13b.mp4',
            'https://telegra.ph/file/249518bf45c1050926d9c.mp4',
            'https://telegra.ph/file/34e1fb2f847cbb0ce0ea2.mp4',
            'https://telegra.ph/file/52c82a0269bb69d5c9fc4.mp4',
            'https://telegra.ph/file/ca64bfe2eb8f7f8c6b12c.mp4',
            'https://telegra.ph/file/8e94da8d393a6c634f6f9.mp4',
            'https://telegra.ph/file/216b3ab73e1d98d698843.mp4',
            'https://telegra.ph/file/1dec277caf371c8473c08.mp4',
            'https://telegra.ph/file/bbf6323509d48f4a76c13.mp4',
            'https://telegra.ph/file/f8e4abb6923b95e924724.mp4',
            'https://telegra.ph/file/bd4d5a957466eee06a208.mp4',
            'https://telegra.ph/file/a91d94a51dba34dc1bed9.mp4',
            'https://telegra.ph/file/b08996c47ff1b38e13df0.mp4',
            'https://telegra.ph/file/58bcc3cd79cecda3acdfa.mp4',
        ];

        const video = videos[Math.floor(Math.random() * videos.length)];
        const mentions = [who]; // Mention the target person

        // Send the video with the message
        conn.sendMessage(
            m.chat,
            {
                video: { url: video },
                gifPlayback: true,
                caption: str,
                mentions,
            },
            { quoted: m }
        );
    }
};

handler.help = ['fuck/coger @tag'];
handler.tags = ['emox'];
handler.command = ['fuck', 'coger'];
handler.group = true;

export default handler;
