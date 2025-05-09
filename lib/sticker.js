import { dirname } from 'path'
import { fileURLToPath } from 'url'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { ffmpeg } from './converter.js'
import fluent_ffmpeg from 'fluent-ffmpeg'
import { spawn } from 'child_process'
import uploadFile from './uploadFile.js'
import uploadImage from './uploadImage.js'
import { fileTypeFromBuffer } from 'file-type'
import webp from 'node-webpmux'
import fetch from 'node-fetch'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tmp = path.join(__dirname, '../tmp')

function sticker2(img, url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (url) {
        const res = await fetch(url)
        if (res.status !== 200) throw await res.text()
        img = await res.buffer()
      }
      const inp = path.join(tmp, +new Date + '.jpeg')
      await fs.promises.writeFile(inp, img)
      const ff = spawn('ffmpeg', [
        '-y',
        '-i', inp,
        '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1',
        '-f', 'png',
        '-'
      ])
      ff.on('error', reject)
      ff.on('close', async () => {
        await fs.promises.unlink(inp)
      })
      const bufs = []
      const [_spawnprocess, ..._spawnargs] = [...(module.exports.support.gm ? ['gm'] : module.exports.magick ? ['magick'] : []), 'convert', 'png:-', 'webp:-']
      const im = spawn(_spawnprocess, _spawnargs)
      im.on('error', e => conn.reply(m.chat, util.format(e), m))
      im.stdout.on('data', chunk => bufs.push(chunk))
      ff.stdout.pipe(im.stdin)
      im.on('exit', () => {
        resolve(Buffer.concat(bufs))
      })
    } catch (e) {
      reject(e)
    }
  })
}

async function sticker3(img, url, packname = 'My Sticker Pack', author = 'ᥴꫝꫀꪗ-𝙎𝙖𝙣🫧𝓐𝔂𝓷𝓪💖🔮🌙🎀✨') {
  url = url ? url : await uploadFile(img)
  const res = await fetch('https://api.xteam.xyz/sticker/wm?' + new URLSearchParams({ url, packname, author }))
  return await res.buffer()
}

async function sticker4(img, url) {
  if (url) {
    const res = await fetch(url)
    if (res.status !== 200) throw await res.text()
    img = await res.buffer()
  }
  return await ffmpeg(img, [
    '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
  ], 'jpeg', 'webp')
}

async function sticker5(img, url, packname = 'My Sticker Pack', author = 'ᥴꫝꫀꪗ-𝙎𝙖𝙣🫧𝓐𝔂𝓷𝓪💖🔮🌙🎀✨', categories = [''], extra = {}) {
  const { Sticker } = await import('wa-sticker-formatter')
  const stickerMetadata = {
    type: 'default',
    pack: packname,
    author,
    categories,
    ...extra
  }
  return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}

function sticker6(img, url) {
  return new Promise(async (resolve, reject) => {
    if (url) {
      const res = await fetch(url)
      if (res.status !== 200) throw await res.text()
      img = await res.buffer()
    }
    const type = await fileTypeFromBuffer(img) || {
      mime: 'application/octet-stream',
      ext: 'bin'
    }
    if (type.ext == 'bin') reject(img)
    const tmpFile = path.join(__dirname, `../tmp/${+ new Date()}.${type.ext}`)
    const out = path.join(tmpFile + '.webp')
    await fs.promises.writeFile(tmpFile, img)

    const Fffmpeg = /video/i.test(type.mime) ? fluent_ffmpeg(tmpFile).inputFormat(type.ext) : fluent_ffmpeg(tmpFile).input(tmpFile)
    Fffmpeg
      .on('error', function (err) {
        console.error(err)
        fs.promises.unlink(tmpFile)
        reject(img)
      })
      .on('end', async function () {
        fs.promises.unlink(tmpFile)
        resolve(await fs.promises.readFile(out))
      })
      .addOutputOptions([
        `-vcodec`, `libwebp`, `-vf`,
        `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`
      ])
      .toFormat('webp')
      .save(out)
  })
}

async function addExif(webpSticker, packname = 'My Sticker Pack', author = 'ᥴꫝꫀꪗ-𝙎𝙖𝙣🫧𝓐𝔂𝓷𝓪💖🔮🌙🎀✨', categories = [''], extra = {}) {
  const img = new webp.Image()
  const stickerPackId = crypto.randomBytes(32).toString('hex')
  const json = {
    'sticker-pack-id': stickerPackId,
    'sticker-pack-name': packname,
    'sticker-pack-publisher': author,
    'emojis': categories,
    ...extra
  }
  const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
  const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
  const exif = Buffer.concat([exifAttr, jsonBuffer])
  exif.writeUIntLE(jsonBuffer.length, 14, 4)
  await img.load(webpSticker)
  img.exif = exif
  return await img.save(null)
}

async function sticker(img, url) {
  let lastError, stiker
  for (const func of [
    sticker3,
    global.support.ffmpeg && sticker6,
    sticker5,
    global.support.ffmpeg && global.support.ffmpegWebp && sticker4,
    global.support.ffmpeg && (global.support.convert || global.support.magick || global.support.gm) && sticker2,
  ].filter(f => f)) {
    try {
      stiker = await func(img, url, 'My Sticker Pack', 'ᥴꫝꫀꪗ-𝙎𝙖𝙣🫧𝓐𝔂𝓷𝓪💖🔮🌙🎀✨')
      if (stiker.includes('html')) continue
      if (stiker.includes('WEBP')) {
        try {
          return await addExif(stiker, 'My Sticker Pack', 'ᥴꫝꫀꪗ-𝙎𝙖𝙣🫧𝓐𝔂𝓷𝓪💖🔮🌙🎀✨')
        } catch (e) {
          console.error(e)
          return stiker
        }
      }
      throw stiker.toString()
    } catch (err) {
      lastError = err
      continue
    }
  }
  console.error(lastError)
  return lastError
}

const support = {
  ffmpeg: true,
  ffprobe: true,
  ffmpegWebp: true,
  convert: true,
  magick: false,
  gm: false,
  find: false
}

export {
  sticker,
  sticker2,
  sticker3,
  sticker4,
  sticker6,
  addExif,
  support
}
