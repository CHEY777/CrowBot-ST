import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'crow': '💖「 *`MENUS ANYABOT`* 」💖',
'main': '「INFO」✨',
'buscador': '「SEARCHES」✨',
'fun': '「GAMES」✨',
'serbot': '「SUB BOTS」✨',
'rpg': '「RPG」✨',
'rg': '「REGISTER」✨',
'sticker': '「STICKERS」✨',
'emox': '「ANIME」✨',
'database': '「DATABASE」✨',
'grupo': '「GROUPS」✨',
'nable': '「ON / OFF」✨',
'descargas': '「DOWNLOADS」✨',
'tools': '「TOOLS」✨',
'info': '「INFORMATION」✨',
'owner': '「CREATOR」✨',
'logos': '「LOGO EDITING」✨', 
}

const vid = 'https://files.catbox.moe/ic2ct6.mp4';

const defaultMenu = {
  before: `*•:•:•:•:•:•:•:•:•:•☾☼☽•:•.•:•.•:•:•:•:•:•*

"「🔮」 ¡Hola! *%name* %greeting, To View Your Profile Use *#prefix* ❒"

╔━━━━━ *⊱𝐈𝐍𝐅𝐎 - 𝐁𝐎𝐓⊰*
✦  👤 *Client:* %name
✦  📍 *Mod:* Public
✧  ✨ *Baileys:* Multi Device
✦  ☄️ *Active Time:* %muptime
✧  💫 *Users:* %totalreg 
╚━━━━━━━━━━━━━━
%readmore
*✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧*\n\n> hello hello.

\t*(✰◠‿◠) 𝐂 𝐨 𝐦 𝐦 𝐚 𝐧 𝐝 𝐬*   
`.trimStart(),
  header: '͜ ۬︵࣪᷼⏜݊᷼⏜࣪᷼✿⃘𐇽۫ꥈ࣪࣪࣪࣪࣪࣪࣪𝇈⃘۫ꥈ࣪࣪࣪࣪࣪𑁍ٜ𐇽࣪࣪࣪࣪࣪𝇈⃘۫ꥈ࣪࣪࣪࣪࣪✿݊᷼⏜࣪᷼⏜࣪᷼︵۬ ͜\n┊➳ %category \n͜ ۬︵࣪᷼⏜݊᷼⏜࣪᷼✿⃘𐇽۫ꥈ࣪࣪࣪࣪࣪࣪࣪𝇈⃘۫ꥈ࣪࣪࣪࣪࣪𑁍ٜ𐇽࣪࣪࣪࣪࣪𝇈⃘۫ꥈ࣪࣪࣪࣪࣪✿݊᷼⏜࣪᷼⏜࣪᷼︵۬ ͜',
  body: '*┃⏤͟͟͞͞🍭➤›* %cmd',
  footer: '*┗━*\n',
  after: `> ${dev}`,
}
let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, estrellas, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    exp = exp || 'Desconocida';
    role = role || 'Aldeano';
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
let botinfo = (conn.user.jid == global.conn.user.jid ? 'Oficial' : 'Sub-Bot');

    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        estrellas: plugin.estrellas,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == conn.user.jid ? '' : `Powered by https://wa.me/${conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%isdiamond/g, menu.diamond ? '(ⓓ)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),
taguser: '@' + m.sender.split("@s.whatsapp.net")[0],
npmname: _package.name,
npmdesc: _package.description,
version: _package.version,
exp: exp - min,
maxexp: xp,
botofc: (conn.user.jid == global.conn.user.jid ? '💖 Chey' : `🎀Anya: Wa.me/${global.conn.user.jid.split`@`[0]}`), 
totalexp: exp,
xp4levelup: max - exp,
github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
greeting, level, estrellas, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

await m.react(emojis) 

/* await conn.sendMessage(m.chat, { video: { url: vid }, caption: text.trim(), contextInfo: { mentionedJid: [m.sender], isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, newsletterName: channelRD.name, serverMessageId: -1, }, forwardingScore: 999, externalAdReply: { title: textbot, body: dev, thumbnailUrl: 'https://qu.ax/kJBTp.jpg', sourceUrl: redes, mediaType: 1, renderLargerThumbnail: false,
}, }, gifPlayback: true, gifAttribution: 0 }, { quoted: null }) */

let img = 'https://files.catbox.moe/syfyfd.jpg'; // valiendo vrg con los links

  await conn.sendMessage(m.chat, { 
      text: text.trim(),
      contextInfo: {
          mentionedJid: [m.sender],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: channelRD.id,
              newsletterName: channelRD.name,
              serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
              title: textbot,
              body: dev,
              thumbnailUrl: img,
              sourceUrl: redes,
              mediaType: 1,
              showAdAttribution: true,
              renderLargerThumbnail: true,
          },
      },
  }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, `❌️ Sorry, the menu has an error. ${e.message}`, m, rcanal, )
    throw e
  }
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menuall', 'allmenú', 'allmenu', 'menucompleto'] 
handler.register = false

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

  var ase = new Date();
  var hour = ase.getHours();
switch(hour){
case 0: hour = 'Good Night 🌙'; break;
case 1: hour = 'Good Night 💤'; break;
case 2: hour = 'Good Night 🦉'; break;
case 3: hour = 'Good Morning ✨'; break;
case 4: hour = 'Good Morning 💫'; break;
case 5: hour = 'Good Morning 🌅'; break;
case 6: hour = 'Good Morning 🌄'; break;
case 7: hour = 'Good Morning 🌅'; break;
case 8: hour = 'Good Morning 💫'; break;
case 9: hour = 'Good Morning ✨'; break;
case 10: hour = 'Good Morning 🌞'; break;
case 11: hour = 'Good Morning 🌨'; break;
case 12: hour = 'Good Morning ❄'; break;
case 13: hour = 'Good Morning 🌤'; break;
case 14: hour = 'Good Afternoon 🌇'; break;
case 15: hour = 'Good Afternoon 🥀'; break;
case 16: hour = 'Good Afternoon 🌹'; break;
case 17: hour = 'Good Afternoon 🌆'; break;
case 18: hour = 'Good Night 🌙'; break;
case 19: hour = 'Good Night 🌃'; break;
case 20: hour = 'Good Night 🌌'; break;
case 21: hour = 'Good Night 🌃'; break;
case 22: hour = 'Good Night 🌙'; break;
case 23: hour = 'Good Night 🌃'; break;
}
  var greeting = hour;
