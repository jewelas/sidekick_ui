import { httpGet, httpPost } from "./baseRestService"


export function getUserPreAuth(publicAddress) {
    return httpGet(`getUserPreAuth?publicAddress=${publicAddress}`);
}

export function authToken(publicAddress, signature) {
    return httpPost("authToken", { publicAddress, signature });
}

export function ping() {
    return httpGet("ping");
}

export function authPing() {
    return httpGet("authPing");
}

export function adminPing() {
    return httpGet("adminPing");
}