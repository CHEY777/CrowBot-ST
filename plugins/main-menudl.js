import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'
import fetch from 'node-fetch'

const defaultMenu = {
  before: `"📼 Hello! *%name*, here's my Download Menu"

*─────────────────*
%readmore
`.trimStart(),
  header: '┏━━⪩「 *_%category_* 」⪨',
  body: '┃『🎵』 %cmd\n',
  footer: '┗━━━━━━━━━━━━━━━━⪩\n',
  after: ``,
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  let tags = {
    'downloads': 'Download Menu',
  }

  let img = 'https://cdnmega.vercel.app/media/l5pwXDAJ@gZRUbCOQitBCChp5bqOPP0LW3HXn_ENTqz5Gvrw6ts8'

  try {
    // User data
    let user = global.db.data.users[m.sender] || {}
    let { exp, limit, level } = user
    let { min, xp, max } = xpRange(level, global.multiplier || 1)
    let name = await conn.getName(m.sender)
    let tag = `@${m.sender.split('@')[0]}`

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
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled
      }
    })

    // Build menu text
    let text = [
      defaultMenu.before,
      ...Object.keys(tags).map(tag => {
        return [
          defaultMenu.header.replace('%category', tags[tag]),
          ...help.filter(cmd => cmd.tags && cmd.tags.includes(tag) && cmd.help)
            .map(cmd => {
              return cmd.help.map(help => {
                return defaultMenu.body
                  .replace('%cmd', cmd.prefix ? help : _p + help)
                  .replace('%isPremium', cmd.premium ? '(💎)' : '')
                  .replace('%isLimit', cmd.limit ? '(⚠️)' : '')
              }).join('\n')
            }),
          defaultMenu.footer
        ].join('\n')
      }),
      defaultMenu.after
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
          title: '📥 Download Menu',
          body: 'Powered by chey',
          thumbnailUrl: img,
          sourceUrl: 'https://files.catbox.moe/md1ug4.jpg',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
    
    await m.react('🎵')

  } catch (e) {
    console.error('Menu error:', e)
    await conn.reply(m.chat, `❌ Failed to load menu: ${e.message}`, m)
  }
}

// Helper functions
function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, 'H ', m, 'M ', s, 'S'].map(v => v.toString().padStart(2, 0)).join('')
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

// Command setup
handler.help = ['downloadmenu', 'dlmenu']
handler.tags = ['download']
handler.command = ['menudl', 'downloadmenu', 'dlmenu']

export default handler
