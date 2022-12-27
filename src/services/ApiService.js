import { AxiosGet , AxiosPost } from './ServiceFunctions';

export function GetBnbPrice(){

    const response = AxiosGet('https://api.coingecko.com/api/v3/coins/wbnb?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false');

    return response;
}

// comma seperated list of token addresses
export function GetCGTokenListPrice(tokens, platform){
    const response = AxiosGet(`https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${tokens}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`)
    return response;
}

export function GetDripDownline(address){

    const response = AxiosGet(`https://api.drip.community/org/${address}`);

    return response;
}

export function GetDripPrice(){
    
    const response = AxiosGet(`https://api.drip.community/prices/`);

    return response;
}

export function GetNFTData(uri){
    const response = AxiosGet(uri);
    return response;
}

export function GetTopHolders(chainId, tokenAddress, apiKey){
    const response = AxiosGet(`https://api.covalenthq.com/v1/${chainId}/tokens/${tokenAddress}/token_holders/?quote-currency=USD&format=JSON&page-size=3&key=${apiKey}`);
    return response;
}
