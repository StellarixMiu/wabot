const axios = require("axios")
require("dotenv").config();

const urls = process.env.URL

async function ScrapUser(username) {
  const url = `${urls}tiktok/p/`;
  return axios.post(url, {
    username: username
  })
    .then((response) => {
      return response.data
    })
    .catch(err => { return '' });
}

module.exports = {
  ScrapUser,
}