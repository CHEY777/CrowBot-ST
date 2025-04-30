import { promises } from 'fs'; import { join } from 'path'; import fetch from 'node-fetch'; import { xpRange } from '../lib/levelling.js';

let tags = { 'crow': '💖「 MENUS ANYABOT 」💖', 'main': '「INFO」✨', 'search': '「SEARCHES」✨', 'games': '「GAMES」✨', 'subBots': '「SUB BOTS」✨', 'rpg': '「RPG」✨', 'register': '「REGISTER」✨', 'stickers': '「STICKERS」✨', 'anime': '「ANIME」✨', 'database': '「DATABASE」✨', 'groups': '「GROUPS」✨', 'onOff': '「ON / OFF」✨', 'downloads': '「DOWNLOADS」✨', 'tools': '「TOOLS」✨', 'information': '「INFORMATION」✨', 'creator': '「CREATOR」✨', 'logoEditing': '「LOGO EDITING」✨' };

const vid = 'https://files.catbox.moe/ic2ct6.mp4'; const textbot = '𝓐𝔂𝓷𝓪💖🔮🌙🎀✨'; const dev = 'ᥴꫝꫀꪗ-𝙎𝙖𝙣💫🌙✨'; const redes = 'https://www.instagram.com/its_chey7/#'; const emojis = '✨'; const rcanal = null;

const defaultMenu = { before: `•:•:•:•:•:•:•:•:•:•☾☼☽•:•.•:•.•:•:•:•:•:•

"「🔮」 ¡Hola! %name %greeting, To View Your Profile Use #prefix ❒"

╔━━━━━ ⊱𝐈𝐍𝐅𝐎 - 𝐁𝐎𝐓⊰ ✦  👤 Client: %name ✦  📍 Mod: Public ✧  ✨ Baileys: Multi Device ✦  ☄️ Active Time: %muptime ✧  💫 Users: %totalreg ╚━━━━━━━━━━━━━━ %readmore ✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧\n\n> Hello hello.

\t*(✰◠‿◠) Commands*
.trimStart(), header: '\n┊➳ %category \n', body: '*┃⏤͟͟͞͞🍭➤›* %cmd', footer: '*┗━*\n', after: > ${dev}`
};

const more = String.fromCharCode(8206); const readMore = more.repeat(4001);

function clockString(ms) { let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000); let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60; let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60; return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':'); }

const greeting = (() => { const hour = new Date().getHours(); if (hour < 4) return 'Good Night 🌙'; if (hour < 7) return 'Good Morning 🌄'; if (hour < 12) return 'Good Morning ✨'; if (hour < 17) return 'Good Afternoon ☀️'; if (hour < 20) return 'Good Evening 🌇'; return 'Good Night 🌙'; })();

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => { try { let _package = JSON.parse(await promises.readFile(join(_dirname, '../package.json')).catch( => ({}))) || {}; let { exp, estrellas, level, role } = global.db.data.users[m.sender]; let { min, xp, max } = xpRange(level, global.multiplier); let name = await conn.getName(m.sender); let d = new Date(Date.now() + 3600000); let locale = 'es';

let week = d.toLocaleDateString(locale, { weekday: 'long' });
let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' });

let _uptime = process.uptime() * 1000;
let _muptime;
if (process.send) {
  process.send('uptime');
  _muptime = await new Promise(resolve => {
    process.once('message', resolve);
    setTimeout(resolve, 1000);
  }) * 1000;
}

let muptime = clockString(_muptime);
let uptime = clockString(_uptime);
let totalreg = Object.keys(global.db.data.users).length;
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered).length;

let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
  help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
  tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
  prefix: 'customPrefix' in plugin,
  estrellas: plugin.estrellas,
  premium: plugin.premium,
  enabled: !plugin.disabled,
}));

for (let plugin of help)
  for (let tag of plugin.tags)
    if (!(tag in tags) && tag) tags[tag] = tag;

let { before, header, body, footer, after } = defaultMenu;
let text = [
  before,
  ...Object.keys(tags).map(tag => {
    return header.replace(/%category/g, tags[tag]) + '\n' + help.filter(menu => menu.tags.includes(tag)).map(menu => menu.help.map(cmd => body.replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)).join('\n')).join('\n') + '\n' + footer;
  }),
  after
].join('\n');

let replace = {
  '%': '%', p: _p, uptime, muptime, name, level, estrellas, role,
  exp: exp - min, maxexp: xp, totalexp: exp, xp4levelup: max - exp,
  totalreg, rtotalreg, greeting, date, week, dateIslamic, time,
  readmore: readMore, me: conn.getName(conn.user.jid),
  taguser: '@' + m.sender.split("@s.whatsapp.net")[0],
  version: _package.version,
  github: _package.homepage || '[unknown]',
  botofc: conn.user.jid == global.conn.user.jid ? '💖 Chey' : `🎀Anya: Wa.me/${global.conn.user.jid.split('@')[0]}`
};

text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a,b)=>b.length-a.length).join('|')})`, 'g'), (_, key) => '' + replace[key]);

await m.react(emojis);
let img = 'https://files.catbox.moe/syfyfd.jpg';

await conn.sendMessage(m.chat, {
  text: text.trim(),
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

} catch (e) { conn.reply(m.chat, ❌️ Menu error: ${e.message}, m, rcanal); throw e; } };

handler.help = ['menu']; handler.tags = ['main']; handler.command = ['menu', 'help', 'menuall', 'allmenú', 'allmenu', 'menucompleto']; handler.register = false;

export default handler;

