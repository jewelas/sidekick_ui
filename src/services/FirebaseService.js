import { AxiosGet, AxiosPost, AxiosGetAsync, AxiosPostAsync } from './ServiceFunctions';

const BASE_FIREBASE_URL = 'https://us-central1-projectsidekick-9feaf.cloudfunctions.net';
const BASE_FIREBASE_URL_EAST = 'https://us-east1-projectsidekick-9feaf.cloudfunctions.net';

export function GetTrueTopTrades(token){
    
    let url = `${BASE_FIREBASE_URL}/getTrueTopTrades`;
    let params = {
        token: token
    }

    return AxiosGet(url, params);
}

export function GetTopDripTrades(since, till) {
    // var url = `${BASE_FIREBASE_URL}/getTopTradesByToken`;
    // TESTING
    var url = `${BASE_FIREBASE_URL}/getTopDripTradesNew`;

    let params = {
        since: since,
        till: till
    }

    return AxiosGet(url, params);
}

export function GetAlltimeDripTrades() {
    // var url = `${BASE_FIREBASE_URL}/getTopTradesByToken`;
    // TESTING
    var url = `${BASE_FIREBASE_URL}/getAlltimeDripTrades`;

    return AxiosGet(url);
}

export function GetTopTradesByToken(network, token, since, till, limit, offset) {

    var url = `${BASE_FIREBASE_URL}/getTopTradesByToken`;
    // TESTING
    // var url = `${BASE_FIREBASE_URL}/getTopTradesByTokenNew`;

    let params = {
        token: token,
        since: since,
        till: till,
        limit: limit,
        offset: offset,
        network: network
    }

    return AxiosGet(url, params);
}

export function GetTradesForAddressByToken(token, wallet, since, till, limit, offset, network) {

    var url = `${BASE_FIREBASE_URL}/getTradesForAddressByToken`;

    let params = {
        token: token,
        wallet: wallet,
        since: since,
        till: till,
        limit: limit,
        offset: offset,
        network: network
    }

    return AxiosGet(url, params);
}

export function GetTradesForAddress(wallet, since, till, limit, offset, network) {
    
    var url = `${BASE_FIREBASE_URL}/getTradesForAddress`;

    let params = {
        wallet: wallet,
        since: since,
        till: till,
        limit: limit,
        offset: offset,
        network: network
    }

    return AxiosGet(url, params);
}

export function GetQuotePrice(baseCurrency, quoteCurrency, network) {
    
    var url = `${BASE_FIREBASE_URL}/getQuotePrice`;

    let params = {
        baseCurrency: baseCurrency,
        quoteCurrency: quoteCurrency,
        network: network
    }

    return AxiosGet(url, params);
}

export function GetLatestPairs(limit, offset) {
    
    var url = `${BASE_FIREBASE_URL}/getLatestPairs`;

    let params = {
        limit: limit,
        offset: offset
    }

    return AxiosGet(url, params);
}

export function GetPairsByTradeAmount(since, till, limit, offset) {
    
    var url = `${BASE_FIREBASE_URL}/getPairsByTradeAmount`;

    let params = {
        since: since, 
        till: till,
        limit: limit,
        offset: offset
    }

    return AxiosGet(url, params);
}

export function GetTokenData(tokenList) {
    
    var url = `${BASE_FIREBASE_URL}/getTokenData`;

    let params = {
        tokens: tokenList
    }

    return AxiosGet(url, params);
}

export function GetTokenSearch(search, network) {
    
    var url = `${BASE_FIREBASE_URL}/getTokenSearch`;

    let params = {
        search: search,
        network: network
    }

    return AxiosGet(url, params);
}

export function ResolveSymbol( baseCurrency,network, quoteCurrency) {
    
    var url = `${BASE_FIREBASE_URL}/resolveSymbol`;

    let params = {
        quoteCurrency: quoteCurrency,
        network: network,
        baseCurrency: baseCurrency
    }

    return AxiosGet(url, params);
}

export function GetBars(baseCurrency, quoteCurrency, network, timeframe, since, till, minTrade) {
    
    var url = `${BASE_FIREBASE_URL}/getBars`;

    let params = {
        minTrade: minTrade,
        timeframe: timeframe, 
        since: since, 
        till: till,
        quoteCurrency: quoteCurrency,
        network: network,
        baseCurrency: baseCurrency
    }

    return AxiosGet(url, params);
}

export function GetCandleData(tokenAddress, timeframe, since, till, network) {
    
    var url = `${BASE_FIREBASE_URL}/getCandleData`;

    let params = {
        tokenAddress: tokenAddress,
        timeframe: timeframe, 
        since: since, 
        till: till,
        network
    }

    return AxiosGet(url, params);
}

export function GetNameserviceMappings(nameService) {
    
    var url = `${BASE_FIREBASE_URL}/getNameServiceMappings`;

    let params = {
        nameService: nameService
    }

    return AxiosGet(url, params);
}

export function SaveUserInfo(account, data) {
    
    var url = `${BASE_FIREBASE_URL}/saveUserInfo?account=${account}`;

    return AxiosPost(url, data);
}
export function GetFlowTeam(address) {
    var url = `${BASE_FIREBASE_URL}/getFlowInfo?address=${address}`;
    return AxiosGet(url);
}

export function GetERC20TotalSupply(address) {

    var url = `${BASE_FIREBASE_URL}/getERC20TotalSupply?address=${address}`;
    return AxiosGet(url);

}

//#region [Purple] Ads

export function GetAd(target) {

    let url = `${BASE_FIREBASE_URL}/getAd?target=${target}`;
    return AxiosGetAsync(url);
}

export function PostAdStats(adStats) {

    let url = `${BASE_FIREBASE_URL}/postAdStats`;
    return AxiosPostAsync(url, adStats);
}

//#endregion