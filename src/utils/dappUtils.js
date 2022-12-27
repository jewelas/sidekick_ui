import {
  getWbnbAddress,
  getMaticAddress,
  getEthereumAddress,
  getGfiTokenAddress
} from './addressHelpers';
import { platforms } from '../config/coingecko_platforms.js';

const getTimeframe = (dateRange) => {
  switch (dateRange) {
    case 'NOW':
      return 1;
      break;
    case 'WTD':
      return 7;
      break;
    case 'MTD':
      return 30;
      break;
    case 'QTD':
      return 91;
      break;
    case 'YTD':
      return 365;
      break;
    default:
      return 1;
      break;
  }
};

const getBaseTokenForNetwork = (network) => {
  switch (network) {
    case 'bsc':
      return getWbnbAddress();
    case 'matic':
      return getMaticAddress();
    case 'ethereum':
      return getEthereumAddress();
    default:
      return getWbnbAddress();
  }
};

const rowScramble = (row, table) => {
  switch (table) {
    case 'allTimeTrades':
    case 'defiOverview':
    case 'dripAllTime':
    case 'dripRecentTrades':
    case 'dripOverview':
      row.wallet = stringScramble(row.wallet);
      row.displayTime = stringScramble(row.displayTime);
      row.tranId = stringScramble(row.tranId);
      row.totalTokens = numberScramble(row.totalTokens.toString());
      row.amountUsd = numberScramble(row.amountUsd.toString());
      row.scrambled = true;
      break;
    case 'topPairs':
      row.address = stringScramble(row.address);
      row.symbol = stringScramble(row.symbol);
      row.tradeAmount = numberScramble(row.tradeAmount.toString());
      row.transactions = numberScramble(row.transactions.toString());
      row.scrambled = true;
      break;
    default:
      break;
  }

  return row;
};

const stringScramble = (string) => {
  let shuffledString = '';
  string = string.split('');
  while (string.length > 0) {
    shuffledString += string.splice((string.length * .3) << 0, 1);
  }
  return shuffledString;
};
const numberScramble = (string) => {
  let shuffledString = '';
  string = string.split('');
  while (string.length > 0) {
    shuffledString += string.splice((string.length * .3) << 0, 1);
  }
  return parseInt(shuffledString);
};

const getCoingeckoPlatform = (network) => {
  switch (network) {
    case 'bsc':
      return platforms.binance;
    case 'matic':
      return platforms.matic;
    case 'ethereum':
    case 'eth':
      return platforms.ethereum;
    default:
      return platforms.binance;
  }
};

export {
  getTimeframe,
  rowScramble,
  getBaseTokenForNetwork,
  getCoingeckoPlatform
};
