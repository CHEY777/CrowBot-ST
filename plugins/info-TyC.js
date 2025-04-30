const handler = async (m, { conn }) => {
  m.reply(m.chat, global.terms, m, rcanal);
};

handler.customPrefix = /terms and conditions and privacy|termsandconditionsandprivacy|termsandconditions|terms and conditions|terms of use|Terms of use|Term of use|Terms of Use/i;
handler.command = new RegExp;
export default handler;

global.terms = `✨ 𝑴𝑬𝑺𝑺𝑨𝑮𝑬 𝑭𝑹𝑶𝑴 𝑻𝑯𝑬 𝑪𝑹𝑬𝑨𝑻𝑶𝑹 ✨

⚠️ WARNING FROM THE CREATOR (*Chey*) ⚠️

Diego is not responsible for the misuse of the bot or subbot. Each user is responsible for how they use their bot. Diego will not be held accountable for anything that happens to your account if you misuse the bot.

The bot is simple but has fun commands. Want to see the commands? Type #menu.

This is a public bot available for everyone who wants to use it. Thank you for choosing to use our bot. It may be simple, but it's fun! ✨

Contact us 🚀

✫ ${global.creador}
᯽ chey
✫ Email: chaitanya811678@gmail.com

✰ ${global.packname}`;
