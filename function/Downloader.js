const axios = require("axios")
const puppeteer = require("puppeteer");
require("dotenv").config();
const urls = process.env.URL

async function VideoDownload(link) {
  const url = `${urls}download/d`;
  return axios.post(url, {
    link: link
  })
    .then((response) => {
      return response.data
    })
    .catch(err => { return '' });
}

module.exports = {
  VideoDownload,
}