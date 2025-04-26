// main.js - Complete WhatsApp Bot
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Set to '1' in production
import './config.js';
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';
import path, { join, dirname } from 'path';
import fs, { readdirSync, statSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import chalk from 'chalk';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';

// ==================== CONFIGURATION ====================
const __dirname = dirname(fileURLToPath(import.meta.url));
const SESSION_FOLDER = join(__dirname, 'sessions');
const BOT_NAME = "CrowBot";
const DEVELOPER = "WillZek";
const PREFIX = '.'; // Command prefix

// ==================== INITIAL SETUP ====================
console.log(chalk.bold.magentaBright(`\n🚀 Starting ${BOT_NAME} WhatsApp Bot\n`));

// Ensure sessions directory exists
if (!existsSync(SESSION_FOLDER)) {
  mkdirSync(SESSION_FOLDER, { recursive: true });
  console.log(chalk.yellow(`Created sessions directory`));
}

// ==================== WHATSAPP CONNECTION ====================
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER);
  
  // Fetch latest version
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(chalk.blue(`Using WA v${version.join('.')}, isLatest: ${isLatest}`));

  const conn = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
    },
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '110.0.5481.100'],
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      return {
        conversation: "Hello from CrowBot!"
      }
    }
  });

  // ==================== EVENT HANDLERS ====================
  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log(chalk.yellow('Scan the QR code above to login'));
    }

    if (connection === 'open') {
      console.log(chalk.green('\n✅ Successfully connected to WhatsApp!'));
      console.log(chalk.blue(`Bot is ready to receive messages (Prefix: "${PREFIX}")`));
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect.error as Boom)?.output?.statusCode;
      console.log(chalk.red('\n⚠ Connection closed:'), statusCode || 'Unknown reason');
      
      // Reconnect if not logged out
      if (statusCode !== DisconnectReason.loggedOut) {
        console.log(chalk.yellow('Attempting to reconnect...'));
        setTimeout(connectToWhatsApp, 5000);
      } else {
        console.log(chalk.red('Please delete the sessions folder and rescan QR code'));
      }
    }
  });

  conn.ev.on('creds.update', saveCreds);

  // ==================== MESSAGE HANDLER ====================
  conn.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || '';
    const sender = msg.key.remoteJid;

    try {
      if (text.toLowerCase() === 'ping') {
        await conn.sendMessage(sender, { text: 'Pong! 🏓' });
      }
      else if (text.toLowerCase().startsWith(`${PREFIX}info`)) {
        await conn.sendMessage(sender, { 
          text: `*Bot Information*\n\n` +
                `Name: ${BOT_NAME}\n` +
                `Developer: ${DEVELOPER}\n` +
                `Prefix: ${PREFIX}\n` +
                `Status: Active`
        });
      }
    } catch (error) {
      console.error(chalk.red('Error handling message:'), error);
    }
  });

  // ==================== INDIAN NUMBER SUPPORT ====================
  async function registerIndianNumber() {
    try {
      const number = '+919876543210'; // Replace with your Indian number
      const formattedNumber = formatIndianNumber(number);
      
      if (!formattedNumber) {
        console.log(chalk.red('Invalid Indian number format'));
        return;
      }

      if (!conn.authState.creds.registered) {
        const code = await conn.requestPairingCode(formattedNumber);
        console.log(chalk.green(`Pairing code: ${code}`));
      }
    } catch (error) {
      console.error(chalk.red('Registration error:'), error);
    }
  }

  // Uncomment to enable number registration
  // registerIndianNumber();
}

// ==================== HELPER FUNCTIONS ====================
function formatIndianNumber(number) {
  // Remove all non-digit characters
  const cleaned = number.replace(/\D/g, '');
  
  // Check valid Indian formats:
  if (cleaned.length === 10) return `91${cleaned}`; // 9876543210 → 919876543210
  if (cleaned.length === 11 && cleaned.startsWith('0')) return `91${cleaned.slice(1)}`; // 09876543210 → 919876543210
  if (cleaned.length === 12 && cleaned.startsWith('91')) return cleaned; // 919876543210 → 919876543210
  
  return null;
}

function cleanupOldFiles() {
  try {
    // Clean session files older than 1 day
    const files = readdirSync(SESSION_FOLDER);
    files.forEach(file => {
      if (file !== 'creds.json') {
        const filePath = join(SESSION_FOLDER, file);
        const stats = statSync(filePath);
        const now = new Date().getTime();
        const fileAge = (now - stats.mtimeMs) / (1000 * 60 * 60);
        
        if (fileAge > 24) {
          unlinkSync(filePath);
          console.log(chalk.yellow(`Deleted old file: ${file}`));
        }
      }
    });
  } catch (error) {
    console.error(chalk.red('Cleanup error:'), error);
  }
}

// ==================== START THE BOT ====================
connectToWhatsApp();

// Schedule cleanup every 6 hours
setInterval(cleanupOldFiles, 6 * 60 * 60 * 1000);
