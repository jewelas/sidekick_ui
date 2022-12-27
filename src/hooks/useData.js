import { useEffect, useState } from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy'
import moment from 'moment';
import _ from 'lodash'
import { stringify } from 'qs'
import { useWallet } from 'use-wallet';

import useRefresh from './useRefresh'
import erc20ABI from '../config/abi/erc20.json';
import { topCoinsList } from '../config/top_coins_list.js';
import { featuredCoinsList } from '../config/featured_coins_list';
import { getBusdAddress, getUsdtAddress, getWbnbAddress, supportedChain } from '../utils/addressHelpers'
import { getContract, getWeb3 } from 'utils/web3';
import { usePrevious } from './useHelpers';

import {
  GetAlltimeDripTrades,
  GetCandleData,
  GetERC20TotalSupply,
  GetLatestPairs,
  GetQuotePrice,
  GetTokenSearch,
  GetTopDripTrades,
  GetTopTradesByToken,
  GetTradesForAddressByToken,
  GetTradesForAddress,
  GetTrueTopTrades,
  GetNameserviceMappings
} from 'services/FirebaseService';
import { GetCGTokenListPrice } from 'services/ApiService';
import { getCoingeckoPlatform } from 'utils/dappUtils';

const supportedChainId = supportedChain();

const useGetERC20TotalSupply = (address) => {
  const { superSlowRefresh } = useRefresh();
  const [totalSupply, setTotalSupply] = useState();

  useEffect(() => {
    async function GetData() {
      let response;

      response = await GetERC20TotalSupply(address);
      if (response !== undefined && response.data !== undefined && response.data !== undefined) {
        setTotalSupply(response.data);
      }
    }
    if (address !== undefined)
      GetData();
  }, [address, superSlowRefresh])

  return totalSupply;
}

const useGetLatestPairs = (limit, offset) => {
  const { slowRefresh } = useRefresh();
  const { latestPairs } = useStoreState(state => state.Dapp);
  const { setLatestPairs } = useStoreActions(actions => actions.Dapp);

  useEffect(() => {
    async function GetData() {
      let response;

      response = await GetLatestPairs(limit, offset);
      if (response !== undefined && response.data !== undefined && response.data.ethereum !== undefined) {
        setLatestPairs(response.data.ethereum.arguments);
      }
    }

    GetData();
  }, [limit, offset, slowRefresh])

  return latestPairs;
}

const useGetTokenSearch = (search, network) => {
  const { tokenList } = useStoreState(state => state.Dapp);
  const { setTokenList } = useStoreActions(actions => actions.Dapp);

  useEffect(() => {
    async function GetTokens() {
      let tokens = [];

      tokens = await GetTokenSearch(search, network);
      if (tokens !== undefined && tokens.data !== undefined && tokens.data.search !== undefined) {
        setTokenList(tokens.data.search);
      }
    }

    if (search !== undefined && network !== undefined && search.length > 1) {
      GetTokens();
    }

  }, [search, network])

  return tokenList;
}

// window in mins 5 min 15min 30min 60min 240min
// timeframe integer days
const useGetCandleData = (window, timeframe, tokenAddress, network) => {
  const { slowRefresh } = useRefresh();
  const [candleData, setCandleData] = useState(undefined);

  useEffect(() => {
    let dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    let startDate = moment().utc().subtract(timeframe, 'd');
    let endDate = moment(startDate).add(timeframe, 'd');

    async function getAsync() {

      const resp = await GetCandleData(tokenAddress, window, startDate.format(dateTimeFormat), endDate.format(dateTimeFormat), network);
      if (resp.data !== undefined && resp.data.ethereum !== undefined && resp.data.ethereum.dexTrades !== undefined) {
        setCandleData(resp.data.ethereum.dexTrades);
      }

    }

    if (tokenAddress !== undefined && tokenAddress !== null && tokenAddress.length > 0) {
      getAsync();
    }

  }, [slowRefresh, tokenAddress])

  return candleData;

}

const usePortfolioData = (wallet, network) => {
  const { superSlowRefresh } = useRefresh()
  const { currentUserAddress, pairsByTradeAmount, currentUserPortfolioData, bnbPrice, portfolioExecuting, userCoinsList } = useStoreState(state => state.Dapp);
  const { setCurrentUserPortfolioData, setPortfolioExecuting, setUserCoinsList } = useStoreActions(actions => actions.Dapp);
  const [executing, setExecuting] = useState(false);
  const web3 = getWeb3(wallet);

  useEffect(() => {
    // load latest transactions
    if (currentUserAddress !== undefined &&
      bnbPrice !== undefined &&
      pairsByTradeAmount !== undefined &&
      wallet.status === 'connected' && wallet.balance !== '-1'
      && supportedChainId) {
      async function getAsync() {
        setPortfolioExecuting(true);
        let tokenData = new Map();
        // check top 300 traded tokens
        for(let x in pairsByTradeAmount){
          for (let i = 0; i < pairsByTradeAmount[x].data.length && i < 20; i++) {
            var baseCurrency = pairsByTradeAmount[x].data[i].baseCurrency;
            await calculateTotalTokensAndPrice(baseCurrency.symbol, baseCurrency.address, tokenData, bnbPrice, wallet, web3, userCoinsList);
          }
        }

        // check featuredTokenList
        for (let i = 0; i < featuredCoinsList.length; i++) {
          const token = featuredCoinsList[i];
          await calculateTotalTokensAndPrice(token.subject.symbol, token.subject.address, tokenData, bnbPrice, wallet, web3, userCoinsList);
        }

        for (let i = 0; i < topCoinsList.length - 1 && i < 20; i++) {
          const token = topCoinsList[i];
          await calculateTotalTokensAndPrice(token.symbol, token.address, tokenData, bnbPrice, wallet, web3, userCoinsList);
        }
        //TODO add in userCoinsList
        for (let i = 0; i < userCoinsList.length; i++){
          const token = userCoinsList[i];
          await calculateTotalTokensAndPrice(token.symbol, token.address, tokenData, bnbPrice, wallet, web3, userCoinsList)
        }

        // turn map to array
        let tokenDataArr = [];
        tokenData.forEach((value, key, map) => {
          tokenDataArr.push({ address: key, totalUSD: value.totalUSD, totalTokens: value.totalTokens, symbol: value.symbol, price: value.price })
        });

        // add bnb
        tokenDataArr.push(
          {
            symbol: 'BNB',
            address: 'bnb',
            totalUSD: parseFloat(web3.utils.fromWei(wallet.balance)) * bnbPrice,
            totalTokens: parseFloat(web3.utils.fromWei(wallet.balance)),
            price: bnbPrice
          });

        //sorted
        tokenDataArr = tokenDataArr.sort((a, b) => {
          return a.totalUSD < b.totalUSD ? 1 : -1;
        })

        let totalUSD = _.sumBy(tokenDataArr, (x) => {
          return x.totalUSD;
        })

        const portfolioData = {
          tokenData: tokenDataArr,
          totalUSD: totalUSD
        }


        if (portfolioData !== currentUserPortfolioData) {
          setCurrentUserPortfolioData(portfolioData)
        }
        setPortfolioExecuting(false);
      }


      if (!portfolioExecuting) {
        getAsync();
      }
    }

  }, [currentUserAddress, superSlowRefresh, pairsByTradeAmount, wallet, bnbPrice, userCoinsList])

  return currentUserPortfolioData;
}

//helpers
const calculateTotalTokensAndPrice = async (symbol, address, tokenData, bnbPrice, wallet, web3, userTokens) => {
  const userAdded = userTokens.find((tokenAddress) => {
    if (tokenAddress.address === address) {
      return true;
    } else {
      return false;
    };
    
  })
  const balance = await getTokenBalance(address, wallet, web3);
  if (balance > 0 || userAdded) {
    const price = await window.TokenPriceCache.getPrice(address);
    tokenData.set(address.toLowerCase(), {
      totalTokens: parseFloat(balance),
      totalUSD: parseFloat(balance) * (price),
      price: price,
      symbol: symbol
    });
  }
}

const retry = async (func) => {
  let count = 0;
  let maxTries = 3;
  while (true) {
    try {
      return await func;
    } catch (exception) {
      if (++count === maxTries) throw exception;
    }
  }
}
const getTokenPrice = async (address, bnbPrice) => {
  if (address.toLowerCase() === getWbnbAddress().toLowerCase()) {
    return bnbPrice;
  } else {
    // check bnb, then usdt, then busd
    let price = 0;
    price = await getQuotePrice(address, getWbnbAddress(), bnbPrice);

    if (price === 0) {
      // try usdt price
      price = await getQuotePrice(address, getUsdtAddress());

      if (price === 0) {
        price = await getQuotePrice(address, getBusdAddress());
      }
    }

    return price;
  }
}
const getTokenBalance = async (address, wallet, web3) => {
  try
  {
  let { contract } = await getContract(address, erc20ABI, wallet);

  let balance = await contract.methods.balanceOf(wallet.account).call({ from: wallet.account });
  const decimals = await contract.methods.decimals().call({ from: wallet.account });
  if (decimals === "18")
    return parseFloat(web3.utils.fromWei(balance));
  else
    return parseFloat(balance) / parseFloat('1e' + decimals);
  }catch(e){
    console.log(e)
    return 0;
  }
}

const getQuotePrice = async (baseCurrencyAddress, quoteCurrencyAddress, bnbPrice, network) => {
  const response = await GetQuotePrice(baseCurrencyAddress, quoteCurrencyAddress, network);

  if (response.data !== undefined && response.data !== null && response.data.ethereum !== undefined && response.data.ethereum !== null && response.data.ethereum.dexTrades !== null && response.data.ethereum.dexTrades !== undefined && response.data.ethereum.dexTrades.length > 0) {
    const quote = response.data.ethereum.dexTrades[0];
    // turn to usd, everything should return usd price
    if (quoteCurrencyAddress === getWbnbAddress() && quote.quoteCurrency.symbol === 'WBNB') {
      quote.quotePrice = quote.quotePrice * bnbPrice
    }
    return quote.quotePrice;
  } else {
    return 0;
  }
}

// timeframe integer days
const useCurrentUserTradesByToken = (timeframe, tokenAddress) => {
  const { slowRefresh } = useRefresh()
  const { currentUserTradesByToken, currentUserAddress, bnbPrice } = useStoreState(state => state.Dapp);
  const { setCurrentUserTradesByToken } = useStoreActions(actions => actions.Dapp);

  useEffect(() => {
    // load latest transactions
    if (currentUserAddress !== undefined && bnbPrice !== undefined) {
      async function getAsync() {
        let trades = await GetTradesForAddressByToken(tokenAddress, currentUserAddress, moment().subtract(timeframe, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), 20, 0, 'bsc');

        // calculate current value of trades

        setCurrentUserTradesByToken(trades.data.ethereum.dexTrades)

      }

      getAsync();
    }

  }, [currentUserAddress, slowRefresh, bnbPrice])

  return currentUserTradesByToken;
}

// timeframe integer days
const useCurrentUserTrades = (timeframe) => {
  const { slowRefresh } = useRefresh()
  const { currentUserTrades, currentUserAddress, selectedQueryNetwork } = useStoreState(state => state.Dapp);
  const { setCurrentUserTrades } = useStoreActions(actions => actions.Dapp);

  const prevUserAddress = usePrevious(currentUserAddress);

  useEffect(() => {
    // load latest transactions
    if (currentUserAddress !== undefined) {
      async function getAsync() {
        let response = await GetTradesForAddress(currentUserAddress, moment().subtract(timeframe, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), 1000, 0, selectedQueryNetwork);
        if (response !== undefined && response.data !== undefined && response.data.ethereum !== undefined) {

          // grab unique list of tokens found in trades
          const uniqueTokens = [...new Set(response.data.ethereum.dexTrades.map(x => x.baseCurrency.address))];
          // grab current price for each token, use coingecko??
          let platform = getCoingeckoPlatform(selectedQueryNetwork)
          let result = await GetCGTokenListPrice(uniqueTokens.join(), platform.id)
          // calculate current price of tokens bought or sold (indicating profit / loss since trade)
          if (result !== undefined && result.data !== undefined && result.data !== null) {
            const mappedData = response.data.ethereum.dexTrades.filter(x => {
              x.tradeAmountCurrent = x.baseAmount * result.data[x.baseCurrency.address]?.usd;
              if ((platform.stableCoinList.includes(x.baseCurrency.address) && x.quoteCurrency.address.toLowerCase() !== platform.baseToken.toLowerCase())
                || !platform.stableCoinList.includes(x.baseCurrency.address)) {
                return x;
              }
            })
            setCurrentUserTrades(mappedData);
          }
        }
      }

      getAsync();
    }

  }, [currentUserAddress])

  return currentUserTrades;
}

const useListOfTokenPrices = (addressList, platformId) => {
  const { superSlowRefresh } = useRefresh()

  const [tokenPrices, setTokenPrices] = useState(undefined);

  const prevTokenList = usePrevious(addressList);

  useEffect(() => {
    // load latest transactions
    if (addressList !== undefined && platformId !== undefined) {
      async function getAsync() {
        // grab current price for each token, use coingecko??
        let result = await GetCGTokenListPrice(addressList.join(), platformId);
        // calculate current price of tokens bought or sold (indicating profit / loss since trade)
        if (result !== undefined && result.data !== undefined && result.data !== null) {
          setTokenPrices(result.data);
        }
      }

      getAsync();
    }

  }, [platformId, superSlowRefresh])

  return tokenPrices;
}

const useQuotePrice = (baseCurrencyAddress) => {
  const { superSlowRefresh } = useRefresh()
  const [quotePrice, setQuotePrice] = useState();
  const { bnbPrice } = useStoreState(state => state.Dapp);

  useEffect(() => {

    async function GetPrice() {
      try {
        const response = await getTokenPrice(baseCurrencyAddress, bnbPrice);

        if (response !== undefined) {
          setQuotePrice(response);
        }

      } catch (e) {
        console.log(e);
      }
    }

    if (baseCurrencyAddress !== undefined && bnbPrice !== undefined) {
      GetPrice();
    }

  }, [superSlowRefresh, baseCurrencyAddress, bnbPrice])

  return quotePrice;
}

const useTrueTopTrades = () => {
  const { slowRefresh } = useRefresh();
  const [topTrades, setTopTrades] = useState(undefined);
  const { transactionFilter, selectedQueryNetwork } = useStoreState(state => state.Dapp);

  useEffect(() => {
    async function GetData() {
      let response;
      const token = transactionFilter.token.subject.address;
      response = await GetTrueTopTrades(token);
      if (response !== undefined && response.data !== undefined && response.data.ethereum !== undefined) {
        setTopTrades(response.data.ethereum.dexTrades);
      }
    }

    if (transactionFilter !== undefined && transactionFilter !== null && transactionFilter.token !== undefined && transactionFilter.token !== null) {
      GetData();
    }
  }, [transactionFilter, slowRefresh])

  return topTrades;
}

const useAlltimeDripTrades = () => {
  const { slowRefresh } = useRefresh();
  const [topTrades, setTopTrades] = useState(undefined);

  useEffect(() => {
    async function GetData() {
      let response;
      response = await GetAlltimeDripTrades();
      if (response !== undefined && response.data !== undefined && response.data.length > 0) {
        setTopTrades(response.data);
      }
    }

    GetData();

  }, [slowRefresh])

  return topTrades;
}

const useTopTradesForDrip = (timeframe) => {
  const { slowRefresh } = useRefresh()
  const { topTradesForDrip, topPastTradesForDrip, bnbPrice } = useStoreState(state => state.Dapp);
  const { setTopTradesForDrip, setPastTopTradesForDrip } = useStoreActions(actions => actions.Dapp);

  const wallet = useWallet();
  const web3 = getWeb3(wallet);

  useEffect(() => {
    // load latest transactions    
    async function getAsync() {
      try {
        let startDate = moment().utc().subtract(timeframe, 'd');
        let endDate = moment(startDate).add(timeframe, 'd');
        var response = await GetTopDripTrades(startDate.utc().format(), endDate.utc().format());

        if (response.data !== null && response.data !== undefined) {
          setTopTradesForDrip(response.data.map(x => {
            x.tradeAmountUsd = parseFloat(web3.utils.fromWei(x.bnb_amount) * bnbPrice);
            return x;
          }));
        }

        // to do fix this so timeframe can be dynamic instead of 1 day pass in 7 or 30 or 365
        response = await GetTopDripTrades(startDate.utc().subtract(1, 'd').format(), endDate.utc().subtract(1, 'd').format());

        if (response.data !== null && response.data !== undefined) {
          setPastTopTradesForDrip(response.data.map(x => {
            x.tradeAmountUsd = parseFloat(web3.utils.fromWei(x.bnb_amount) * bnbPrice);
            return x;
          }));
        }

      }
      catch (e) {
        console.log("non fatal error occured: ")
        console.log(e)
      }
    }

    if (timeframe !== undefined && bnbPrice !== undefined) {
      getAsync();
    }
  }, [timeframe, slowRefresh, bnbPrice])

  return { topTradesForDrip, topPastTradesForDrip };
}

const useTopTradesByToken = (network, transactionFilter, timeframe, limit, offset) => {
  const { fastRefresh, slowRefresh } = useRefresh()
  const { topTradesByToken, topPastTradesByToken } = useStoreState(state => state.Dapp);
  const { setTopTradesByToken, setPastTopTradesByToken, setRecentlySearched } = useStoreActions(actions => actions.Dapp);


  useEffect(() => {
    // load latest transactions    
    async function getAsync() {
      try {
        let startDate = moment().utc().subtract(timeframe, 'd');
        let endDate = moment(startDate).add(timeframe, 'd');
        const token = transactionFilter.token.subject.address;
        let response = await GetTopTradesByToken(network, token, startDate.utc().format(), endDate.utc().format(), 100, 0);

        if (response.data !== null && response.data !== undefined) {

          let topTrades = response.data;
          setTopTradesByToken(topTrades);

          if (topTrades.length > 0) {
            // save to recently searched
            setRecentlySearched(transactionFilter.token);
          }
        }

        response = await GetTopTradesByToken(network, token, startDate.utc().subtract(1, 'd').format(), endDate.utc().subtract(1, 'd').format(), 100, 0);

        if (response.data !== null && response.data !== null) {
          setPastTopTradesByToken(response.data);
        }

      }
      catch (e) {
        console.log("non fatal error occured: ")
        console.log(e)
      }
    }

    if (transactionFilter !== undefined && transactionFilter !== null && transactionFilter.token !== undefined && transactionFilter.token !== null) {
      getAsync();
    }
  }, [transactionFilter, slowRefresh])

  return { topTradesByToken, topPastTradesByToken };
}

const useGetNameServiceMappings = () => {
  const { fastRefresh, slowRefresh } = useRefresh()
  const { nameServiceMappings } = useStoreState(state => state.Dapp);
  const { setNameServiceMapping } = useStoreActions(actions => actions.Dapp);

  const NAME_SERVICE_IDS = [
    { id: 'gangster', value: 'gangster_names_mappedV4' },
    { id: 'sidekick', value: 'sidekick_names_mappedV2' }
  ]


  useEffect(() => {
    // load latest transactions    
    async function getAsync() {
      try {
        NAME_SERVICE_IDS.forEach(async nameService => {

          let response = await GetNameserviceMappings(nameService.value);

          if (response.data !== null && response.data !== undefined) {
            setNameServiceMapping({ id: nameService.id, value: response.data });
          }

        })
      }
      catch (e) {
        console.log("non fatal error occured: ")
        console.log(e)
      }
    }

    getAsync();

  }, [slowRefresh])

  return { nameServiceMappings };
}


export {
  useCurrentUserTrades,
  useCurrentUserTradesByToken,
  useTopTradesByToken,
  useTrueTopTrades,
  useGetTokenSearch,
  useGetCandleData,
  useGetLatestPairs,
  useTopTradesForDrip,
  useQuotePrice,
  useGetERC20TotalSupply,
  useAlltimeDripTrades,
  usePortfolioData,
  useGetNameServiceMappings,
  useListOfTokenPrices
};