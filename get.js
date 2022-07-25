const axios = require('axios');

const url = 'https://scrappingmiu.herokuapp.com/tiktok/d?link='
axios.get('https://scrappingmiu.herokuapp.com/tiktok/d?link=https://www.tiktok.com/@iliketoeatburger/video/7110577257097350401?is_from_webapp=1&sender_device=pc')
	.then( res => {
		console.log(res.data)
		const data = res.data
		for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const value = data[key]
              
              return value
              
            }

          }
}).catch(err => {
		console.log(err)
})