const axios = require("axios")

async function VideoDownload(link) {
  return axios.post('https://ssyoutube.com/api/convert', {
    url: link
  })
  .then((response) => {
    return response.data
  })
  .catch(function (error) {
    console.log(error);
  });
}

module.exports = {
  VideoDownload,
}