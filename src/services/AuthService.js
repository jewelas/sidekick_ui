import web3 from 'web3';
import { adminPing, authPing, authToken, getUserPreAuth } from './REST/authRestService';

const signNonce = (address, message) => {
    return new Promise((resolve, reject) => {

        try {
            window.ethereum.sendAsync({ id: 1, method: 'personal_sign', params: [web3.utils.fromUtf8(message), address] },
                function (err, result) {

                    err && reject(err);

                    resolve({ publicAddress: address, signature: result.result }); // resolving signature
                }
            )

        } catch (ex) {
            reject();
        }
    });
}

export function processLogin() {
    return new Promise((resolve, reject) => {
        window.ethereum.enable()
            .then(publicAddresses => getUserPreAuth(window.ethereum.selectedAddress), reject)
            .then(({ publicAddress, nonce }) => signNonce(publicAddress, nonce), reject)
            .then(({ publicAddress, signature }) => authToken(publicAddress, signature), reject)
            .then(authResponse => {
                localStorage.setItem("accessToken", authResponse.authToken);
                resolve();
            }, reject)
            .catch(error => reject(error));
    });
}