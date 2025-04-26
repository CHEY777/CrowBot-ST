process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
import './config.js';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import fs, { readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import { createSubBot } from './plugins/sub-bot.js';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import boxen from 'boxen';
import P from 'pino';
import pino from 'pino';
import Pino from 'pino';
import path, { join, dirname } from 'path';
import { Boom } from '@hapi/boom';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';
import store from './lib/store.js';
const { proto } = (await import('@whiskeysockets/baileys')).default;
import pkg from 'google-libphonenumber';
const { PhoneNumberUtil } = pkg;
const phoneUtil = PhoneNumberUtil.getInstance();
const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } = await import('@whiskeysockets/baileys');
import readline, { createInterface } from 'readline';
import NodeCache from 'node-cache';
const { CONNECTING } = ws;
const { chain } = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

// Bot Configuration
const BOT_NAME = "CrowBot";
const DEVELOPER = "WillZek";
const SESSION_FOLDER = 'sessions';
const SUB_BOTS_FOLDER = 'sub-bots';

// Initialize console with bot branding
console.log(chalk.bold.redBright(`\n✰ Starting ${BOT_NAME} ✰\n`));

cfonts.say(BOT_NAME, {
  font: 'block',
  align: 'center',
  colors: ['magentaBright']
});

cfonts.say(`Developed By • ${DEVELOPER}`, {
  font: 'console',
  align: 'center',
  colors: ['blueBright']
});

// Global helper functions
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};

global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};

global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

// API configuration
global.API = (name, path = '/', query = {}, apikeyqueryname) => 
  (name in global.APIs ? global.APIs[name] : name) + path + 
  (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
    ...query,
    ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {})
  })) : '');

global.timestamp = { start: new Date() };

// Command prefix configuration
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[#/!.]');

// Database initialization
global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? 
  new cloudDBAdapter(opts['db']) : 
  new JSONFile('./media/database/database.json'));

global.DATABASE = global.db;

// Load database function
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) => setInterval(async function() {
      if (!global.db.READ) {
        clearInterval(this);
        resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
      }
    }, 1 * 1000));
  }
  
  if (global.db.data !== null) return;
  
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  };
  
  global.db.chain = chain(global.db.data);
};

await loadDatabase();

// WhatsApp connection setup
const { state, saveState, saveCreds } = await useMultiFileAuthState(global.sessions);
const msgRetryCounterMap = (MessageRetryMap) => {};
const msgRetryCounterCache = new NodeCache();
const { version } = await fetchLatestBaileysVersion();
let phoneNumber = global.botNumber;

// Authentication methods
const methodQR = process.argv.includes("qr");
const methodCode = !!phoneNumber || process.argv.includes("code");
const methodMobile = process.argv.includes("mobile");

// Authentication selection
let authMethod;
if (methodQR) {
  authMethod = '1';
} else if (!methodQR && !methodCode && !fs.existsSync(`./${SESSION_FOLDER}/creds.json`)) {
  const prompt = chalk.bgMagenta.white('⌨ Choose an option:\n') + 
                chalk.bold.green('1. QR Code\n') + 
                chalk.bold.cyan('2. 8-digit pairing code\n--> ');
  
  do {
    authMethod = await question(prompt);
    if (!/^[1-2]$/.test(authMethod)) {
      console.log(chalk.bold.redBright(`✦ Only numbers 1 or 2 are allowed`));
    }
  } while (authMethod !== '1' && authMethod !== '2' || fs.existsSync(`./${SESSION_FOLDER}/creds.json`));
}

// Connection options
const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal: authMethod == '1' ? true : methodQR ? true : false,
  mobile: methodMobile,
  browser: ['Ubuntu', 'Chrome', '110.0.1587.56'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  getMessage: async (key) => {
    let jid = jidNormalizedUser(key.remoteJid);
    let msg = await store.loadMessage(jid, key.id);
    return msg?.message || "";
  },
  msgRetryCounterCache,
  msgRetryCounterMap,
  defaultQueryTimeoutMs: undefined,
  version,
};

global.conn = makeWASocket(connectionOptions);

// Handle authentication for pairing code method
if (!fs.existsSync(`./${SESSION_FOLDER}/creds.json`)) {
  if (authMethod === '2' || methodCode) {
    if (!conn.authState.creds.registered) {
      let numberToRegister;
      
      if (phoneNumber) {
        numberToRegister = phoneNumber.replace(/[^0-9]/g, '');
      } else {
        do {
          phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(
            `✦ Please enter your WhatsApp number\n` +
            `✏ Example: 919876543210 (India) or 573211234567 (Colombia)\n` +
            `---> `)));
          
          phoneNumber = phoneNumber.replace(/\D/g, '');
          
          // Handle Indian numbers (add +91 if not present)
          if (phoneNumber.startsWith('9') && phoneNumber.length === 10) {
            phoneNumber = `91${phoneNumber}`;
          } else if (phoneNumber.startsWith('0')) {
            phoneNumber = `91${phoneNumber.substring(1)}`;
          }
          
          if (!phoneNumber.startsWith('+')) {
            phoneNumber = `+${phoneNumber}`;
          }
        } while (!await isValidPhoneNumber(phoneNumber));
        
        rl.close();
        numberToRegister = phoneNumber.replace(/\D/g, '');
      }
      
      setTimeout(async () => {
        try {
          const pairingCode = await conn.requestPairingCode(numberToRegister);
          const formattedCode = pairingCode?.match(/.{1,4}/g)?.join("-") || pairingCode;
          console.log(chalk.bold.white(chalk.bgMagenta(`✧ PAIRING CODE ✧`)), chalk.bold.white(chalk.white(formattedCode)));
        } catch (error) {
          console.error(chalk.bold.red('Error getting pairing code:'), error);
        }
      }, 3000);
    }
  }
}

// Connection status flags
conn.isInit = false;
conn.well = false;

// Auto-save database and clean tmp files
if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data) await global.db.write();
      if (opts['autocleartmp']) {
        const tmpDirs = [os.tmpdir(), 'tmp', SUB_BOTS_FOLDER];
        tmpDirs.forEach((dir) => {
          spawn('find', [dir, '-amin', '3', '-type', 'f', '-delete']);
        });
      }
    }, 30 * 1000);
  }
}

// Connection update handler
async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update;
  global.stopped = connection;
  
  if (isNewLogin) conn.isInit = true;
  
  const code = lastDisconnect?.error?.output?.statusCode || 
               lastDisconnect?.error?.output?.payload?.statusCode;
  
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error);
    global.timestamp.connect = new Date;
  }
  
  if (global.db.data == null) loadDatabase();
  
  // Show QR code if needed
  if (update.qr != 0 && update.qr != undefined || methodQR) {
    if (authMethod == '1' || methodQR) {
      console.log(chalk.bold.yellow(`\n❐ Scan the QR code (expires in 45 seconds)`));
    }
  }
  
  // Connection status messages
  if (connection == 'open') {
    console.log(chalk.bold.green('\n❀ Successfully connected to WhatsApp ❀'));
  }
  
  if (connection === 'close') {
    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
    
    const errorMessages = {
      [DisconnectReason.badSession]: `\n⚠︎ Connection failed. Please delete the ${SESSION_FOLDER} folder and scan the QR code again`,
      [DisconnectReason.connectionClosed]: `\n⚠︎ Connection closed. Reconnecting...`,
      [DisconnectReason.connectionLost]: `\n⚠︎ Connection to server lost. Reconnecting...`,
      [DisconnectReason.connectionReplaced]: `\n⚠︎ Connection replaced by another session. Please close the current session first.`,
      [DisconnectReason.loggedOut]: `\n⚠︎ Logged out. Please delete the ${SESSION_FOLDER} folder and scan the QR code again`,
      [DisconnectReason.restartRequired]: `\n⚠︎ Server restart required. Reconnecting...`,
      [DisconnectReason.timedOut]: `\n⚠︎ Connection timed out. Reconnecting...`,
    };
    
    if (errorMessages[reason]) {
      console.log(chalk.bold.cyanBright(errorMessages[reason]));
    } else {
      console.log(chalk.bold.redBright(`\n⚠︎ Unknown disconnect reason: ${reason || 'Unknown'}`));
    }
    
    if ([DisconnectReason.connectionClosed, DisconnectReason.connectionLost, 
         DisconnectReason.loggedOut, DisconnectReason.restartRequired, 
         DisconnectReason.timedOut].includes(reason)) {
      await global.reloadHandler(true).catch(console.error);
    }
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', console.error);

// Plugin system
const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};

async function loadPlugins() {
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename));
      const module = await import(file);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      conn.logger.error(e);
      delete global.plugins[filename];
    }
  }
}

// Reload handler
let isInit = true;
let handler = await import('./handler.js');

global.reloadHandler = async function(restartConnection) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Object.keys(Handler || {}).length) handler = Handler;
  } catch (e) {
    console.error(e);
  }
  
  if (restartConnection) {
    const oldChats = global.conn.chats;
    try {
      global.conn.ws.close();
    } catch (e) {}
    
    conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions, { chats: oldChats });
    isInit = true;
  }
  
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler);
    conn.ev.off('connection.update', conn.connectionUpdate);
    conn.ev.off('creds.update', conn.credsUpdate);
  }
  
  conn.handler = handler.handler.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn, true);
  
  conn.ev.on('messages.upsert', conn.handler);
  conn.ev.on('connection.update', conn.connectionUpdate);
  conn.ev.on('creds.update', conn.credsUpdate);
  
  isInit = false;
  return true;
};

// Sub-bots system
global.subBotsPath = join(__dirname, `./${SUB_BOTS_FOLDER}`);

if (global.enableSubBots) {
  if (!existsSync(global.subBotsPath)) {
    mkdirSync(global.subBotsPath, { recursive: true });
    console.log(chalk.bold.cyan(`Created folder: ${SUB_BOTS_FOLDER}`));
  } else {
    console.log(chalk.bold.cyan(`Folder already exists: ${SUB_BOTS_FOLDER}`));
  }
  
  const subBots = readdirSync(subBotsPath);
  if (subBots.length > 0) {
    const credsFile = 'creds.json';
    
    for (const botFolder of subBots) {
      const botPath = join(subBotsPath, botFolder);
      const botFiles = readdirSync(botPath);
      
      if (botFiles.includes(credsFile)) {
        createSubBot({
          botPath: botPath,
          conn: conn,
          command: 'serbot'
        });
      }
    }
  }
}

// Initialize plugins
await loadPlugins().then((_) => Object.keys(global.plugins)).catch(console.error);

// Plugin hot-reload
global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    
    if (filename in global.plugins) {
      if (existsSync(dir)) {
        conn.logger.info(`Updated plugin - '${filename}'`);
      } else {
        conn.logger.warn(`Deleted plugin - '${filename}'`);
        return delete global.plugins[filename];
      }
    } else {
      conn.logger.info(`New plugin - '${filename}'`);
    }
    
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    
    if (err) {
      conn.logger.error(`Syntax error in '${filename}'\n${format(err)}`);
    } else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
        global.plugins[filename] = module.default || module;
      } catch (e) {
        conn.logger.error(`Error loading plugin '${filename}'\n${format(e)}`);
      } finally {
        global.plugins = Object.fromEntries(
          Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
        );
      }
    }
  }
};

Object.freeze(global.reload);
watch(pluginFolder, global.reload);
await global.reloadHandler();

// System checks
async function systemCheck() {
  const test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version']),
  ].map((p) => {
    return Promise.race([
      new Promise((resolve) => {
        p.on('close', (code) => {
          resolve(code !== 127);
        });
      }),
      new Promise((resolve) => {
        p.on('error', (_) => resolve(false));
      })
    ]);
  }));
  
  const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  const s = global.support = { ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find };
  Object.freeze(global.support);
}

// Cleanup functions
function clearTmp() {
  const tmpDir = join(__dirname, 'tmp');
  const filenames = readdirSync(tmpDir);
  filenames.forEach(file => {
    const filePath = join(tmpDir, file);
    unlinkSync(filePath);
  });
}

function purgeSessions() {
  let prekeys = [];
  let sessionFiles = readdirSync(`./${SESSION_FOLDER}`);
  let preKeyFiles = sessionFiles.filter(file => file.startsWith('pre-key-'));
  
  prekeys = [...prekeys, ...preKeyFiles];
  preKeyFiles.forEach(file => {
    unlinkSync(`./${SESSION_FOLDER}/${file}`);
  });
}

function purgeSubBotSessions() {
  try {
    const botFolders = readdirSync(`./${SUB_BOTS_FOLDER}/`);
    let subBotPrekeys = [];
    
    botFolders.forEach(folder => {
      if (statSync(`./${SUB_BOTS_FOLDER}/${folder}`).isDirectory()) {
        const botFiles = readdirSync(`./${SUB_BOTS_FOLDER}/${folder}`).filter(file => 
          file.startsWith('pre-key-')
        );
        
        subBotPrekeys = [...subBotPrekeys, ...botFiles];
        botFiles.forEach(file => {
          if (file !== 'creds.json') {
            unlinkSync(`./${SUB_BOTS_FOLDER}/${folder}/${file}`);
          }
        });
      }
    });
    
    if (subBotPrekeys.length === 0) {
      console.log(chalk.bold.green(`\n╭» ❍ ${SUB_BOTS_FOLDER} ❍\n│→ Nothing to delete \n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ✓`));
    } else {
      console.log(chalk.bold.cyanBright(`\n╭» ❍ ${SUB_BOTS_FOLDER} ❍\n│→ Non-essential files deleted\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ✓`));
    }
  } catch (err) {
    console.log(chalk.bold.red(`\n╭» ❍ ${SUB_BOTS_FOLDER} ❍\n│→ Error occurred\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ✗\n` + err));
  }
}

function purgeOldFiles() {
  const directories = [`./${SESSION_FOLDER}/`, `./${SUB_BOTS_FOLDER}/`];
  
  directories.forEach(dir => {
    readdirSync(dir, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        if (file !== 'creds.json') {
          const filePath = path.join(dir, file);
          unlinkSync(filePath, err => {
            if (err) {
              console.log(chalk.bold.red(`\n╭» ❍ File ❍\n│→ ${file} could not be deleted\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ✗\n` + err));
            } else {
              console.log(chalk.bold.green(`\n╭» ❍ File ❍\n│→ ${file} deleted successfully\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ✓`));
            }
          });
        }
      });
    });
  });
}

// Scheduled cleanup tasks
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await clearTmp();
  console.log(chalk.bold.cyanBright(`\n╭» ❍ Media ❍\n│→ Temporary files cleared\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ✓`));
}, 1000 * 60 * 4); // 4 minutes

setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeSessions();
  console.log(chalk.bold.cyanBright(`\n╭» ❍ ${SESSION_FOLDER} ❍\n│→ Non-essential sessions cleared\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ✓`));
}, 1000 * 60 * 10); // 10 minutes

setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeSubBotSessions();
}, 1000 * 60 * 10); // 10 minutes

setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeOldFiles();
  console.log(chalk.bold.cyanBright(`\n╭» ❍ Files ❍\n│→ Residual files cleared\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ✓`));
}, 1000 * 60 * 10); // 10 minutes

// Run system check
systemCheck().then(() => conn.logger.info(chalk.bold(`✦ D O N E\n`.trim()))).catch(console.error);

// Phone number validation
async function isValidPhoneNumber(number) {
  try {
    number = number.replace(/\s+/g, '');
    
    // Handle Indian numbers specifically
    if (number.startsWith('+91') && number.length === 13) {
      // Valid Indian format (+91XXXXXXXXXX)
    } else if (number.startsWith('91') && number.length === 12) {
      number = `+${number}`;
    } else if (number.startsWith('0') && number.length === 11) {
      number = `+91${number.substring(1)}`;
    } else if (number.length === 10) {
      number = `+91${number}`;
    }
    
    const parsedNumber = phoneUtil.parseAndKeepRawInput(number);
    return phoneUtil.isValidNumber(parsedNumber);
  } catch (error) {
    return false;
  }
}
