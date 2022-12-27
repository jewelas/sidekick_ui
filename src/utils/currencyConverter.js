import { GetQuotePrice } from '../services/FirebaseService';

export default class CurrencyConverter {

    constructor() {

        this.usdt = "0x55d398326f99059fF775485246999027B3197955";
        this.bnb = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

        this.bnbToUsd = 1;
        this.currencyToMap = {};

        this.refreshInterval = null;
        this.refreshIntervalTimeout = 5000;

        this.init = this.init.bind(this);

        this.refreshData = this.refreshData.bind(this);
        
        this.webConvert = this.webConvert.bind(this);
        this.convert = this.convert.bind(this);
        this.convertToUsd = this.convertToUsd.bind(this);
        this.convertBnbToUsd = this.convertBnbToUsd.bind(this);

        this.init();
    }

    init() {
        this.refreshData();

        //this.refreshInterval = setInterval(this.refreshData, this.refreshIntervalTimeout);
    }

    async refreshData() {

        this.bnbToUsd = await this.webConvert(this.bnb, this.usdt);

        Object.keys(this.currencyToMap).forEach(key1 => {
            Object.keys(this.currencyToMap[key1] ?? {}).forEach(async key2 => {

                this.currencyToMap[key1][key2] = await this.webConvert(key1, key2);
            }); 
        });
    }

    async webConvert(fromAddress, toAddress, fromAmount = 1) {

        fromAddress = fromAddress.toLowerCase();
        toAddress = toAddress.toLowerCase();

        let conversionResponse = await GetQuotePrice(fromAddress, toAddress);
        let conversionDexTrades = conversionResponse?.data?.ethereum?.dexTrades;

        return (conversionDexTrades ? conversionDexTrades[0]?.quotePrice ?? 1 : 1) * fromAmount;
    }

    async convert(fromAddress, toAddress, fromAmount = 1) {

        fromAddress = fromAddress.toLowerCase();
        toAddress = toAddress.toLowerCase();

        if (!this.currencyToMap[fromAddress]) {
            this.currencyToMap[fromAddress] = {};
        }

        if (!this.currencyToMap[fromAddress][toAddress]) {
            this.currencyToMap[fromAddress][toAddress] = await this.webConvert(fromAddress, toAddress);
        }

        return (this.currencyToMap[fromAddress][toAddress]) * fromAmount;
    }

    async convertToUsd(fromAddress, fromAmount = 1) {

        fromAddress = fromAddress.toLowerCase();

        let fromCurrencyToBnb = await this.convert(fromAddress, this.bnb, fromAmount);

        return fromCurrencyToBnb * this.bnbToUsd;
    }

    convertBnbToUsd(fromAmount = 1) {

        return fromAmount * this.bnbToUsd;
    }
}