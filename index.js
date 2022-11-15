const {
  Client,
  LocalAuth,
  MessageMedia,
  Buttons,
  List,
} = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")
const { NormalizerId, TokenizerId, LangId, StemmerId } = require('@nlpjs/lang-id');
const { Container } = require('@nlpjs/core');
const { SentimentAnalyzer } = require('@nlpjs/sentiment');
const { VideoDownload } = require("./function/Downloader.js");
const { ScrapUser } = require("./function/tiktokScrap.js");
require("dotenv").config();

const client = new Client({
  authStrategy: new LocalAuth()
  ,
  puppeteer: {
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
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
    desc: "Tiktok video🟢\nTiktok story🔴\nTiktok multi image🟢\nIG stories🟢\nIG TV/REELS🟢\nIG post🔴\nTwitter video🟢\nTwitter image🟢\nYoutube🟢",
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
  {
    body: 'Search',
    id: 'searchIDs',
    desc: "Untuk mencari account sosial media seseorang hanya dengan username, sementara work hanya untuk tiktok",
    howTo: "Untuk menggunakan command ini silahkan sertakan username akun ynag ingin dicari dan diakhiri dengan !search",
    examplePics: "./img/searchIDs.jpg",
  },
  // {
  //   body: 'Owner',
  //   id: 'ownerIDs',
  //   desc: "Owner infomation",
  //   howTo: "Jika ada masalah boleh report ke yang buat",
  //   examplePics: "",
  // },
]

let request = []

const normalizer = new NormalizerId();
const tokenizer = new TokenizerId();
const stemmer = new StemmerId()

client.on("message", async (msg) => {
  const RECEIVED = msg.body.toUpperCase()
  const chat = await msg.getChat()
  // console.log(msg)

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
          const media = await MessageMedia.fromFilePath("./img/downloaderIDs.jpg")

          const buttons_reply = new Buttons('test', [{ body: 'Test', id: 'test-1' }], 'title', 'footer') // Reply button

          const buttons_media = new Buttons(media, [{ body: 'Test', id: 'test-1' }], 'title', 'footer') // Reply button

          const buttons_reply_url = new Buttons('test', [{ body: 'Test', id: 'test-1' }, { body: "Test 2", url: "https://example.com/" }], 'title', 'footer') // Reply button with URL

          const buttons_reply_call = new Buttons('test', [{ body: 'Test', id: 'test-1' }, { body: "Test 2 Call", url: "+62 882-2857-3141" }], 'title', 'footer') // Reply button with call button

          const buttons_reply_call_url = new Buttons('test', [{ body: 'Test', id: 'test-1' }, { body: "Test 2 Call", url: "+62 882-2857-3141" }, { body: 'Test 3 URL', url: 'https://example.com/' }], 'title', 'footer') // Reply button with call button & url button

          const section = {
            title: 'test',
            rows: [
              {
                title: 'Test 1',
              },
              {
                title: 'Test 2',
                id: 'test-2'
              },
              {
                title: 'Test 3',
                description: 'This is a smaller text field, a description'
              },
              {
                title: 'Test 4',
                description: 'This is a smaller text field, a description',
                id: 'test-4',
              }
            ],
          };
          const list = new List('test', 'click me', [section], 'title', 'footer')

          for (const component of [buttons_reply, buttons_media, buttons_reply_url, buttons_reply_call, buttons_reply_call_url]) await chat.sendMessage(component);
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
        case "TWT":
          await msg.react("👍")
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

        await chat.sendStateRecording()
        try {
          await chat.sendStateRecording()
          let videometa = {}

          await VideoDownload(getLink)
            .then((response) => videometa = response);
          const { hosting, thumbnail, title, duration, urls } = videometa

          if (!videometa) return chat.sendMessage("Error harap ulangi sekali lagi")

          const sendList = []
          await chat.sendStateRecording()

          if (hosting === 'youtube.com') {
            for (const url of urls) {
              sendList.push({
                title: `${url.resolution} (${url.filesize})` || "No title",
                description: title,
                id: url.url + ' dl' + ' yt',
              })
              await chat.sendStateRecording()
            }
          } else {
            for (const url of urls) {
              sendList.push({
                title: url.extention || "No title",
                description: title,
                id: url.url + ' dl',
              })
              await chat.sendStateRecording()
            }
          }

          const media = await MessageMedia.fromUrl(thumbnail, { unsafeMime: true })

          const section = {
            title: 'List Video',
            rows: sendList,
          };
          const list = new List(`*Hosting* : ${hosting}\n*Title* : ${title}\n*Duration* : ${duration}\n*Link* : ${getLink}`, 'List Video', [section], 'Requested', 'Created by Bot')

          await chat.sendMessage(media)
          await chat.sendMessage(list)
          await msg.react("👍")
        } catch (err) {
          chat.sendMessage("Error harap ulangi sekali lagi")
        }
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
      } else if (RECEIVED.endsWith(" !SEARCH")) {
        let metadata = {}
        const username = msg.body.split(" ")[0]

        await chat.sendStateRecording()
        await ScrapUser(username)
          .then((response) => metadata = response);

        if (!metadata) return chat.sendMessage("Error harap ulangi sekali lagi")

        const { image, Title, Following, Followers, Likes, Subtitle, Bio, Link, videos } = metadata

        const sendlist = []
        for (const video of videos) {
          sendlist.push({
            title: video.title || 'No Title',
            description: video.views,
            id: video.link + ' req',
          })
          await chat.sendStateRecording()
        }

        const section = {
          title: 'List Video',
          rows: sendlist,
        };

        const media = await MessageMedia.fromUrl(image, { unsafeMime: true })
        const list = new List(`*Username* : ${Title}\n*Name* : ${Subtitle}\n*Following* : ${Following}\n*Followers* : ${Followers}\n*Likes* : ${Likes}\n*Bio* : ${Bio}\n*Link* : ${Link}`, 'List Video', [section], 'Requested', 'Created by Bot')

        await chat.sendMessage(media)
        await chat.sendMessage(list)
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

    if (msg.type === 'list_response') {
      const type = msg.selectedRowId.split(" ")[1]
      const isYt = msg?.selectedRowId.split(" ")[2]
      const link = msg.selectedRowId.split(" ")[0]
      if (type === 'req') {
        await chat.sendMessage(`${msg.body}\n${link}`)
      } else if (type === 'dl') {
        if (isYt === 'yt') {
          await chat.sendMessage(`Download link: ${link}`)
          return msg.react("👍")
        }
        const media = await MessageMedia.fromUrl(link, { unsafeMime: true })
        await chat.sendMessage(media)
        await msg.react("👍")
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