import axios from 'axios'
import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import moment from 'moment-timezone'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, args, usedPrefix, command }) {
    let user = global.db.data.users[m.sender]
    let name2 = conn.getName(m.sender)
    let whe = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
    let perfil = await conn.profilePictureUrl(whe, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg')

    if (user.registered === true) {
        return m.reply(`《★》You are already registered.\n\nDo you want to register again?\n\nUse this command to delete your registration.\n*${usedPrefix}unreg*`)
    }
    
    if (!Reg.test(text)) return m.reply(`《★》The format you entered is incorrect\n\nCommand usage: ${usedPrefix + command} name.age\nExample: *${usedPrefix + command} ${name2}.14*`)
    
    let [_, name, splitter, age] = text.match(Reg)
    if (!name) return m.reply('《★》Name cannot be empty.')
    if (!age) return m.reply('《★》Age cannot be empty.')
    if (name.length >= 100) return m.reply('《★》Name is too long.')
    
    age = parseInt(age)
    if (age > 1000) return m.reply('《★》 *The age entered is incorrect*')
    if (age < 5) return m.reply('《★》 *The age entered is incorrect*')
    
    user.name = name.trim()
    user.age = age
    user.regTime = +new Date
    user.registered = true
    global.db.data.users[m.sender].money += 600
    global.db.data.users[m.sender].estrellas += 10
    global.db.data.users[m.sender].exp += 245
    global.db.data.users[m.sender].joincount += 5    

    let who;
    if (m.quoted && m.quoted.sender) {
        who = m.quoted.sender;
    } else {
        who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    }
    
    let sn = createHash('md5').update(m.sender).digest('hex')
    let regbot = `┏━━━━━━━━━━━━━━━━━━⬣
┃⋄ *🔮 REGISTRATION - Anya BOT*
┗━━━━━━━━━━━━━━━━━━⬣\n`
    regbot += `•✩.･*:｡≻──── ⋆♡⋆ ────.•*:｡✩•\n`
    regbot += `*「💛」Name:* ${name}\n`
    regbot += `*「💛」Age:* ${age} years\n`
    regbot += `•✩.･*:｡≻──── ⋆♡⋆ ────.•*:｡✩•\n`
    regbot += `*「🎀」Rewards:*\n> `
    regbot += `• 15 Stars 🌟\n> `
    regbot += `• 5 CheyCoins 🪙\n> `
    regbot += `• 245 Experience 💸\n> `
    regbot += `• 12 Tokens 💰\n`
    regbot += `꒷꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒷꒦꒷\n> `
    regbot += `🍫 Use *#profile* to see your profile.`

  await conn.sendMessage(m.chat, {
        text: regbot,
        contextInfo: {
            externalAdReply: {
                title: '⊱『✅𝆺𝅥 REGISTERED 𝆹𝅥✅』⊰',
                thumbnailUrl: 'https://files.catbox.moe/md1ug4.jpg',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

let chtxt = `👤 *User* » ${m.pushName || 'Anonymous'}
🗂 *Verification* » ${user.name}
🍨 *Age* » ${user.age} years
⌨️ *Description* » ${user.descripcion}
🍭 *Registration number* »
⤷ ${sn}`;

    let channelID = '120363387375075395@newsletter';
        await conn.sendMessage(channelID, {
        text: chtxt,
        contextInfo: {
            externalAdReply: {
                title: "【 🔔 REGISTRATION NOTIFICATION 🔔 】",
                body: '🥳 A new user in my database!',
                thumbnailUrl: perfil,
                sourceUrl: redes,
                mediaType: 1,
                showAdAttribution: false,
                renderLargerThumbnail: false
            }
        }
    }, { quoted: null });
};

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler
