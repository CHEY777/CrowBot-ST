import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// Staff De AnyaBot
global.owner = [
   ['918116781147', 'ᥴꫝꫀꪗ-𝙎𝙖𝙣💫🌙✨', true],
   ['918116781147', 'CrowBot Soporte', true],
   ['918116781147', 'Dev chey', true],
   ['918116781147', 'Dev ᥴꫝꫀꪗ𒆜', true],
   ['918116781147', 'Dev chey', true],
   ['918116781147', 'Dev codexchey', true],
   ['918116781147','Dev ᥴꫝꫀꪗ-𝙎𝙖𝙣', true],
]

global.creadorbot = [
   ['918116781147', 'ᥴꫝꫀꪗ-𝙎𝙖𝙣', true],
]
  

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = ['918116781147']

global.prems = ['918116781147']


//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = 'Anyabot'
global.namebot = 'anyachan'
global.sessions = 'AnyaSession'
global.jadi = 'AnyaJadiBot' 
global.yukiJadibts = true // Activado
global.ch = {
ch1: 'https://www.instagram.com/its_chey7?igsh=MWM1YW12cDJhYmQ1',
ch2: 'https://whatsapp.com/channel/0029Vb9t1Xk8fewhfbTZeT2c'
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = 'ᥴꫝꫀꪗ-𝙎𝙖𝙣💫🌙✨'
global.botname = '𝒜𝓃𝓎𝒶-𝓒𝓱𝓪𝓷'
global.wm = '𝒜𝓃𝓎𝒶-𝓒𝓱𝓪𝓷'
global.author = '(⁎˃ᴗ˂⁎)𝐌𝐚𝐝𝐞 𝐁𝐲 ᥴꫝꫀꪗ𓆪'
global.dev = '© 𝖯᥆𝗐ᥱ𝗋ᥱძ ᑲᥡ ᥴꫝꫀꪗ ☂︎'
global.espera = '✰ ℙ𝕝𝕖𝕒𝕤𝕖 𝕨𝕒𝕚𝕥 𝕒 𝕞𝕠𝕞𝕖𝕟𝕥, 𝕨𝕖 𝕒𝕣𝕖 𝕤𝕖𝕟𝕕𝕚𝕟𝕘 𝕪𝕠𝕦𝕣 𝕠𝕣𝕕𝕖𝕣 (✿◠‿◠)'
global.namebot = 'ᴀɴʏᴀ-ᴄʜᴀɴ'
global.textbot = `「 💖 𝒜𝓃𝓎𝒶-𝓒𝓱𝓪𝓷- 𝐒𝐓 🔮 」`
global.vs = '2.2.0'
global.publi = '✰ᶠᵒˡˡᵒʷ ᵗʰᵉ ᶜʰᵃⁿⁿᵉˡ👇'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.imagen1 = fs.readFileSync('./media/menus/Menu.jpg')
global.imagen2 = fs.readFileSync('./media/menus/Menu2.jpg')
global.imagen3 = fs.readFileSync('./media/menus/Menu3.jpg')
global.welcome = fs.readFileSync('./media/welcome.jpg')
global.adios = fs.readFileSync('./media/adios.jpg')
global.catalogo = fs.readFileSync('./media/catalogo.jpg')

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
global.repobot = 'https://github.com/Chey-san'
global.grupo = 'https://chat.whatsapp.com/Hdv95ewBBIQJH63SfdSEG1'
global.gteam = 'https://chat.whatsapp.com/Hdv95ewBBIQJH63SfdSEG1'
global.gsupport = 'https://chat.whatsapp.com/Hdv95ewBBIQJH63SfdSEG1'
global.comu = 'https://chat.whatsapp.com/Hdv95ewBBIQJH63SfdSEG1'
global.channel = 'https://whatsapp.com/channel/0029Vb9t1Xk8fewhfbTZeT2c'
global.insta = 'https://www.instagram.com/its_chey7?utm_source=qr&igsh=MWM1YW12cDJhYmQ1'
//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.estilo = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
    ...(false ? { remoteJid: '' } : {})
  },
  message: {
    orderMessage: {
      itemCount: -999999,
      status: 1,
      surface: 1,
      message: '👑【✫ᥴꫝꫀꪗ-𝙎𝙖𝙣💫🌙✨✫】',
      orderTitle: 'Bang',
      thumbnail: catalogo,
      sellerJid: '0@s.whatsapp.net'
    }

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment        

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.multiplier = 69 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
