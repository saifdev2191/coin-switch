import axios from 'axios';

const middleware = 'https://cors-anywhere.herokuapp.com/';
const headers = {
    'x-api-key': 't41E6v16mG6xqOUK74E2F7Py6UVng4K6n1pO3Jig' ,
    'x-user-ip': '1.1.1.1'
}

const coinapi = () =>   axios.get(`${middleware}https://api.coinswitch.co/v2/coins`,{headers: headers})

const rateapi = (payload) => axios.post(`${middleware}https://api.coinswitch.co/v2/rate`, JSON.stringify(payload),{
    headers: headers
})
   

export {coinapi, rateapi};