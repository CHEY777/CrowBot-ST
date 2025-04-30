let handler = async (m, { conn, usedPrefix, command }) => {

let grupos = `╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈≫

☕︎︎ *Hello! Join the official bot channel to connect with the community* 💛

⧼★⧽ Official Channel
*❏* https://whatsapp.com/channel/0029Vb9t1Xk8fewhfbTZeT2c

╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈≫`

let img = 'https://files.catbox.moe/syfyfd.jpg';

conn.sendMessage(m.chat, { image: { url: img }, caption: grupos }, { quoted: m });
}

handler.help = ['groups']
handler.tags = ['main']
handler.command = ['groups', 'crowgroups', 'groupcrow']

export default handler
