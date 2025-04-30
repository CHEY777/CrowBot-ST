let handler = async (m, { isPrems, conn }) => {

let img = 'https://files.catbox.moe/7kh8e5.jpg' 
let texto = `• 𝐌𝐄𝐍𝐔 +18 •
「 🔞 *ADULT COMMANDS* 🔞 」

║➤ 🍒 _.xnxxsearch_ (texto)
║➤ 🍒 _.xnxxdl_ (link)
║➤ 🍒 _.phsearch_ (texto)
║➤ 🍒 _.rule34_ (texto)
║➤ 🍒 _.xvideosearch_ (texto)
║➤ 🍒 _.xvideosdl_ (link)
║➤ 🍒 _.hentaisearch_ (texto)
║➤ 🍒 _.fuck_ (@tag)
║➤ 🍒 _.fuck2_ (@tag)
║➤ 🍒 _.cum_ (@tag)
║➤ 🍒 _.follar_ (@tag)
║➤ 🍒 _.penetrar_ (@tag)
║➤ 🍒 _.horny_ (@tag)
║➤ 🍒 _.violar_ (@tag)
║➤ 🍒 _.sixnine_ (@tag)`

 conn.sendMessage(m.chat, {
        text: texto,
        contextInfo: {
        externalAdReply: {
        title: '𓂂𓏸  𐅹੭੭ ᴘᴏʀɴᴏɢʀᴀᴘʜʏ ᴍᴇɴᴜ 🌙 ᦡᦡ',
        body: dev,
        thumbnailUrl: img,
        sourceUrl: channel,
        mediaType: 1,
        renderLargerThumbnail: true
        }}},
        { quoted: fkontak })
}
handler.help = ['menuhot (menu +18)']
handler.tags = ['crow']
handler.command = ['menu18', 'menuhorny', 'menunsfw', 'menuhot'] 
export default handler;
