const {
  Client,
  LocalAuth,
  MessageMedia,
  Buttons,
  List,
} = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")
const { NormalizerId, TokenizerId, LangId, StemmerId  } = require('@nlpjs/lang-id');
const { Container } = require('@nlpjs/core');
const { SentimentAnalyzer } = require('@nlpjs/sentiment');
const { VideoDownload } = require("./function/Downloader.js")
const { MongoDBConnect, setDatabase } = require("./Database/Controllers/datasetBot.js")
require("dotenv").config()

const client = new Client({
  authStrategy: new LocalAuth()
  ,
  puppeteer: {
    executablePath: "./Chrome/Application/chrome.exe",
    headless: true,
  },
  ffmpegPath: "./ffmpeg/bin/ffmpeg.exe",
});


client.initialize()
  .then(async () => {
    let wwwversion = await client.getWWebVersion()
    console.log('Version: ', wwwversion)
  })

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true })
  console.log("QR RECEIVED", qr)
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED")
});

client.on("auth_failure", (msg) => {
  console.error("AUTHENTICATION FAILURE", msg)
});

client.on("ready", async () => {
  console.log("READY")
});

const owner = process.env.OWNER_ID
const bot = process.env.BOT_ID

let buttonsMenu = [
  {
    body: 'Downloader',
    id: 'downloaderIDs',
    desc: "Tiktok video🟢\nTiktok story🟢\nTiktok multi image🟢\nIG stories🟢\nIG TV/REELS🟢\nIG post🔴\nTwitter video🟢\nTwitter image🟢\nYoutube🔴",
    howTo: "Untuk menggunakan command ini silahkan sertakan link dan diakhiri dengan !d",
    examplePics: "./img/downloaderIDs.jpg",
  },
  {
    body: 'Sticker',
    id: 'stickerIDs',
    desc: "Sticker support semua format",
    howTo: "Untuk menggunakan command ini silahkan sertakan image/video diakhiri dengan !s",
    examplePics: "./img/stickerIDs.jpg",
  },
  {
    body: 'Resend',
    id: 'resendIDs',
    desc: "Resend pesan atau media",
    howTo: "Untuk menggunakan command ini silahkan sertakan quoted pesan/reply pesan diakhiri dengan !r",
    examplePics: "./img/resendIDs.jpg",
  },
  // {
  //   body: 'Owner',
  //   id: 'ownerIDs',
  //   desc: "Owner infomation",
  //   howTo: "Jika ada masalah boleh report ke yang buat",
  //   examplePics: "",
  // },
]

const normalizer = new NormalizerId();
const tokenizer = new TokenizerId();
const stemmer = new StemmerId()

client.on("message", async (msg) => {
  const RECEIVED = msg.body.toUpperCase()
  const chat = await msg.getChat()

  try {
    //Owner Commands
    if (msg.from === owner || msg.author === owner) {
      const getAllChats = await client.getChats()
      const chatIDs = []
      switch (RECEIVED) {
        case "BC":
          let message = ""
          for (let i = 0; i < getAllChats.length; i++) {
            chatIDs.push(getAllChats[i].id._serialized)
          }
          chat.sendMessage("Ketikan pesan yang ingin dikirim:")
          client.once("message", async (ownerMsg) => {
            if (ownerMsg.from === owner || ownerMsg.author === owner) {
              message = ownerMsg.body
              for (let i = 0; i < chatIDs.length; i++) {
                await client.sendMessage(chatIDs[i], "📢 *Broadcast dari Developer* 📢")
                await client.sendMessage(chatIDs[i], message)
              }
              await ownerMsg.reply("Successfully!!")
              await ownerMsg.react("👍")
            }
          })
          break
        case "NEWS":
          for (let i = 0; i < getAllChats.length; i++) {
            chatIDs.push(getAllChats[i].id._serialized)
          }
          for (let i = 0; i < chatIDs.length; i++) {
            const button = []
            for (const buttonMenu of buttonsMenu) {
              button.push({
                body: buttonMenu.body,
                id: buttonMenu.id,
              })
            }
            const buttonsReply = new Buttons(
              'Untuk melihat penggunaan commands silahkan klik tombol dibawah',
              button,
              'Stellarix Miu',
              'Created by Bot'
            )
            await client.sendMessage(chatIDs[i], buttonsReply)
          }
          await msg.reply("Successfully!!")
          await msg.react("👍")
          break
        case "!T":
          const section = {
            title: "test",
            rows: [
              {
                title: "Test 1",
              },
              {
                title: "Test 2",
                id: "test-2",
              },
              {
                title: "Test 3",
                description: "This is a smaller text field, a description",
              },
              {
                title: "Test 4",
                description: "This is a smaller text field, a description",
                id: "test-4",
              },
            ],
          };
          const list = new List("test", "click me", [section], "title", "footer");
          await chat.sendMessage(list);
          break
        case "!Q":
          const container = new Container();
          container.use(LangId);

          const input = 'Dimanakah Anjing saya, affh iyh?';

          const resultNormalizer = normalizer.normalize(input.toLocaleLowerCase());
          const resultTokenizer = tokenizer.tokenize(resultNormalizer);
          const resultStemmer = stemmer.stem(resultTokenizer)
          
          console.log(resultStemmer)

          // const sentiment = new SentimentAnalyzer({ container });
          // const result = await sentiment.process({
          //   locale: 'id',
          //   text: resultNormalizer,
          // });
          // console.log(result.sentiment);

          break
      }

    }

    if (msg.from !== "status@broadcast") {
      //RECEIVED MSG
      if (RECEIVED === "MENU") {
        const button = []
        for (const buttonMenu of buttonsMenu) {
          button.push({
            body: buttonMenu.body,
            id: buttonMenu.id,
          })
        }
        const buttonsReply = new Buttons(
          'Untuk melihat penggunaan commands silahkan klik tombol dibawah',
          button,
          'Stellarix Miu',
          'Created by Bot'
        )
        await chat.sendMessage(buttonsReply)
      } else if (RECEIVED.endsWith(" !D")) {
        const getLink = msg.body.split(" ")[0]
        let videoInfo = {}
        await VideoDownload(getLink)
          .then((response) => videoInfo = response)
        await chat.sendStateRecording()

        if (videoInfo === undefined) return chat.sendMessage("Invalid video!!")
        if (videoInfo.hosting === "101") return chat.sendMessage("Maaf untuk youtube tidak bisa ❌")

        const url = videoInfo.url
        const media = await MessageMedia.fromUrl(url[0].url, {
          unsafeMime: true,
        })

        await chat.sendMessage(media)
        await msg.react("👍")
      } else if (RECEIVED === "!S") {
        if (!msg.hasMedia) return msg.reply("Need a media!!");
        chat.sendStateRecording();
        const dataSticker = await msg.downloadMedia();
        chat.sendMessage(dataSticker, {
          sendMediaAsSticker: true,
          stickerAuthor: "Stellarix Miu",
          stickerName: "Created by Bot",
        });
        await msg.react("👍");
      } else if (RECEIVED.endsWith("!R")) {
        resendMessage(msg)
      } else if (RECEIVED === "!ALL") {
        let text = "";
        let mentions = [];
        if (!chat.isGroup) return chat.sendMessage("Hanya Bisa digunakan di grup")
        for (let participant of chat.participants) {
          const contact = await client.getContactById(participant.id._serialized);
          mentions.push(contact);
          text += `@${participant.id.user} `;
        }
        await chat.sendMessage(text, { mentions });
      }

      for (const buttonMenu of buttonsMenu) {
        if (buttonMenu.id === msg.selectedButtonId) {
          await chat.sendMessage(buttonMenu.desc)
          if (buttonMenu.examplePics !== "") {
            const media = await MessageMedia.fromFilePath(buttonMenu.examplePics)
            await chat.sendMessage(media, {
              caption: buttonMenu.howTo
            })
          } else {
            await chat.sendMessage(buttonMenu.howTo)
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
});

const resendMessage = async (msg) => {
  const chat = await msg.getChat()
  const quotedMsg = await msg.getQuotedMessage();
  let body = msg.body
  let attachmentData = {}
  let hasMedia = false
  let type = ""

  if (msg.hasQuotedMsg) {
    body = quotedMsg.body
    hasMedia = quotedMsg.hasMedia
    type = quotedMsg.type
    attachmentData = await quotedMsg.downloadMedia();
  } else {
    type = msg.type
    hasMedia = msg.hasMedia
    attachmentData = await msg.downloadMedia();
  }

  if (!hasMedia) {
    return await msg.reply("Need a media!!");
  } else {
    let sticker = false
    let document = false
    let voice = false
    // Check attachmentData type
    if (type === "sticker") {
      sticker = true
    } else if (type === "document") {
      document = true
    } else if (type === "audio" || type === "ptt") {
      voice = true
    }
    await chat.sendMessage(attachmentData, {
      caption: body,
      sendAudioAsVoice: voice,
      sendMediaAsSticker: sticker,
      sendMediaAsDocument: document,
    });
  }
  await chat.sendMessage("Here\'s your requested.")
  await msg.react("👍");
}

/* POS-CLIENT */

// const POSclient = new Client({
//   authStrategy: new LocalAuth({ clientId: "POS-client" }),
//   puppeteer: {
//     executablePath: "./Chrome/Application/chrome.exe",
//     headless: true,
//   },
//   ffmpegPath: "./ffmpeg/bin/ffmpeg.exe",
// });

// POSclient.initialize()
//   .then(async () => {
//     let wwwversion = await client.getWWebVersion()
//     console.log('Version: ', wwwversion)
//   })

// POSclient.on("qr", (qr) => {
//   qrcode.generate(qr, { small: true })
//   console.log("QR RECEIVED", qr)
// });

// POSclient.on("authenticated", () => {
//   console.log("AUTHENTICATED")
// });

// POSclient.on("auth_failure", (msg) => {
//   console.error("AUTHENTICATION FAILURE", msg)
// });

// POSclient.on("ready", async () => {
//   console.log("READY")
// });