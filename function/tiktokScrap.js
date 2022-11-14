const puppeteer = require('puppeteer-extra')
const blockResourcesPlugin = require('puppeteer-extra-plugin-block-resources')()
const StealthPlugin = require('puppeteer-extra-plugin-stealth')()
require("dotenv").config();


const owner = process.env.OWNER_ID

puppeteer.use(StealthPlugin)
puppeteer.use(blockResourcesPlugin)

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function ScrapUser(username, msg) {
  const url = "https://www.tiktok.com/@" + username
  try {
    const userResponse = []
    
    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      // userDataDir: "C:/Users/krisn/AppData/Local/Google/Chrome/User Data/Profile 4",
      headless: true,
    });

    const incognito = await browser.createIncognitoBrowserContext()
    const page = await incognito.newPage()
    await page.setBypassCSP(true)
    await page.setJavaScriptEnabled(true)

    await page.goto(url, {
      waitUntil: 'domcontentloaded'
    });

    await autoScroll(page)
    // if(msg.from === owner || msg.author === owner){
      // await autoScroll(page)
    // }

    // await page.waitForSelector("#tiktok-verify-ele > div")
    // await page.waitForTimeout(2000)
    // await page.click('a.verify-bar-close.sc-kgoBCf.hoqHMv');

    let userFollowing = ""
    let userFollowers = ""
    let userLikes = ""

    try {
      const userImage = await page.$eval('div.tiktok-uha12h-DivContainer.e1vl87hj1 > span > img', el => el.getAttribute("src"))
        .catch(err => { return '' })

      const userTitle = await page.$eval('div.tiktok-1hdrv89-DivShareTitleContainer.ekmpd5l3 > h2', el => el.textContent)
        .catch(err => { return '' })

      const userSubtitle = await page.$eval('div.tiktok-1hdrv89-DivShareTitleContainer.ekmpd5l3 > h1', el => el.textContent)
        .catch(err => { return '' })

      const userBio = await page.$eval('h2.tiktok-1n8z9r7-H2ShareDesc.e1457k4r3', el => el.textContent)
        .catch(err => { return '' })

      for (let i = 0; i <= 2; i++) {
        const j = i + 1
        const eval = await page.$eval(`h2.tiktok-7k173h-H2CountInfos.e1457k4r0 > div:nth-child(${j}) > strong`, el => el.textContent)

        if (i === 0) {
          userFollowing = eval
        } else if (i === 1) {
          userFollowers = eval
        } else if (i === 2) {
          userLikes = eval
        }
      }

      const userLink = await page.$eval('div.tiktok-kk9x8q-DivShareLinks.eht0fek0 > a > span', el => el.textContent)
        .catch(err => { return '' })

      const videosArray = await page.$$eval('[class="tiktok-x6y88p-DivItemContainerV2 e19c29qe7"]', options => {
        return options.map(el => {
          const videoMetadata = {};

          try {
            videoMetadata.title = el.querySelector('div.tiktok-5lnynx-DivTagCardDesc.eih2qak1 > a').getAttribute('title');

            videoMetadata.link = el.querySelector('div.tiktok-x6f6za-DivContainer-StyledDivContainerV2.eq741c50 > div > div > a').getAttribute('href');

            videoMetadata.views = el.querySelector('[data-e2e="video-views"]').textContent;

          } catch (err) {
            console.error(err);
          }
          return videoMetadata;
        })
      })

      const videos = videosArray.filter(element => {
        if (Object.keys(element).length !== 0) {
          return true;
        }
        return false;
      });

      const userInfo = {
        image: userImage,
        Title: userTitle,
        Following: userFollowing + " Following",
        Followers: userFollowers + " Followers",
        Likes: userLikes + " Likes",
        Subtitle: userSubtitle,
        Bio: userBio,
        Link: userLink,
        videos: videos
      }

      await page.close()
      await browser.close()

      return userInfo

    } catch (err) {
      console.log(err)

      await page.close()
      await browser.close()
    }

  } catch (err) {
    return err
  }
}

module.exports = {
  ScrapUser,
}
