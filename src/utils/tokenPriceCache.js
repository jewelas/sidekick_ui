import { GetQuotePrice } from '../services/FirebaseService';

export default class TokenPriceCache {

    constructor() {

        this.bnbAddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
        this.usdtAddress = "0x55d398326f99059ff775485246999027b3197955";
        this.busdAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56";

        this.bnbPrice = null;
        this.tokenPriceMap = {};

        this.loadBnbPrice = this.loadBnbPrice.bind(this);
        this.webSearchPrice = this.webSearchPrice.bind(this);
        this.webLoadPrice = this.webLoadPrice.bind(this);
        this.getPrice = this.getPrice.bind(this);
    }

    async loadBnbPrice() {
        this.bnbPrice = await this.getPrice(this.bnbAddress);
    }

    async webSearchPrice(address) {
        let price = 0;
        if (address.toLowerCase() != this.bnbAddress) {
            price = await this.webLoadPrice(address, this.bnbAddress);
        }

        if (price === 0) {
            price = await this.webLoadPrice(address, this.usdtAddress);

            if (price === 0) {
                price = await this.webLoadPrice(address, this.busdAddress);
            }
        }

        return price;
    }

    async webLoadPrice(baseCurrencyAddress, quoteCurrencyAddress) {
        const response = await GetQuotePrice(baseCurrencyAddress, quoteCurrencyAddress);

        if (response?.data?.ethereum?.dexTrades && response.data.ethereum.dexTrades.length > 0) {
            const quote = response.data.ethereum.dexTrades[0];
            if (quoteCurrencyAddress.toLowerCase() === this.bnbAddress.toLowerCase() && quote.quoteCurrency.symbol === "WBNB") {
                quote.quotePrice = quote.quotePrice * this.bnbPrice
            }

            return quote.quotePrice;
        }

        return 0;
    }

    async getPrice(address) {
        address = address.toLowerCase();

        if (address != this.bnbAddress) {
            await this.loadBnbPrice();
        }

        if (!this.tokenPriceMap[address]) {
            this.tokenPriceMap[address] = {
                price: await this.webSearchPrice(address),
                cooldown: new Date()
            }
        }

        if (new Date() - this.tokenPriceMap[address].cooldown > 60000) {
            this.tokenPriceMap[address].cooldown = new Date();
            this.tokenPriceMap[address].price = await this.webSearchPrice(address);
        }

        return this.tokenPriceMap[address].price;
    }
}