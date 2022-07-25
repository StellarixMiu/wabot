const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const axios = require('axios')
require('dotenv').config()

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { 
    executablePath: './Chrome/Application/chrome.exe',
    headless: true
  },
  ffmpegPath: './ffmpeg/bin/ffmpeg.exe'
});

client.initialize();

client.on('qr', (qr) => {
  qrcode.generate(qr, {small: true});
  console.log('QR RECEIVED', qr)
});

client.on('authenticated', () => {
  console.log('AUTHENTICATED')
});

client.on('auth_failure', msg => {
  console.error('AUTHENTICATION FAILURE', msg)
});

client.on('ready', () => {
  console.log('READY')
});

client.on('message', async (msg) => {
  console.log("MESSAGE RECEIVED: " + msg.body)
  
  if (msg.body.endsWith(" !d")) {
    const chat = await msg.getChat()
    const getLink = msg.body.split(" ")[0]
    const response = await axios.get(process.env.GET_URL + getLink)
    const videoUrl = response.data.vid
    chat.sendStateRecording()
    const media = await MessageMedia.fromUrl(videoUrl, {
      unsafeMime: true
    })
    chat.sendMessage(media, {
      sendMediaAsDocument: true,
    })
  }else if(msg.body === "!s"){
    const chat = await msg.getChat()
    if(!msg.hasMedia) {
      msg.reply("Need a media!!")
    }else {
      chat.sendStateRecording()
      const dataSticker = await msg.downloadMedia()
      chat.sendMessage(dataSticker,{
        sendMediaAsSticker: true,
        stickerAuthor: 'Stellar by Krisna',
        stickerName: 'Created by Bot'
      })
    }
  }
  
});