import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
   await m.react('🔮');

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let name = await conn.getName(who);
    let edtr = `@${m.sender.split`@`[0]}`;
    let username = conn.getName(m.sender);

    // VCARD
    let list = [{
        displayName: "ᥴꫝꫀꪗ-𝙎𝙖𝙣💫🌙✨",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN: ᴄʜᴇʏ_ᴄᴏᴅᴇx🍭\nitem1.TEL;waid=918116781147:918116781147\nitem1.X-ABLabel:Número\nitem2.EMAIL;type=INTERNET: chaitanya811678@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://www.instagram.com/its_chey7\nitem3.X-ABLabel:Internet\nitem4.ADR:;; India;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
    }];

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${list.length} Contacto`,
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
    }, {
        quoted: mcontacto
    });

    let txt = `👋 *hello-hello \`${username}\` this is*\n*my creator's contact*`;

    await conn.sendMessage(m.chat, { text: txt });
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = /^(owner|creator|creador|dueño|malik|baby)$/i;

export default handler;
