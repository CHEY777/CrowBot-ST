import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

// ===== CONFIGURATION ===== //
const botConfig = {
  name: '𝓐𝔂𝓷𝓪💖🔮🌙🎀✨',
  owner: 'ᥴꫝꫀꪗ-𝙎𝙖𝙣💫🌙✨',
  social: 'https://www.instagram.com/its_chey7/#',
  thumbnail: 'https://files.catbox.moe/syfyfd.jpg',
  emoji: '✨'
}

// ===== MENU CATEGORIES ===== //
const categories = {
  'main': '✨ MAIN MENU',
  'info': 'ℹ️ BOT INFO',
  'search': '🔍 SEARCH',
  'download': '📥 DOWNLOAD',
  'sticker': '🖼️ STICKER',
  'group': '👥 GROUP',
  'owner': '👑 OWNER',
  'fun': '🎉 FUN',
  'game': '🎮 GAME',
  'rpg': '⚔️ RPG',
  'tools': '🛠️ TOOLS'
}

// ===== MENU TEMPLATE ===== //
const menuTemplate = {
  before: `
╭───「 ${botConfig.name} 」───╮
│
│ Hello *%name*! %greeting
│ 
│ ⏰ Time: %time
│ 📅 Date: %date
│ ⌚ Uptime: %uptime
│
│ Type *%prefixhelp* for info
│ Type *%prefixmenu* for menu
│
╰─────────────────────╯
%readmore
`.trim(),
  
  header: '╭───「 %category 」───╮\n│',
  body: '│ ➤ %cmd %isPremium',
  footer: '│\n╰─────────────────────╯',
  
  after: `
╭───「 CREDITS 」───╮
│
│ 🤖 Bot Name: ${botConfig.name}
│ 👑 Creator: ${botConfig.owner}
│ 💌 Follow: ${botConfig.social}
│
╰─────────────────────╯
`.trim()
}

// ===== MAIN HANDLER ===== //
let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    // User data
    let user = global.db.data.users[m.sender] || {}
    let { exp, limit, level, role } = user
    let { min, xp, max } = xpRange(level, global.multiplier || 1)
    let name = await conn.getName(m.sender)
    
    // Time data
    let d = new Date()
    let time = d.toLocaleTimeString('en', { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    })
    let date = d.toLocaleDateString('en', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
    let uptime = clockString(process.uptime() * 1000)
    
    // Get all commands
    let help = Object.values(global.plugins).filter(
      plugin => !plugin.disabled
    ).map(plugin => {
      return {
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        premium: plugin.premium,
        enabled: !plugin.disabled
      }
    })

    // Build menu text
    let text = [
      menuTemplate.before,
      ...Object.keys(categories).map(category => {
        return [
          menuTemplate.header.replace('%category', categories[category]),
          ...help.filter(cmd => cmd.tags && cmd.tags.includes(category) && cmd.help)
            .map(cmd => {
              return cmd.help.map(help => {
                return menuTemplate.body
                  .replace('%cmd', cmd.prefix ? help : _p + help)
                  .replace('%isPremium', cmd.premium ? '(💎)' : '')
              }).join('\n')
            }),
          menuTemplate.footer
        ].join('\n')
      }),
      menuTemplate.after
    ].join('\n')

    // Replace placeholders
    text = text
      .replace(/%name/g, name)
      .replace(/%greeting/g, getGreeting())
      .replace(/%prefix/g, _p)
      .replace(/%time/g, time)
      .replace(/%date/g, date)
      .replace(/%uptime/g, uptime)
      .replace(/%level/g, level || 0)
      .replace(/%exp/g, exp || 0)
      .replace(/%maxexp/g, xp || 0)
      .replace(/%readmore/g, readMore)

    // Send menu
    await conn.sendMessage(m.chat, { 
      text: text.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: `${botConfig.name} Menu`,
          body: `Powered by ${botConfig.owner}`,
          thumbnailUrl: botConfig.thumbnail,
          sourceUrl: botConfig.social,
          mediaType: 1
        }
      }
    }, { quoted: m })
    
    await m.react(botConfig.emoji)

  } catch (e) {
    console.error('Menu error:', e)
    await conn.reply(m.chat, `❌ Failed to load menu: ${e.message}`, m)
  }
}

// ===== HELPER FUNCTIONS ===== //
function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 4) return 'Late Night 🌙'
  if (hour < 12) return 'Good Morning 🌅'
  if (hour < 17) return 'Good Afternoon ☀️'
  if (hour < 20) return 'Good Evening 🌇'
  return 'Good Night 🌙'
}

const readMore = String.fromCharCode(8206).repeat(4001)

// ===== COMMAND SETUP ===== //
handler.help = ['menu', 'help', 'cmd']
handler.tags = ['main']
handler.command = ['menu', 'help', 'm', 'menú', 'allmenu']
handler.register = false

export default handler
