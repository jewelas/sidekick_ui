const localIpUrl = require('local-ip-url');
const axios = require('axios');

export function AxiosGet(url, params){
    return axios.get(url, {params: params}).then(response =>{
        //handle success
        return response;
    })
    .catch(error =>{
        // handle error
        return error;
    })
}

export function AxiosPost(url, data){
    return axios.post(url, data).then(response => {
        return response;
    }).catch(error => {
        return error;
    })
}

export function AxiosGetAsync(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: params }).then(response => {
            resolve(response.data);
        }, reject).catch(reject);
    })
}

export function AxiosPostAsync(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(response => {
            resolve(response.data);
        }, reject).catch(reject);
    });
}

export function GetLocalHostIp() {
    return localIpUrl()
  }
  
  export function GetClientIp() {
    // https://app.abstractapi.com/api/ip-geolocation/tester
    const apiKey = 'abd7c08b1c7a4cba81896adc8ebcb85c';
    let url = `https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}`;
    return AxiosGet(url)
  }