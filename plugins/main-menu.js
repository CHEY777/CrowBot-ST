import { promises as fs } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import { xpRange } from '../lib/levelling.js';

// Cute and organized tag labels
const tags = {
  crow: '💖「 *`MENUS ANYABOT`* 」💖',
  main: '「INFO」✨',
  search: '「SEARCHES」✨',
  games: '「GAMES」✨',
  subBots: '「SUB BOTS」✨',
  rpg: '「RPG」✨',
  register: '「REGISTER」✨',
  stickers: '「STICKERS」✨',
  anime: '「ANIME」✨',
  database: '「DATABASE」✨',
  groups: '「GROUPS」✨',
  onOff: '「ON / OFF」✨',
  downloads: '「DOWNLOADS」✨',
  tools: '「TOOLS」✨',
  information: '「INFORMATION」✨',
  creator: '「CREATOR」✨',
  logoEditing: '「LOGO EDITING」✨',
};

const textbot = '𝓐𝔂𝓷𝓪💖🔮🌙🎀✨';
const dev = 'ᥴꫝꫀꪗ-𝙎𝙖𝙣💫🌙✨';
const redes = 'https://www.instagram.com/its_chey7/#';
const emojis = '✨';
const videoPreview = 'https://files.catbox.moe/ic2ct6.mp4';
const img = 'https://files.catbox.moe/syfyfd.jpg';
const rcanal = null;

const defaultMenu = {
  before: `
*•:•:•:•:•:•:•:•:•:•☾☼☽•:•.•:•.•:•:•:•:•:•*

"「🔮」 ¡Hola! *%name* %greeting, To View Your Profile Use *#prefix* ❒"

╔━━━━━ *⊱𝐈𝐍𝐅𝐎 - 𝐁𝐎𝐓⊰*
✦  👤 *Client:* %name
✦  📍 *Mod:* Public
✧  ✨ *Baileys:* Multi Device
✦  ☄️ *Active Time:* %muptime
✧  💫 *Users:* %totalreg 
╚━━━━━━━━━━━━━━
%readmore

\t*(✰◠‿◠) 𝐂 𝐨 𝐦 𝐦 𝐚 𝐧 𝐝 𝐬*   
`.trimStart(),
  header: `
͜ ۬︵࣪᷼⏜݊᷼⏜࣪᷼✿⃘𐇽۫ꥈ࣪࣪𝇈⃘۫ꥈ࣪𑁍ٜ𐇽࣪𝇈⃘۫ꥈ✿݊᷼⏜᷼⏜᷼︵۬ ͜
┊➳ %category 
͜ ۬︵࣪᷼⏜݊᷼⏜࣪᷼✿⃘𐇽۫ꥈ࣪࣪𝇈⃘۫ꥈ࣪𑁍ٜ𐇽࣪𝇈⃘۫ꥈ✿݊᷼⏜᷼⏜᷼︵۬ ͜`,
  body: '*┃⏤͟͟͞͞🍭➤›* %cmd',
  footer: '*┗━*\n',
  after: `> ${dev}`,
};

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

const greetings = {
  0: 'Good Night 🌙', 1: 'Good Night 💤', 2: 'Good Night 🦉',
  3: 'Good Morning ✨', 4: 'Good Morning 💫', 5: 'Good Morning 🌅',
  6: 'Good Morning 🌄', 7: 'Good Morning 🌅', 8: 'Good Morning 💫',
  9: 'Good Morning ✨', 10: 'Good Morning 🌞', 11: 'Good Morning 🌨',
  12: 'Good Morning ❄', 13: 'Good Morning 🌤', 14: 'Good Afternoon 🌇',
  15: 'Good Afternoon 🥀', 16: 'Good Afternoon 🌹', 17: 'Good Afternoon 🌆',
  18: 'Good Night 🌙', 19: 'Good Night 🌃', 20: 'Good Night 🌌',
  21: 'Good Night 🌃', 22: 'Good Night 🌙', 23: 'Good Night 🌃'
};
const greeting = greetings[new Date().getHours()] || 'Hello';

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await fs.readFile(join(__dirname, '../package.json')).catch(() => '{}')) || {};
    let { exp, estrellas, level, role } = global.db.data.users[m.sender];
    let { min, xp, max } = xpRange(level, global.multiplier);
    let name = await conn.getName(m.sender);
    let d = new Date(Date.now() + 3600000);
    let locale = 'es';

    let text = Object.keys(tags).map(tag => {
      let section = defaultMenu.header.replace(/%category/g, tags[tag]) + '\n';
      section += Object.values(global.plugins).filter(p => !p.disabled && p.tags?.includes(tag)).map(p =>
        (Array.isArray(p.help) ? p.help : [p.help]).map(cmd =>
          defaultMenu.body.replace(/%cmd/g, p.prefix ? cmd : '%p' + cmd)
        ).join('\n')
      ).join('\n');
      return section + '\n' + defaultMenu.footer;
    });

    let _uptime = process.uptime() * 1000;
    let _muptime = process.send ? await new Promise(resolve => {
      process.once('message', resolve);
      process.send('uptime');
      setTimeout(() => resolve(0), 1000);
    }) * 1000 : 0;

    const replace = {
      '%': '%', p: _p,
      uptime: clockString(_uptime),
      muptime: clockString(_muptime),
      me: conn.getName(conn.user.jid),
      taguser: '@' + m.sender.split('@')[0],
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min, maxexp: xp, totalexp: exp,
      xp4levelup: max - exp,
      level, estrellas, name, role,
      weton: ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5],
      week: d.toLocaleDateString(locale, { weekday: 'long' }),
      date: d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }),
      dateIslamic: Intl.DateTimeFormat(`${locale}-TN-u-ca-islamic`, { day: 'numeric', month: 'long', year: 'numeric' }).format(d),
      time: d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' }),
      botofc: (conn.user.jid == global.conn.user.jid ? '💖 Chey' : `🎀Anya: Wa.me/${global.conn.user.jid.split('@')[0]}`),
      totalreg: Object.keys(global.db.data.users).length,
      rtotalreg: Object.values(global.db.data.users).filter(u => u.registered).length,
      greeting,
      readmore: readMore
    };

    let finalText = [
      defaultMenu.before,
      ...text,
      defaultMenu.after
    ].join('\n').replace(/%(\w+)/g, (_, k) => replace[k] ?? '');

    await m.react(emojis);
    await conn.sendMessage(m.chat, {
      text: finalText.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
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
    }, { quoted: m });

  } catch (e) {
    conn.reply(m.chat, `❌️ Sorry, the menu has an error: ${e.message}`, m, rcanal);
    throw e;
  }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'help', 'menuall', 'allmenú', 'allmenu', 'menucompleto'];
handler.register = false;

export default handler;
