import { GetBars, ResolveSymbol, GetQuotePrice, GetTradesForAddressByToken } from '../../../../services/FirebaseService';
import moment from 'moment';

const configurationData = {
    supported_resolutions: ['1', '5', '15', '30', '60', '240', '720', '1D', '1W', '1M'],
    supports_marks: true
};

const DataFeed = (props) => {
    return {
        onReady: (callback) => {
            setTimeout(() => callback(configurationData));
        },
        searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
            console.log('====Search Symbols running');
        },
        resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {

            const response = await ResolveSymbol(props.baseCurrency, props.network, props.quoteCurrency);
            // to do null check : done by Justin Panagakis
            const dexTrades = response?.data?.ethereum?.dexTrades;
            const coin = (!!dexTrades ? dexTrades[0]?.baseCurrency : null) ?? null;

            if (!coin) {
                onResolveErrorCallback();
            } else {
                const symbol = {
                    ticker: coin.symbol,
                    name: `${coin.symbol}/${props.isUsdConvert ? 'USD' : 'BNB'}`,
                    session: '24x7',
                    timezone: 'Etc/UTC',
                    minmov: 1,
                    // minmov2: 0,
                    pricescale: 1000000000000,
                    has_seconds: true,
                    has_intraday: true,
                    intraday_multipliers: ['1', '5', '15', '30', '60', '240', '720'],
                    has_empty_bars: true,
                    has_weekly_and_monthly: false,
                    supported_resolutions: configurationData.supported_resolutions,
                    volume_precision: 1,
                    data_status: 'streaming',
                    // type: 'bitcoin'

                }
                onSymbolResolvedCallback(symbol)
            }
        },

        getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
            try {
                if (resolution === '1D') {
                    resolution = 1440;
                }
                // todo pass in selected network0
                const response2 = await GetBars(props.baseCurrency, props.quoteCurrency, 
                    'bsc', resolution, moment.unix(periodParams.from).format('YYYY-MM-DD'), 
                    moment.unix(periodParams.to).format('YYYY-MM-DDTHH:mm:ss.SSSZ'), 1);

                // to do pass in usdt / usd price base token for selected network
                let bnbPriceMap = {};
                if (props.isUsdConvert) {
                    const response3 = await GetBars(props.quoteCurrency, "0x55d398326f99059fF775485246999027B3197955", 
                    'bsc', resolution, moment.unix(periodParams.from).format('YYYY-MM-DD'), 
                    moment.unix(periodParams.to).format('YYYY-MM-DDTHH:mm:ss.SSSZ'), 1);

                    bnbPriceMap = response3?.data?.ethereum?.dexTrades?.reduce((r, e) => {
                        let fullTimeString = e.timeInterval.minute;
                        let backupTimeString = fullTimeString.substring(0, 10)
                        let price = e.median;

                        r[fullTimeString] = price;
                        r[backupTimeString] = price;

                        return r;

                    }, {}) ?? {};
                }

                const bars = response2.data.ethereum.dexTrades.map(trade => {

                    let fullTimeString = trade.timeInterval.minute;
                    let backupTimeString = fullTimeString.substring(0, 10)
                    let conversionRatio = bnbPriceMap[fullTimeString] ?? bnbPriceMap[backupTimeString] ?? 1;

                    return {
                        time: new Date(trade.timeInterval.minute).getTime(), // date string in api response
                        low: trade.low * conversionRatio,
                        high: trade.high * conversionRatio,
                        open: Number(trade.open) * conversionRatio,
                        close: Number(trade.close) * conversionRatio,
                        volume: trade.volume
                    }
                })

                if (bars.length > 0) {
                    onHistoryCallback(bars, { noData: false });
                } else {
                    onHistoryCallback(bars, { noData: true });
                }

            } catch (err) {
                console.log({ err })
            }
        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
            console.log('=====subscribeBars runnning')
        },
        unsubscribeBars: subscriberUID => {
            console.log('=====unsubscribeBars running')
        },
        calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
            //optional
            console.log('=====calculateHistoryDepth running')
            // while optional, this makes sure we request 24 hours of minute data at a time
            // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
            // return resolution < 60 ? { resolutionBack: 'D', intervalBack: '1' } : undefined
        },
        getMarks: async (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
            //optional
            console.log('=====getMarks running')

            if (props.isPlotTrades && props.currentUserAddress !== undefined) {

                try {

                    let trades = await GetTradesForAddressByToken(props.baseCurrency, props.currentUserAddress, moment.unix(startDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ'), moment.unix(endDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ'), 20, 0, 'bsc'); //TODO: get user wallet instead of hard coded

                    let idCounter = 0
                    let promiseData = trades?.data?.ethereum?.dexTrades?.map(async trade => {

                        let label = trade.sellAmount === 0 ? "B" : "S";
                        let color = trade.sellAmount === 0 ? "green" : "red";

                        let symbol = `${trade.baseCurrency.symbol}/${trade.quoteCurrency.symbol}`;
                        let type = trade.sellAmount === 0 ? "Buy" : "Sell";
                        let totalUsd = trade.tradeAmount;
                        let currentUsd = await window.TokenPriceCache?.getPrice(trade.baseCurrency.address) * trade.baseAmount;
                        let totalTokens = trade.baseAmount

                        let textHtml = `
                            <div style="line-height: 1.5;">
                                <span style="background-color: ${trade.sellAmount === 0 ? "#49e287" : "red"}; padding: 4px 8px; border-radius: 4px; color: ${trade.sellAmount === 0 ? "rgb(29, 43, 114)" : "white"};"><b>${type}</b></span> at ${moment(trade.block.timestamp.time).format("M/D/YYYY, h:m:s A")} <br/>
                                Amount: ${totalTokens.toFixed(3)} ${trade.baseCurrency.symbol} <br/>
                                Price: $${totalUsd.toFixed(2)} <br/>
                                Current Value: $${currentUsd.toFixed(2)}
                            </div>
                        `

                        return {
                            id: trade.transaction.hash,
                            time: Math.floor(new Date(trade?.block?.timestamp?.time ?? undefined).getTime() / 1000),
                            color: color,
                            text: textHtml,
                            label: label,
                            labelFontColor: "white",
                            minSize: 16,
                        }
                    }) ?? [];

                    let mappedData = [];
                    for await (let val of promiseData) {
                        mappedData.push(val);
                    }

                    onDataCallback(mappedData)

                } catch (err) {
                    console.log(err);
                }
            }
        },
        getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
            //optional
            console.log('=====getTimeScaleMarks running')
        },
        getServerTime: cb => {
            console.log('=====getServerTime running')
        }
    }
}

export { DataFeed }