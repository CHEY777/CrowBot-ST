import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    await m.react('🔮');

    // Get sender info
    let who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender);
    let name = await conn.getName(who);
    let username = await conn.getName(m.sender);
    let senderUsername = m.sender.split('@')[0];

    // Developer Info
    let dev = "ᴄʜᴇʏ_ᴄᴏᴅᴇx🫧";

    // VCARD contact list
    let list = [{
        displayName: "ᥴꫝꫀꪗ-𝙎𝙖𝙣💫🌙✨",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${dev}\nTEL;waid=918116781147:+91 81167 81147\nEMAIL;type=INTERNET:chaitanya811678@gmail.com\nURL:https://www.instagram.com/its_chey7\nADR:;;India;;;;\nEND:VCARD`
    }];

    // Send contact card
    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${list.length} Contact`,
            contacts: list
        },
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: '𝓗𝓮𝓵𝓵𝓸, 𝓘𝓶 𝓬𝓱𝓮𝔂, 𝓽𝓱𝓮 𝓫𝓮𝓼𝓽',
                body: dev,
                thumbnailUrl: 'https://files.catbox.moe/hofuch.jpg',
                sourceUrl: 'https://github.com/Chey-san',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    });

    // Send text message
    let txt = `👋 *Hello \`${username}\`, this is my creator's contact card.*\nFeel free to connect!`;
    await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
};

// Handler config
handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = /^(owner|creator|creador|dueño|malik|baby)$/i;

export default handler;
