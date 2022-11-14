const axios = require("axios")
const puppeteer = require("puppeteer");

async function VideoDownload(link) {
  return axios.post('https://ssyoutube.com/api/convert', {
    url: link
  })
    .then((response) => {
      return response.data
    })
    .catch(async () => {
      // return err
      try {
        const responseUrl = []

        const browser = await puppeteer.launch({
          executablePath: "./Chrome/Application/chrome.exe",
          headless: true,
        });
        const page = await browser.newPage();

        await page.setJavaScriptEnabled(true)
        await page.goto("https://ttsave.app/", {
          waituntil: 'domcontentloaded'
        });

        await page.type("input.h-full.w-full", link);
        await page.click('[id="btn-download"]')
        await page.waitForSelector("#button-download-ready > a:nth-child(1)")
          .then(async () => {
            const mp4Link = await page.$eval("#button-download-ready > a:nth-child(1)", (el) => el.getAttribute("href"));
            responseUrl.push({
              url: mp4Link,
              name: 'MP4',
              ext: 'mp4',
              type: 'mp4',
            })
            const mp3Link = await page.$eval("#button-download-ready > a:nth-child(3)", (el) => el.getAttribute("href"));
            responseUrl.push({
              url: mp3Link,
              name: 'MP3',
              ext: 'mp3',
              type: 'mp3',
            })
          })
          
        const response = {
          hosting: "tiktok.com",
          url: responseUrl,
        }

        await page.close();
        await browser.close();
        return response
      } catch (err) {
        return err
      }
    });
}

module.exports = {
  VideoDownload,
}