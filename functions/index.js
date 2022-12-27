const functions = require("firebase-functions");
const crypto = require('crypto');
const axios = require('axios');
const zlib = require('zlib');
const _ = require('lodash');
const { request, gql, GraphQLClient } = require('graphql-request')
const moment = require('moment');
const { ethers, utils } = require('ethers');
const ethUtil = require('ethereumjs-util');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const { PubSub } = require('@google-cloud/pubsub');
const { Storage } = require('@google-cloud/storage');
const cors = require('cors')({ origin: true });
const storage = new Storage();
const {
  TOKENS,
  GET_PAIRS_BY_TRADE_AMOUNT,
  GET_QUOTE_PRICE,
  GET_TRADES_FOR_ADDRESS,
  GET_TRADES_FOR_ADDRESS_BY_TOKEN,
  GET_TRUE_TOP_TRADES,
  GET_TOKENS_BY_NAME,
  GET_LATEST_PAIRS,
  GET_DRIP_TRADES,
  GET_ALLTIME_DRIP_TRADES,
  GET_CANDLE_DATA,
  RESOLVE_SYMBOL,
  GET_BARS,
  GET_NAMESERVICE_NAMES
} = require('./graphql_constants');
const { getTopTradesByToken, saveTopTradesByToken, publishMessageToTopic, getDripTrades } = require('./helpers');

const LOCAL_HOST_URL = 'http://localhost:5005/projectsidekick-9feaf/us-central1';
const PROD_URL = 'https://us-central1-projectsidekick-9feaf.cloudfunctions.net'
const BSC_TESTNET_RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const BSC_MAINNET_RPC_URL = 'https://bsc-dataseed1.defibit.io/';
const contractAddress = '0x5755E18D86c8a6d7a6E25296782cb84661E6c106';
const dripTokenAddress = '0x20f663CEa80FaCE82ACDFA3aAE6862d246cE0333';
//const sidekickNameserviceAddress = '0xb2cf78efa9ead9c9913a8b1f9ec5f0add17005f4';
const sidekickNameserviceAddress = '0x080af72c8D9c1d02E3de188Be770155A81119754';
const skNameserviceAbi = JSON.parse('[{"inputs":[{"internalType":"contractIERC20","name":"_rooted","type":"address"},{"internalType":"addresspayable","name":"_dev","type":"address"},{"internalType":"addresspayable","name":"_feeCollector","type":"address"},{"internalType":"contractPayment","name":"_subscription","type":"address"},{"internalType":"contractIPancakeFactory","name":"_pancakeFactory","type":"address"},{"internalType":"contractIPancakeRouter02","name":"_pancakeRouter","type":"address"},{"internalType":"address","name":"_BUSD","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"address","name":"nft","type":"address"},{"indexed":false,"internalType":"uint256","name":"nftId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"_isContract","type":"bool"}],"name":"onSetNFTForAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"bool","name":"_isContract","type":"bool"}],"name":"onSetNameForAddress","type":"event"},{"inputs":[],"name":"BUSD","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"WBNB","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"baseAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"calculateTokensPerSideKick","outputs":[{"internalType":"uint256[2]","name":"","type":"uint256[2]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"devWallet","outputs":[{"internalType":"addresspayable","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"feeCollector","outputs":[{"internalType":"addresspayable","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nameRecordsByAddress","outputs":[{"internalType":"address","name":"recordOwner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"nameUpper","type":"string"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"nftId","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"nameRecordsByName","outputs":[{"internalType":"address","name":"recordOwner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"nameUpper","type":"string"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"nftId","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"rooted","outputs":[{"internalType":"contractIERC20","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"servicePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"taxPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"txs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"stateMutability":"payable","type":"receive","payable":true},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"getNameByAddress","outputs":[{"internalType":"string","name":"nameRecord","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"getAddressByName","outputs":[{"internalType":"address","name":"nameRecord","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"getNameRecordByAddress","outputs":[{"components":[{"internalType":"address","name":"recordOwner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"nameUpper","type":"string"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"nftId","type":"uint256"}],"internalType":"structSideKickNames.NameRecord","name":"nameRecord","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"checkAvailability","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"checkIsBlacklistedName","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"checkIsBlacklistedAddress","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"address","name":"_paymentToken","type":"address"}],"name":"setNameRecord","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_nftAddr","type":"address"},{"internalType":"uint256","name":"_nftId","type":"uint256"},{"internalType":"address","name":"_paymentToken","type":"address"}],"name":"setNFT721","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"},{"internalType":"string","name":"_name","type":"string"}],"name":"setNameRecordOf","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"},{"internalType":"address","name":"_nftAddr","type":"address"},{"internalType":"uint256","name":"_nftId","type":"uint256"}],"name":"setNFTOf","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"planId","type":"uint256"},{"internalType":"uint256","name":"tier","type":"uint256"}],"name":"setEligiblePlans","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"sweepTokens","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"},{"internalType":"bool","name":"_isBlacklisted","type":"bool"}],"name":"setBlacklistAddressStatus","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"setBlacklistNameStatus","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"toggleSuperSidekick","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setPrice","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tax","type":"uint256"}],"name":"setTax","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contractPayment","name":"_contract","type":"address"}],"name":"setNewSubscription","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"addresspayable","name":"_address","type":"address"}],"name":"setCollector","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contractIERC20","name":"_contract","type":"address"}],"name":"setNewPaymentToken","outputs":[],"stateMutability":"nonpayable","type":"function"}]');
const gangsterNameServiceAddress = '0x7bE1aDbCDd63f3dBeAC6DD1B778d316856AD1725';
const gangsterNameserviceAbi = JSON.parse('[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"onCollectFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"onReceiveDonation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"bool","name":"_isContract","type":"bool"}],"name":"onSetNameForAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"onSetPrice","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"bool","name":"_status","type":"bool"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"onToggleOriginalGangster","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_blacklistedAddress","type":"address"},{"indexed":true,"internalType":"address","name":"_og","type":"address"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"},{"indexed":false,"internalType":"string","name":"_reason","type":"string"}],"name":"onUpdateBlacklistForAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"_blacklistedName","type":"string"},{"indexed":false,"internalType":"string","name":"_reason","type":"string"},{"indexed":false,"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"onUpdateBlacklistForName","type":"event"},{"inputs":[],"name":"_devwallet","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"checkAvailability","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"checkIsBlacklistedAddress","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"checkIsBlacklistedName","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"getAddressByName","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"getNameByAddress","outputs":[{"internalType":"string","name":"name","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"},{"internalType":"bool","name":"_isBlacklisted","type":"bool"},{"internalType":"string","name":"_reason","type":"string"}],"name":"setBlacklistAddressStatus","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_reason","type":"string"}],"name":"setBlacklistNameStatus","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"setNameRecord","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"},{"internalType":"string","name":"_name","type":"string"}],"name":"setNameRecordOf","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setPrice","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sweep","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"toggleOriginalGangster","outputs":[{"internalType":"bool","name":"_success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"txs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]');
const abi = JSON.parse('[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"exist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"liquidityController","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"contract IPancakePair","name":"","type":"address"}],"name":"liquidityPairLocked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"minter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"numberOfTokenHolders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"}],"name":"recoverTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_liquidityController","type":"address"},{"internalType":"bool","name":"_canControl","type":"bool"}],"name":"setLiquidityController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IPancakePair","name":"_liquidityPair","type":"address"},{"internalType":"bool","name":"_locked","type":"bool"}],"name":"setLiquidityLock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ITransferGate","name":"_transferGate","type":"address"}],"name":"setTransferGate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenHolder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"transferGate","outputs":[{"internalType":"contract ITransferGate","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_minter","type":"address"}],"name":"setMinter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"}]');
const erc20Abi = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]');
// mge contract
const mgeContractAddress = '0x052955037524DE7C1F24510A89978B4C5f5266BF';
const mgeAbi = JSON.parse('[{"inputs":[{"internalType":"address","name":"_devAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"contract IMarketDistribution","name":"_marketDistribution","type":"address"}],"name":"activate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"allowRefunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"baseToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimReferralRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"complete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"referral","type":"address"}],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"contribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"devAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"_baseToken","type":"address"}],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"marketDistribution","outputs":[{"internalType":"contract IMarketDistribution","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"}],"name":"recoverTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referralPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"refundsAllowedUntil","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IMarketDistribution","name":"_marketDistribution","type":"address"}],"name":"setMarketDistribution","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalContribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalReferralPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]');
const dripTokenAbi = JSON.parse('[{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_INT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"player","type":"address"}],"name":"statsOf","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addrs","type":"address[]"}],"name":"removeAddressesFromWhitelist","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"removeAddressFromWhitelist","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"targetSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"remainingMintableSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"player","type":"address"}],"name":"mintedBy","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"taxRate","type":"uint8"}],"name":"setAccountCustomTax","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vaultAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalTxs","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"removeAccountCustomTax","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"calculateTransferTaxes","outputs":[{"name":"adjustedValue","type":"uint256"},{"name":"taxAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"addAddressToWhitelist","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newVaultAddress","type":"address"}],"name":"setVaultAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"whitelist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mintedSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isExcluded","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"players","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addrs","type":"address[]"}],"name":"addAddressesToWhitelist","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"excludeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"includeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_initialMint","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"vault","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TaxPayed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"}],"name":"WhitelistedAddressAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"}],"name":"WhitelistedAddressRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]');
const basePairAddress = '0xdf16b952Cf4DD07D3649aB2a64930E3C41aac82F';
const pancakePairAbi = '[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]';
const burnContractAddress = '0xba2316994d68845652d92Ba582952FafE33C5994';
const burnContractAbi = '[{"inputs":[{"internalType":"contract ERC20","name":"_token","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Rebalance","type":"event"},{"inputs":[],"name":"getUnlockTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastRebalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ready","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rebalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"upperboundPercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]';


const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET_RPC_URL);

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
var serviceAccount = require("./projectsidekick-9feaf-firebase-adminsdk-crmpo-fa264eb57c.json");
const { access } = require("fs");
const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database"
];

const REALTIME_DB_URL = 'https://projectsidekick-9feaf-default-rtdb.firebaseio.com/';
const BIT_QUERY_URL = 'https://graphql.bitquery.io';
const POO_COIN_URL = 'https://chartdata.poocoin.app/'

const allowedOrigins = ['https://sidekick.finance', 'http://127.0.0.1:8020']

const graphQlClient = new GraphQLClient(BIT_QUERY_URL,
  {
    headers: {
      'X-API-KEY': 'BQYcxPYgpD0GWjh8twe4Sn0EpAXVIplC'
    }
  })

let bitQueryRetries = 0;
const NAME_SERVICE = 'NAME_SERVICE';
const DRIP_TRADES = 'DRIP_TRADES';
const ALLTIME_DRIP_TRADES = 'ALLTIME_DRIP_TRADES';
const PAIRS_BY_TRADE_AMOUNT = 'PAIRS_BY_TRADE_AMOUNT';
const TOP_TRADES_BY_TOKEN = 'TOP_TRADES_BY_TOKEN';
const TOKEN_SEARCH = 'TOKEN_SEARCH';
const QUOTE_PRICE = 'QUOTE_PRICE';
const BARS = 'GET_BARS';
const CANDLE_DATA = 'CANDLE_DATA';

// networks
const networks = [
  {
    network: 'ethereum',
    exchanges: ['Uniswap', 'SushiSwap'],
    excludedBaseCurrencies: [
      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // btc
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // weth
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // usdc
      "0xdac17f958d2ee523a2206206994597c13d831ec7", // usdt
    ]
  },
  {
    network: 'BSC',
    exchanges: ['Pancake v2', 'ApeSwap', 'BakerySwap'],
    excludedBaseCurrencies: [
      "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c", // btc
      "0x2170ed0880ac9a755fd29b2688956bd959f933f8", // ETH
      "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82", // CAKE
      "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", // wbnb
      "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // usdc
      "0xe9e7cea3dedca5984780bafc599bd69add087d56", //busd
      "0x55d398326f99059ff775485246999027b3197955" // usdt
    ]
  },
  {
    network: 'MATIC',
    exchanges: ['QuickSwap'],
    excludedBaseCurrencies: [
      '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', // wbtc
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',// weth
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',// wmatic
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',// usdt
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', //usdc
    ]
  }
]

let accessToken;
const pubsub = new PubSub();
const encryptionKey = crypto.randomBytes(32);
// Authenticate a JWT client with the service account.
var jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  scopes
);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'projectsidekick-9feaf.appspot.com'
// });

const bucket = storage.bucket('projectsidekick-9feaf.appspot.com');
admin.initializeApp();

const db = admin.database();



//////// AUTHENTICATION SECTION
//#region [Red]

//// TODO: Make a real secret and store it elsewhere
const JWT_SECRET = "CcUkD6dMtGQ9xdAfOsanTS9Y3SobXYxr";

const encryptAuthToken = payload => {
  return jwt.sign(
    {
      payload
    },
    JWT_SECRET,
    {
      expiresIn: (24 * 60 * 60)
    }
  )
}

const decryptAuthToken = request => {

  const authToken = request.headers.authorization;

  return jwt.verify(authToken, JWT_SECRET);
}

const checkAuthorization = (request, response) => {

  try {
    return decryptAuthToken(request);
  } catch {
    throw new Error("Invalid Token");
  }
}

const checkAdmin = (request, response) => {

  const token = checkAuthorization(request, response);

  if (token.payload.userType !== "admin") {
    throw new Error("User is not an administrator")
  }
}

const corsPreflight = (req, res, action) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    action();
  }
};

const crudEndpoint = async (request, createCallback, readCallback, updateCallback, deleteCallback) => {

  switch (request.method) {
    case "POST": await createCallback(); break;
    case "GET": await readCallback(); break;
    case "PATCH": await updateCallback(); break;
    case "DELETE": await deleteCallback(); break;
  }
}

exports.ping = functions.https.onRequest(async (req, res) => {
  corsPreflight(req, res, async () => {
    try {

      res.send(new Date());

    } catch (error) {

      console.error(error);
      res.send(error);
    }
  });
});

exports.authPing = functions.https.onRequest(async (req, res) => {
  corsPreflight(req, res, async () => {
    try {
      checkAuthorization(req, res)

      res.send(new Date());

    } catch (error) {

      console.error(error);
      res.status(401).send("Unauthorized");
    }
  });
});

exports.adminPing = functions.https.onRequest(async (req, res) => {
  corsPreflight(req, res, async () => {
    try {
      checkAdmin(req, res)

      res.send(new Date());

    } catch (error) {

      console.error(error);
      res.status(401).send("Unauthorized");
    }
  });
});

exports.getUserPreAuth = functions.https.onRequest(async (req, res) => {
  corsPreflight(req, res, async () => {
    try {

      let { publicAddress } = req.query;
      publicAddress = publicAddress.toLowerCase();

      let docTrackingRef = await admin.firestore().collection('userAuth').doc(publicAddress);
      const docTracking = await docTrackingRef.get();
      const userData = docTracking.data();

      if (userData) {
        res.json({ publicAddress: userData.publicAddress, nonce: userData.nonce });
      } else {
        res.json({ publicAddress: null, nonce: null });
      }

    } catch (error) {
      console.error(error)
      res.send(error);
    }
  });
});

exports.authToken = functions.https.onRequest(async (req, res) => {
  corsPreflight(req, res, async () => {
    try {

      let { publicAddress, signature } = req.body;
      publicAddress = publicAddress.toLowerCase();

      // Get the user's stored nonce
      let docTrackingRef = await admin.firestore().collection('userAuth').doc(publicAddress);
      const docTracking = await docTrackingRef.get();
      const { nonce, disabled, type } = docTracking.data();

      //// DEBUG
      //let nonce = "QWERTY";
      //let disabled = false;
      //let type = "admin";

      if (!nonce) {
        throw new Error("User does not have a nonce");
      }

      if (disabled) {
        throw new Error("User account is disabled");
      }

      // Hash the stored nonce
      const messageBuffer = Buffer.from(nonce);
      const messageHash = ethUtil.hashPersonalMessage(messageBuffer);

      // Decode the signature into its usable components (v, r, s)
      const sigDecoded = ethUtil.fromRpcSig(signature);

      // Recover address from the nonce hash and signature
      var recoveredPub = ethUtil.ecrecover(messageHash, sigDecoded.v, sigDecoded.r, sigDecoded.s);
      var recoveredAddress = `0x${ethUtil.pubToAddress(recoveredPub).toString("hex").toLowerCase()}`;

      // Verify recovered address against the given address
      if (recoveredAddress !== publicAddress) {
        throw new Error("Recovered address does not match the provided public address");
      }

      // Generate a new nonce for the user
      docTrackingRef.update({ nonce: generateRandomKey(20) });

      // Generate the auth token
      const authToken = encryptAuthToken({
        publicAddress: publicAddress,
        userType: type
      });

      res.json({ authToken })

    } catch (error) {
      console.error(error)

      res.status(401).send("Unauthorized: Error " + error);
    }
  });
});
//#endregion

//////// SideKick Admin Portal SECTION
//#region [Purple]

exports.adAccount = functions.https.onRequest(async (req, res) => {
  corsPreflight(req, res, async () => {
    try {
      checkAdmin(req, res);

      const adAccountCollection = await admin.firestore().collection('ad-account');

      crudEndpoint(req,
        // CREATE
        async () => {
          let { companyName } = req.body;
          let docId = generateRandomKey(20);
          let blankDoc = {
            companyName: !companyName ? "" : companyName,
            disabled: true,
            email: "",
            notes: "",
            phone: "",
            walletAddress: "",
            weight: 1
          }

          await adAccountCollection.doc(docId).set(blankDoc);

          res.send({ docId });
        },
        // READ
        async () => {
          let docId = req.query.docId

          if (docId) {
            let accountDoc = await adAccountCollection.doc(docId).get();

            res.send([{ ...accountDoc.data(), docId: accountDoc.id }]);
          } else {

            let accountResults = [];
            (await adAccountCollection.get()).forEach(adAccount => { accountResults.push({ ...adAccount.data(), docId: adAccount.id }) })

            res.send(accountResults);
          }
        },
        // UPDATE
        async () => {
          let { docId, companyName, disabled, email, notes, phone, walletAddress, weight } = req.body;

          await adAccountCollection.doc(docId).set({ companyName, disabled, email, notes, phone, walletAddress, weight });

          res.send({ docId });
        },
        // DELETE
        async () => {
          let docId = req.query.docId;

          const adCampaignCollection = await admin.firestore().collection('ad-campaign');
          const adAdsCollection = await admin.firestore().collection('ad-ads');

          const campaignQuery = adCampaignCollection.where("accountId", "==", docId);
          const campaignQuerySnapshot = await campaignQuery.get();
          const campaignIdList = [];
          campaignQuerySnapshot.forEach(doc => { campaignIdList.push(doc.id) });

          if (campaignIdList.length > 0) {
            const adQuerySnapshot = await adAdsCollection.where("campaignId", "in", campaignIdList).get();

            adQuerySnapshot.forEach(async adDoc => {
              await adDoc.ref.delete();
            });
          }

          campaignQuerySnapshot.forEach(async campaignDoc => {
            await campaignDoc.ref.delete();
          })

          await adAccountCollection.doc(docId).delete();

          res.send({ docId });
        }
      )


    } catch (error) {
      console.error(error)
      res.send(error);
    }
  });
});

exports.adCampaign = functions.https.onRequest(async (req, res) => {
  corsPreflight(req, res, async () => {
    try {
      checkAdmin(req, res);

      const adCampaignCollection = await admin.firestore().collection('ad-campaign');

      crudEndpoint(req,
        // CREATE
        async () => {
          let { accountId, name } = req.body;
          if (!accountId) {
            throw new Error("accountId is required to create a campaign");
          }

          let docId = generateRandomKey(20);
          let blankDoc = {
            accountId: accountId,
            clickCap: -1,
            disabled: true,
            endDate: "",
            impressionCap: -1,
            name: !name ? "" : name,
            startDate: "",
            weight: 1
          }

          await adCampaignCollection.doc(docId).set(blankDoc);

          res.send({ docId });
        },
        // READ
        async () => {
          let docId = req.query.docId;
          let accountId = req.query.accountId;

          if (docId) {
            let campaignDoc = await adCampaignCollection.doc(docId).get();

            res.send([{ ...campaignDoc.data(), docId: campaignDoc.id }]);
          } else if (accountId) {

            let campaignResults = [];
            (await adCampaignCollection.where("accountId", "==", accountId).get()).forEach(adCampaign => { campaignResults.push({ ...adCampaign.data(), docId: adCampaign.id }) })

            res.send(campaignResults);
          } else {

            let campaignResults = [];
            (await adCampaignCollection.get()).forEach(adCampaign => { campaignResults.push({ ...adCampaign.data(), docId: adCampaign.id }) })

            res.send(campaignResults);
          }
        },
        // UPDATE
        async () => {
          let { docId, accountId, clickCap, disabled, endDate, impressionCap, name, startDate, weight } = req.body;

          await adCampaignCollection.doc(docId).set({ accountId, clickCap, disabled, endDate, impressionCap, name, startDate, weight });

          res.send({ docId });
        },
        // DELETE
        async () => {
          let docId = req.query.docId;

          const adAdsCollection = await admin.firestore().collection('ad-ads');

          (await adAdsCollection.where("campaignId", "==", docId).get()).forEach(async adDoc => {
            await adDoc.ref.delete();
          });

          await adCampaignCollection.doc(docId).delete();

          res.send({ docId });
        }
      )

    } catch (error) {
      console.error(error)
      res.send(error);
    }
  });
});

exports.adAd = functions.https.onRequest(async (req, res) => {
  corsPreflight(req, res, async () => {
    try {
      checkAdmin(req, res);

      const adAdsCollection = await admin.firestore().collection('ad-ads');

      crudEndpoint(req,
        // CREATE
        async () => {
          let { campaignId, name } = req.body;
          if (!campaignId) {
            throw new Error("campaignId is required to create an ad");
          }

          let docId = generateRandomKey(20);
          let blankDoc = {
            buttonText: "",
            campaignId: campaignId,
            clicks: 0,
            descriptionText: "",
            disabled: true,
            fileLink: "",
            impressions: 0,
            mouseOverCount: 0,
            name: !name ? "" : name,
            target: "br",
            timeOnScreenActive: 0,
            timeOnScreenInactive: 0,
            url: "",
            weight: 1
          }

          await adAdsCollection.doc(docId).set(blankDoc);

          res.send({ docId });
        },
        // READ
        async () => {
          let docId = req.query.docId
          let campaignId = req.query.campaignId;

          if (docId) {
            let adDoc = await adAdsCollection.doc(docId).get();

            res.send([{ ...adDoc.data(), docId: adDoc.id }]);
          } else if (campaignId) {

            let adResults = [];
            (await adAdsCollection.where("campaignId", "==", campaignId).get()).forEach(adAd => { adResults.push({ ...adAd.data(), docId: adAd.id }) })

            res.send(adResults);
          } else {

            let adResults = [];
            (await adAdsCollection.get()).forEach(adAd => { adResults.push({ ...adAd.data(), docId: adAd.id }) });

            res.send(adResults);
          }
        },
        // UPDATE
        async () => {
          let { docId, buttonText, campaignId, descriptionText, disabled, fileLink, name, target, url, weight } = req.body;

          let adRef = await adAdsCollection.doc(docId);

          await adRef.update({ buttonText, campaignId, descriptionText, disabled, fileLink, name, target, url, weight });

          res.send({ docId });
        },
        // DELETE
        async () => {
          let docId = req.query.docId;

          await adAdsCollection.doc(docId).delete();

          res.send({ docId });
        }
      )

    } catch (error) {
      console.error(error)
      res.send(error);
    }
  });
});

//#endregion


//////// AUTHENTICATION SECTION
//#region [Green]

exports.getAd = functions.https.onRequest(async (req, res) => {
  corsPreflight(req, res, async () => {
    try {

      let target = req.query.target;

      let adResults = [];
      (await admin.firestore().collection('ad-ads').get()).forEach(adAd => { adResults.push({ ...adAd.data(), docId: adAd.id }) })

      let campaignResults = [];
      (await admin.firestore().collection('ad-campaign').get()).forEach(adCampaign => { campaignResults.push({ ...adCampaign.data(), docId: adCampaign.id }) })

      let accountResults = [];
      (await admin.firestore().collection('ad-account').get()).forEach(adAccount => { accountResults.push({ ...adAccount.data(), docId: adAccount.id }) })

      let finalAdList = [];
      let complexAccounts = accountResults.filter(x => !x.disabled).map(account => {

        account.campaigns = campaignResults.filter(x => !x.disabled && x.accountId === account.docId).map(campaign => {

          let tmpAdResults = adResults.filter(x => !x.disabled && x.campaignId === campaign.docId);

          campaign.totalImpressions = tmpAdResults.reduce((r, e) => r + e.impressions, 0)
          campaign.totalClicks = tmpAdResults.reduce((r, e) => r + e.clicks, 0)

          campaign.ads = tmpAdResults.filter(x => x.target == target).map(ad => {

            ad.adPower = account.weight * campaign.weight * ad.weight;
            finalAdList.push(ad);

            return ad;
          });

          return campaign;
        });

        return account
      });

      let maxNum = finalAdList.reduce((r, e) => r + e.adPower, 0);
      let randomNum = Math.floor(Math.random() * maxNum);
      let resultAd = null;
      let tmpCounter = 0;
      for (var i = 0; i < finalAdList.length; i++) {
        tmpCounter += finalAdList[i].adPower;
        if (tmpCounter >= randomNum) {
          resultAd = finalAdList[i];
          break;
        }
      }

      res.send(!resultAd ? {} : {
        descriptionText: resultAd.descriptionText,
        fileLink: resultAd.fileLink,
        buttonText: resultAd.buttonText,
        target: resultAd.target,
        url: resultAd.url,
        docId: resultAd.docId,
        complexAccounts: complexAccounts
      });
    } catch (error) {
      console.error(error)
      res.send(error);
    }
  });
});

exports.postAdStats = functions.https.onRequest(async (req, res) => {
  corsPreflight(req, res, async () => {
    try {
      let { docId, clicks, mouseOverCount, timeOnScreenActive, timeOnScreenInactive, impressions } = req.body;

      const adRef = admin.firestore().collection('ad-ads').doc(docId);

      const adRefRes = await adRef.update({
        clicks: admin.firestore.FieldValue.increment(clicks),
        mouseOverCount: admin.firestore.FieldValue.increment(mouseOverCount),
        timeOnScreenActive: admin.firestore.FieldValue.increment(timeOnScreenActive),
        timeOnScreenInactive: admin.firestore.FieldValue.increment(timeOnScreenInactive),
        impressions: admin.firestore.FieldValue.increment(impressions),
      });

      res.send({ status: "OK" });
    } catch (error) {
      console.error(error)
      res.send(error);
    }
  });
});

//#endregion

//////// SideKick-UI SECTION
//#region [Navy]

exports.getBars = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    // base token address in pair
    let quoteCurrency = req.query.quoteCurrency;
    let network = req.query.network;
    let baseCurrency = req.query.baseCurrency;
    let since = req.query.since;
    let till = req.query.till;
    let timeframe = req.query.timeframe;
    let minTrade = req.query.minTrade;

    const variables = {
      baseCurrency: baseCurrency.toLowerCase(),
      // wbnb
      quoteCurrency: quoteCurrency.toLowerCase(),
      since: since,
      till: till,
      window: parseInt(timeframe),
      // pancakeswap v2
      //exchange: exchange,
      network: network,
      minTrade: parseFloat(minTrade)
    }

    let docTrackingRef = admin.firestore().collection(BARS).doc(variables.baseCurrency);
    const docTracking = await docTrackingRef.get();
    const data = docTracking.data();
    let response;
    const lastUpdated_variable = `${variables.since}_${variables.till}`;

    if ((data === null || data === undefined || data[lastUpdated_variable] === null || data[lastUpdated_variable] === undefined)) {
      // refresh candle data
      response = await graphQlClient.request(GET_BARS, variables);

      // save to filestorage
      file = bucket.file(`${BARS}/${variables.baseCurrency}/${timeframe}/${lastUpdated_variable}.json`);
      await file.save(JSON.stringify(response));

      // set lastUpdated time on variables 
      let trackingObj = {};
      trackingObj[lastUpdated_variable] = moment().utc().format();
      await docTrackingRef.set(trackingObj);

    } else {
      let lastUpdated = data[lastUpdated_variable];
      const diff = Math.abs(new Date() - new Date(lastUpdated));
      const mins = Math.floor((diff / 1000) / 60);
      if (mins > 2) {
        // cached data too old get fresh
        response = await graphQlClient.request(GET_BARS, variables);
        // save to filestorage        
        if (response !== undefined && response.ethereum.dexTrades !== undefined) {
          file = bucket.file(`${BARS}/${variables.baseCurrency}/${timeframe}/${variables.since}_${variables.till}.json`);
          await file.save(JSON.stringify(response));

          // set lastUpdated
          let trackingObj = {};
          trackingObj[lastUpdated_variable] = moment().utc().format();
          await docTrackingRef.set(trackingObj);

        }
      }
    }

    if (response === undefined) {
      const file = bucket.file(`${BARS}/${variables.baseCurrency}/${timeframe}/${lastUpdated_variable}.json`);
      const exists = await file.exists();
      if (file !== undefined && exists && exists[0] === true) {
        let blobResponse = await file.download();
        response = JSON.parse(Buffer.from(blobResponse[0], 'base64').toString());
      }
    }

    if (response !== undefined && response.ethereum !== undefined) {
      res.send(response);
    } else {
      res.send('GetBars found no data: ' + variables);
    }

  } catch (error) {
    console.error(error)
    res.send(error);
  }
});

exports.resolveSymbol = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    // base token address in pair
    let quoteCurrency = req.query.quoteCurrency;
    let network = req.query.network;
    let baseCurrency = req.query.baseCurrency;

    const variables = {
      // wbnb
      quoteCurrency: quoteCurrency.toLowerCase(),
      baseCurrency: baseCurrency.toLowerCase(),
      network: network
    }

    response = await graphQlClient.request(RESOLVE_SYMBOL, variables);

    res.send(response);
  } catch (error) {
    console.error(error)
    res.send(error);
  }

})

// returns chart series data
// @param tokenAddress string "0xfdjk...."
// @param timeframe int minutes 5 30 60 etc
// @param since
// @param till
exports.getCandleData = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    // base token address in pair
    let tokenAddress = req.query.tokenAddress;
    // timeframe in minutes 5, 30, 60, 240 1day 1wk
    let timeframe = req.query.timeframe;
    let response = undefined;
    let file;
    let since = req.query.since;
    let till = req.query.till;

    let network = req.query.network;
    if (network === undefined) {
      network = 'bsc';
    }

    let quoteCurrency = req.query.quoteCurrency;
    if (quoteCurrency === undefined) {
      quoteCurrency = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
    }

    const variables = {
      baseCurrency: tokenAddress.toLowerCase(),
      // wbnb
      quoteCurrency: quoteCurrency,
      since: moment(since).utc().format('YYYY-MM-DD'),
      till: moment(till).utc().format('YYYY-MM-DD'),
      window: parseInt(timeframe),
      minTrade: 10,
      network: network
    }

    let docTrackingRef = admin.firestore().collection('dataTracking').doc(variables.baseCurrency);
    const docTracking = await docTrackingRef.get();
    const data = docTracking.data();

    if ((data === null || data === undefined || data.candleDatalastUpdated === null || data.candleDatalastUpdated === undefined)) {
      // refresh candle data
      response = await graphQlClient.request(GET_CANDLE_DATA, variables);

      // save to filestorage
      file = bucket.file(`${CANDLE_DATA}/${timeframe}/${variables.till}/${variables.baseCurrency}.json`);
      await file.save(JSON.stringify(response));

      // set candleDataLastUpdated
      await docTrackingRef.set({
        candleDatalastUpdated: moment().utc().format()
      });
    } else {
      const diff = Math.abs(new Date() - new Date(data.candleDatalastUpdated));
      const mins = Math.floor((diff / 1000) / 60);
      if (mins > 5) {
        // refresh candle data        
        response = await graphQlClient.request(GET_CANDLE_DATA, variables);
        // save to filestorage        
        file = bucket.file(`${CANDLE_DATA}/${timeframe}/${variables.till}/${variables.baseCurrency}.json`);
        await file.save(JSON.stringify(response));
        // set candleDataLastUpdated
        await docTrackingRef.set({
          candleDatalastUpdated: moment().utc().format()
        });
      }
    }

    //IF FRESHDATA RETURN ELSE GRAB CACHED
    if (response === undefined) {
      //grab cached
      const file = bucket.file(`${CANDLE_DATA}/${timeframe}/${variables.till}/${variables.baseCurrency}.json`);
      const exists = await file.exists();
      if (file !== undefined && exists && exists[0] === true) {
        let blobResponse = await file.download();
        response = JSON.parse(Buffer.from(blobResponse[0], 'base64').toString());
      }
    }

    res.send(response);

  } catch (error) {
    console.error(error)
    res.send(error);
  }
});

exports.getNameServiceMappings = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    // either gangster_names_mapped or sidekick_names_mapped
    let nameServiceReq = req.query.nameService;
    const file = bucket.file(`${NAME_SERVICE}/${nameServiceReq}.json`);
    const exists = await file.exists();
    if (file !== undefined && exists && exists[0] === true) {
      let blobResponse = await file.download();
      response = JSON.parse(Buffer.from(blobResponse[0], 'base64').toString());
      res.send(response);
    }
  } catch (e) {
    console.log(e);
    res.send(error);
  }
})

// returns address / symbol / name of tokens in array
// @param tokens string[]
exports.getTokenData = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    let tokenVariables = {};

    if (req.query.tokens === undefined) {
      tokenVariables = {
        tokens: [
          "0xc30f12cd65f61ded24db6c415c84f999c9704ebc",
          "0xef2ec90e0b8d4cdfdb090989ea1bc663f0d680bf",
          "0xce5814efff15d53efd8025b9f2006d4d7d640b9b",
          "0xcd2ecd5e06b1a330789b30e8ada3d11c51503a71",
          "0x0110ff9e7e4028a5337f07841437b92d5bf53762",
          "0x4a824ee819955a7d769e03fe36f9e0c3bd3aa60b",
          "0x69b2f663d311c0743ec6fd40bea04f31bd9704b6",
          "0x2921872530f53eb8e6fc388676b141ef41ee2d4e",
          "0x812ff2420ec87eb40da80a596f14756acf98dacc",
          "0xe95748df47e3ed06f545735bdedc63331c520c6d"
        ]
      }
    }
    else
      tokenVariables.tokens = req.query.tokens;

    var response = await graphQlClient.request(TOKENS, tokenVariables);

  } catch (error) {
    console.error(error)
    res.send(error);
  }

  res.send(response);
});
// returns latest pairs
// @param limit int
// @param offest
exports.getLatestPairs = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    let variables = {};

    if (req.query.factoryAddress !== undefined)
      variables.factoryAddress = req.query.factoryAddress;
    else {
      //hardcode pancakeswap factory
      variables.factoryAddress = "0xbcfccbde45ce874adcb698cc183debcf17952812";
    }

    if (req.query.network !== undefined)
      variables.network = req.query.network;
    else {
      //hardcode pancakeswap factory
      variables.network = "bsc";
    }

    if (req.query.limit !== undefined)
      variables.limit = parseInt(req.query.limit);
    else
      variables.limit = 20;
    if (req.query.offset !== undefined)
      variables.offset = parseInt(req.query.offset);
    else
      variables.offset = 0;


    var response = await graphQlClient.request(GET_LATEST_PAIRS, variables);
  } catch (error) {
    console.error(error)
    res.send(error);
  }

  res.send(response);
});
// returns quote price based in quote currency
// @param baseCurrency string
// @param quoteCurrency string
exports.getQuotePrice = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  let response = {};
  try {
    let variables = {};

    if (req.query.baseCurrency !== undefined)
      variables.baseCurrency = req.query.baseCurrency.toLowerCase();

    if (req.query.quoteCurrency !== undefined)
      variables.quoteCurrency = req.query.quoteCurrency.toLowerCase();

    if (req.query.network !== undefined)
      variables.network = req.query.network;
    else {
      //hardcode pancakeswap factory
      variables.network = "bsc";
    }

    // check firestore for latest price
    var firebaseResult = await admin.firestore().collection(QUOTE_PRICE).doc(variables.baseCurrency).get();
    var data = firebaseResult.data();

    if ((data !== null && data !== undefined && data.lastUpdated !== null && data.lastUpdated !== undefined)) {
      // fire msg to download data      
      const diff = Math.abs(new Date() - new Date(data.lastUpdated));
      const mins = Math.floor((diff / 1000) / 60);
      // 10 min delay on prices
      if (mins < 1) {
        res.send(data.data);
        return;
      }
    }
    try {
      response = await graphQlClient.request(GET_QUOTE_PRICE, variables);
    } catch (e) {
      console.error(e);
      //try again
      response = await graphQlClient.request(GET_QUOTE_PRICE, variables);
    }
    console.log('getQuotePrice: had to hit bitquery');
    if (response !== undefined && response.ethereum !== undefined && response.ethereum.dexTrades.length > 0) {
      await admin.firestore().collection(QUOTE_PRICE).doc(variables.baseCurrency).set({
        data: response,
        lastUpdated: moment().utc().format()
      });
    }

  } catch (error) {
    console.error(error)
    res.send(error);
  }

  res.send(response);
});
// returns list of tokens matching string and network
// @search string
// @network network string
exports.getTokenSearch = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    let variables = {};

    if (req.query.search !== undefined) {
      variables.search = req.query.search.toLowerCase();
    }

    if (req.query.network !== undefined) {
      variables.network = req.query.network.toLowerCase();
    }

    let networkAddress = variables.search.length === 42 ? true : false;

    if (networkAddress) // length of eth address
    {
      // check for cached search
      var firebaseResult = await admin.firestore().collection(TOKEN_SEARCH).doc(variables.search).get();
      var cachedData = firebaseResult.data();
      if (cachedData !== undefined && cachedData !== null && cachedData.data !== undefined && cachedData.data !== null) {
        res.send({ search: cachedData.data });
        return;
      }

    }

    var response = await graphQlClient.request(GET_TOKENS_BY_NAME, variables);
    if (response !== undefined && response.search !== undefined) {
      response.search = response.search.map(item => {
        return { type: 'Search Results', ...item }
      })
    }

    if (networkAddress && response.search.length > 0) {
      // save to firebase db
      await admin.firestore().collection(TOKEN_SEARCH).doc(variables.search).set({
        data: response.search,
        lastUpdated: moment().utc().format()
      });
    }

  } catch (error) {
    console.error(error)
    res.send(error);
  }

  res.send(response);
});
// returns all trades for an address
// @param wallet string
// @param since
// @param till
// @param limit int
// @param offest
exports.getTradesForAddress = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    let variables = {};

    variables.since = req.query.since;
    variables.till = req.query.till;
    variables.limit = parseInt(req.query.limit);
    variables.offset = parseInt(req.query.offset);
    variables.wallet = req.query.wallet.toLowerCase();
    variables.network = req.query.network;
    if (variables.network === undefined) {
      variables.network = 'bsc';
      variables.quoteCurrencies = ["0xe9e7cea3dedca5984780bafc599bd69add087d56", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "0x55d398326f99059ff775485246999027b3197955"];
    } else {
      switch (variables.network) {
        case 'bsc':
          variables.quoteCurrencies = ["0xe9e7cea3dedca5984780bafc599bd69add087d56", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "0x55d398326f99059ff775485246999027b3197955"];
          break;
        case 'ethereum':
          variables.quoteCurrencies = [];
          break;
        case 'matic':
          variables.quoteCurrencies = [];
          break;
      }
    }


    var response = await graphQlClient.request(GET_TRADES_FOR_ADDRESS, variables);
  } catch (error) {
    console.error(error)
    res.send(error);
  }

  res.send(response);
});
// returns all trades for wallet with specfieid token
// @param wallet string
// @param token string
// @param since
// @param till
// @param limit int
// @param offest
// @param network (bsc, ethereum)
exports.getTradesForAddressByToken = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    let variables = {};

    variables.since = req.query.since;
    variables.till = req.query.till;
    variables.limit = parseInt(req.query.limit);
    variables.offset = parseInt(req.query.offset);
    variables.wallet = req.query.wallet.toLowerCase();
    variables.token = req.query.token.toLowerCase();
    variables.network = req.query.network;

    var response = await graphQlClient.request(GET_TRADES_FOR_ADDRESS_BY_TOKEN, variables);
  } catch (error) {
    console.error(error)
    res.send(error);
  }

  res.send(response);
});
// returns top trades for a token by tradeAmount
// @param token string
// @param since
// @param till
// @param limit int
// @param offest
// @param network (bsc, ethereum)
exports.getTopTradesByToken = functions.runWith({ timeoutSeconds: 540, memory: '1GB' }).https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Content-Type', 'text/plain');
  res.set('Content-Encoding', 'gzip');

  let response = {};
  let variables = {};
  try {
    variables.since = req.query.since;
    variables.till = req.query.till;
    variables.limit = parseInt(10000);
    variables.offset = parseInt(req.query.offset);
    variables.token = req.query.token.toLowerCase();
    variables.network = req.query.network;
    const todayString = moment.utc(variables.till).format('YYYY-MM-DD');

    // firestore lastudpated
    var docTracking = await admin.firestore().collection('dataTracking').doc(variables.token).get();
    const data = docTracking.data();

    if ((data === null || data === undefined || data.lastUpdated === null || data.lastUpdated === undefined)) {
      // fire msg to download data      
      publishMessageToTopic(variables, 'refresh-top-trades')
    } else {
      const diff = Math.abs(new Date() - new Date(data.lastUpdated));
      const mins = Math.floor((diff / 1000) / 60);
      if (mins > 15) {
        publishMessageToTopic(variables, 'refresh-top-trades')
      }
    }

    // }
    const file = bucket.file(`${TOP_TRADES_BY_TOKEN}/${todayString}/${variables.token}.json`);
    const exists = await file.exists();
    if (file !== undefined && exists && exists[0] === true) {
      let blobResponse = await file.download();
      response = JSON.parse(Buffer.from(blobResponse[0], 'base64').toString());
    } else {
      // attempt to download
      response = await getTopTradesByToken(variables);
    }

  } catch (error) {
    console.error(error)
    res.send(error);
  }

  // limit to 100 on the return
  // response = response.slice(0, 100)

  zlib.gzip(JSON.stringify(response), (error, result) => {
    if (error) console.log(error);
    res.send(result);
  });
});

exports.getAlltimeDripTrades = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    let response = {};
    // check cache 
    const todayString = moment.utc().format('YYYY-MM-DD');

    const file = bucket.file(`${ALLTIME_DRIP_TRADES}/${todayString}.json`);
    const exists = await file.exists();
    if (file !== undefined && exists && exists[0] === true) {
      let blobResponse = await file.download();
      response = JSON.parse(Buffer.from(blobResponse[0], 'base64').toString());
    }

    res.send(response);

  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

exports.getTopDripTradesNew = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    let variables = {};
    variables.since = req.query.since;
    variables.till = req.query.till;
    let response = {};
    const todayString = moment.utc(req.query.till).format('YYYY-MM-DD');

    const file = bucket.file(`${DRIP_TRADES}/${todayString}/${dripTokenAddress}.json`);
    const exists = await file.exists();
    if (file !== undefined && exists && exists[0] === true) {
      let blobResponse = await file.download();
      response = JSON.parse(Buffer.from(blobResponse[0], 'base64').toString());
    } else {
      // attempt to download
      response = await getDripTrades(variables);

    }


    res.send(response);

  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

// returns token pairs by trade volume
// @param since string date yyyy-mm-dd
// @param till
// @param limit int
// @param offest
exports.getPairsByTradeAmount = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    let variables = {};

    variables.network = req.query.network;

    if (variables.network === undefined) {
      variables.network = 'bsc';
    }

    switch (variables.network) {
      case 'bsc':
        variables.exchange = ['Pancake v2', 'ApeSwap', 'BakerySwap', '<Uniswap v2>'];
        break;
      case 'matic':
        variables.exchange = ['QuickSwap'];
        break;
      case 'ethereum':
        variables.exchange = ['Uniswap', 'SushiSwap']
    }

    variables.since = moment().utc().subtract(1, 'd').format();
    variables.till = moment().utc().format();
    variables.limit = parseInt(req.query.limit);
    variables.offset = parseInt(req.query.offset);

    var response = await graphQlClient.request(GET_PAIRS_BY_TRADE_AMOUNT, variables);

    if (response !== undefined && response !== null && response.ethereum !== null
      && response.ethereum.dexTrades !== null && response.ethereum.dexTrades.length > 0) {
      // Push the new message into Firestore using the Firebase Admin SDK.
      await admin.firestore().collection(`${PAIRS_BY_TRADE_AMOUNT}_${network.toUpperCase()}`).doc(moment().utc().format('YYYY-MM-DD')).set({
        data: response.ethereum.dexTrades,
        lastUpdated: moment().utc().format()
      });
    }
  } catch (error) {
    console.error(error)
    res.send(error);
  }

  res.send('success');
});

exports.getTrueTopDripTrades = functions.runWith({ timeoutSeconds: 540, memory: "512MB" }).https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    let variables = {
      limit: 30,
      offset: 0,
      since: moment('2020-01-01').utc().format(),
      till: moment().utc().format()
    };

    var response = await graphQlClient.request(GET_TRUE_TOP_TRADES, variables);

    res.send(response);
  } catch (error) {
    console.error(error)
    res.send(error);
  }
});

exports.getTrueTopTrades = functions.runWith({ timeoutSeconds: 540, memory: "512MB" }).https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {

    let variables = {
      network: req.query.network === undefined ? 'bsc' : req.query.network,
      token: req.query.token,
      limit: 100,
      offset: 0,
      since: moment('2020-01-01').utc().format(),
      till: moment().utc().format()
    };

    var response = await graphQlClient.request(GET_TRUE_TOP_TRADES, variables);

    res.send(response);
  } catch (error) {
    console.error(error)
    res.send(error);
  }
});

exports.getERC20TotalSupply = functions.https.onRequest(async (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');
  let retries = 0;
  const address = req.query.address;
  let totalSupply = 0;
  do {


    try {
      const contract = new ethers.Contract(address, erc20Abi, provider);
      const decimals = await contract.decimals();
      const totalSupplyWei = await contract.totalSupply();
      if (decimals === 18) {
        totalSupply = parseFloat(ethers.utils.formatEther(totalSupplyWei));
      } else {
        totalSupply = parseFloat(totalSupplyWei) / parseFloat('1e' + decimals);
      }

      if (totalSupply !== undefined) {
        break;
      }
    } catch (e) {
      console.log(e);
      retries++;
    }
  } while (retries < 5)

  res.send(totalSupply.toString());
})


//// SAVES / UPDATES / DELETES

exports.uploadBlob = functions.https.onRequest(async (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

  // const { account } = req.query;
  // const data = req.body;
  let variables = {};
  variables.since = moment().utc().subtract(1, 'd').format();
  variables.till = moment().utc().format();
  variables.limit = parseInt(10000);
  variables.offset = 0;
  variables.network = 'bsc';
  variables.token = '0x036b1da4e8dd9773a3dcda1a3feb86e2926811d2';
  const todayString = moment().utc().format('YYYY-MM-DD');
  try {
    // const metaData = {
    //   contentType: 'application/json'
    // }
    const file = bucket.file(`${TOP_TRADES_BY_TOKEN}/${todayString}/0x036b1da4e8dd9773a3dcda1a3feb86e2926811d2.json`);
    // file.setEncryptionKey(encryptionKey);
    let response = await getTopTradesByToken(variables);

    await file.save(JSON.stringify(response));

    // file.download((err, contents) => {
    //   const data = JSON.parse(Buffer.from(contents, 'base64').toString());
    //   res.send(JSON.stringify(data))
    // });

    response = await file.download();

    const data = JSON.parse(Buffer.from(response[0], 'base64').toString());
    res.send(JSON.stringify(data))

  } catch (error) {
    console.error(error)
    res.send(error);
  }
})

exports.saveUserInfo = functions.https.onRequest(async (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

  const { account } = req.query;
  const data = req.body;

  try {


    let userdata = await admin.firestore().collection('user').doc(account);
    if (userdata != undefined) {
      await userdata.set(data);
    }

  } catch (error) {
    console.error(error)
    res.send(error);
  }

  res.json({ result: `UserInfo for ${account} updated.` });

})

exports.deleteFromRealtimeDb = functions.https.onRequest(async (req, res) => {

  const gresponse = await jwtClient.authorize();
  if (gresponse.error) {
    console.log("Error making request to generate access token:", error);
    res.send(error);
  } else if (gresponse.access_token === null) {
    console.log("Provided service account does not have permission to generate access tokens");
    res.send('no access');
  }

  accessToken = gresponse.access_token;
  const tokens = [
    '0x036b1da4e8dd9773a3dcda1a3feb86e2926811d2',
    '0x04c747b40be4d535fc83d09939fb0f626f32800b',
    '0x06c4212ae2fea51a27a045d968e73f7e91ea5521',
    '0x071fa11f7516cdeb366f7f7d91da5049f7086185',
    '0x08ba0619b1e7a582e0bce5bbe9843322c954c340',
    '0x08c975868e547bfe5f76db7d1e075680e9736034',
    '0x0c13970d3c5db20d48446a24e29fb9a77cd60de4',
  ]

  for (let i = 0; i < tokens.length - 1; i++) {
    const resp = await axios({
      method: 'delete',
      url: `${REALTIME_DB_URL}db/${TOP_TRADES_BY_TOKEN}/${tokens[i]}.json?access_token=${accessToken}`,
    })
    console.log(resp);
  }

});

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.saveContractStats = functions.https.onRequest(async (req, res) => {
  console.log('grabbing latest contract data');
  const initialSupply = 100000000;
  // token

  const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET_RPC_URL);

  const skContract = new ethers.Contract(contractAddress, abi, provider);
  const totalSupply = ethers.utils.formatEther((await skContract.totalSupply()).toString());
  const totalHodlers = (await skContract.numberOfTokenHolders()).toString();

  const skInBurnAddress = ethers.utils.formatEther((await skContract.balanceOf(burnContractAddress)).toString());

  const lpContract = new ethers.Contract(basePairAddress, pancakePairAbi, provider);

  const reserves = await lpContract.getReserves();

  const lpBaseTokenReserves = ethers.utils.formatEther(reserves._reserve0.toString());
  const lpBNBTokenReserves = ethers.utils.formatEther(reserves._reserve1.toString());

  console.log(`total SK: ${lpBaseTokenReserves}`)
  console.log(`total bnb: ${lpBNBTokenReserves}`)

  const bnbInfo = await axios.get('https://api.coingecko.com/api/v3/coins/wbnb?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false');

  const bnbPrice = bnbInfo.data.market_data.current_price.usd;

  const totalUSDLiquidity = parseFloat(bnbPrice) * parseFloat(lpBNBTokenReserves);

  const tokenPrice = (parseFloat(lpBNBTokenReserves) / parseFloat(lpBaseTokenReserves)) * parseFloat(bnbPrice);

  const mktCap = tokenPrice * totalSupply;

  // Push the new message into Firestore using the Firebase Admin SDK.
  await admin.firestore().collection('stats').doc(contractAddress).set({
    circulatingSupply: parseFloat(totalSupply) - parseFloat(skInBurnAddress),
    burned: skInBurnAddress,
    totalBNBInPool: lpBNBTokenReserves,
    liquidityPoolUSD: totalUSDLiquidity,
    marketcapUSD: mktCap,
    skPrice: tokenPrice,
    totalHodlers: totalHodlers,
    lastUpdated: moment().utc().format()
  });
  // Send back a message that we've successfully written the message
  res.json({ result: `Stats for contract ${contractAddress} updated.` });

});

//// REFRESH / SCHEDUELED 

exports.refreshLatestPairs = functions.runWith({ timeoutSeconds: 540, memory: "2GB" }).pubsub.schedule('every 60 minutes').onRun(async (context) => {
  console.log('grabbing latest pair data');

  try {
    let variables = {};
    variables.limit = 100;
    variables.offset = 0;
    variables.network = 'bsc';
    variables.exchange = 'Pancake v2'

    var response = await request(POO_COIN_URL, GET_LATEST_PAIRS, variables);

    if (response !== undefined && response !== null) {

      // grab pair data for each pair
      await admin.firestore().collection('GET_LATEST_PAIRS').doc(moment().utc().format('YYYY-MM-DD')).set({
        data: response.ethereum.arguments,
        lastUpdated: moment().utc().format()
      });
    }

  } catch (error) {
    console.error(error)
  }

  // Send back a message that we've successfully written the message  
  return null;
});

// exports.refreshPairsByTradeAmount = functions.runWith({ timeoutSeconds: 540, memory: "512MB" }).https.onRequest(async (req, res) => {
exports.refreshPairsByTradeAmount = functions.pubsub.schedule('every 15 minutes').onRun(async (context) => {
  console.log('grabbing latest pair trade data');

  try {
    let variables = {};
    variables.since = moment().utc().subtract(1, 'd').format();
    variables.till = moment().utc().format();
    variables.limit = 300;
    variables.offset = 0;

    networks.forEach(async (networkObj, index) => {
      const { network, exchanges, excludedBaseCurrencies } = networkObj;

      variables.network = network.toLowerCase();
      variables.exchange = exchanges
      variables.excludedBaseCurrencies = excludedBaseCurrencies;

      var response = await graphQlClient.request(GET_PAIRS_BY_TRADE_AMOUNT, variables);

      if (response !== undefined && response !== null) {
        // Push the new message into Firestore using the Firebase Admin SDK.
        await admin.firestore().collection(`${PAIRS_BY_TRADE_AMOUNT}_${network.toUpperCase()}`).doc(moment().utc().format('YYYY-MM-DD')).set({
          data: response.ethereum.dexTrades,
          lastUpdated: moment().utc().format()
        });
      }
    })

  } catch (error) {
    console.error(error)
  }

  // Send back a message that we've successfully written the message  

  //res.send('success');
  return null;
});

exports.refreshTopTradesByToken = functions.runWith({ timeoutSeconds: 540, memory: "2GB" }).pubsub.topic('refresh-top-trades').onPublish(async (message, context) => {
  const variables = message.data ? JSON.parse(Buffer.from(message.data, 'base64').toString()) : null;
  console.log('grabbing latest top trade data for ' + variables.token);

  try {
    const doc = await admin.firestore().collection('dataTracking').doc(variables.token).get();
    const data = doc.data();
    let file;

    if (data !== null && data !== undefined) {
      const diff = Math.abs(new Date() - new Date(data.lastUpdated));
      const mins = Math.floor((diff / 1000) / 60);
      // if lastUpdate is within 5 mins dont do anything
      if (mins <= 5) {
        return;
      }
    }

    await admin.firestore().collection('dataTracking').doc(variables.token).set({
      lastUpdated: moment().utc().format()
    });

    console.log('grabbing topTrades result1')
    const result = await getTopTradesByToken(variables);

    if (variables.token !== undefined && result !== undefined && result.length > 0) {

      console.log('saving top trades to cloud storage')
      file = bucket.file(`${TOP_TRADES_BY_TOKEN}/${moment.utc(variables.till).format('YYYY-MM-DD')}/${variables.token}.json`);
      await file.save(JSON.stringify(result));

    }

    const variables2 = { ...variables };
    variables2.since = moment().utc().subtract(2, 'd').format();
    variables2.till = moment().utc().subtract(1, 'd').format();
    console.log('grabbing topTrades result2')
    const result2 = await getTopTradesByToken(variables2);

    if (result2 !== undefined && result2.length > 0) {

      console.log('saving top trades 2 to cloud storage')

      file = bucket.file(`${TOP_TRADES_BY_TOKEN}/${moment.utc(variables2.till).format('YYYY-MM-DD')}/${variables2.token}.json`);
      await file.save(JSON.stringify(result2));

      console.log(`successfully downloaded data for token ${variables.token} : TX COUNT = ${result.length + result2.length}`);
    }
  } catch (error) {
    console.log(error);
  }
});

exports.refreshTopTradesByTokenListManual = functions.runWith({ timeoutSeconds: 540, memory: "512MB" }).https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  console.log('grabbing latest top trade data');

  try {
    const gresponse = await jwtClient.authorize();
    if (gresponse.error) {
      console.log("Error making request to generate access token:", error);
      res.send(error);
    } else if (gresponse.access_token === null) {
      console.log("Provided service account does not have permission to generate access tokens");
      res.send('no access');
    }

    accessToken = gresponse.access_token;

    const collectionRef = await admin.firestore().collection(PAIRS_BY_TRADE_AMOUNT);
    const snapshot = await collectionRef.orderBy("lastUpdated", "desc").limit(1).get();

    // if (snapshot.docs !== undefined && snapshot.docs.length > 0) {
    //   const doc = snapshot.docs[0];

    //   const topPairs = doc.data();

    let variables = {};
    variables.since = moment().utc().subtract(1, 'd').format();
    variables.till = moment().utc().format();
    variables.limit = parseInt(10000);
    variables.offset = 0;
    variables.network = 'bsc';
    variables.accessToken = accessToken;

    const addressArray = [
    ]

    addressArray.push(req.query.token.toLowerCase());

    // for(const address of addressArray){
    //   variables.token = address;
    // }

    for (const address of addressArray) {
      variables.token = address.toLowerCase();
      // for (const pair of topPairs.data) {

      //   variables.token = pair.baseCurrency.address.toLowerCase();
      console.log('grabbing token data: ', variables.token)

      await publishMessageToTopic(variables, 'refresh-top-trades')

      // const topic = pubsub.topic('refresh-top-trades');

      // const msgBuffer = Buffer.from(JSON.stringify(variables));
      // await topic.publish(msgBuffer);

      console.log('msg sent for ' + variables.token)
    };

    console.log('got all trades')
    // }
  } catch (error) {
    console.error(error)
  }

  res.send('success');
});

//refresh every 20 mins starting at beginning of day to end
exports.refreshAlltimeDripTrades = functions.runWith({ timeoutSeconds: 540, memory: "512MB" }).pubsub.schedule('*/30 0-23 * * *').onRun(async (context) => {
  // exports.refreshDripData = functions.pubsub.schedule('every 2 minutes').onRun(async (context) => {
  // exports.refreshAlltimeDripTrades = functions.runWith({ timeoutSeconds: 540, memory: "512MB" }).https.onRequest(async (req, res) => {
  try {
    let variables = {};
    variables.since = moment('2021-01-01').utc().format();
    variables.till = moment().utc().subtract(1, 'm').format();
    let file;
    let top500;

    console.log(`grabbing all drip trades since the beginning: ${variables.since} - ${variables.till}`);
    const result = await graphQlClient.request(GET_ALLTIME_DRIP_TRADES, variables);

    if (result !== undefined && result.ethereum.arguments !== undefined) {
      let transactions = result.ethereum.arguments;
      transactions.sort((a, b) => (parseFloat(ethers.utils.formatEther(a.bnb_amount)) < parseFloat(ethers.utils.formatEther(b.bnb_amount))) ? 1 : -1);
      top500 = transactions.slice(0, 500);
    }

    // calculate top buyers / sellers top 500
    if (top500 !== undefined && top500.length > 0) {
      console.log('saving trades to cloud storage');
      file = bucket.file(`${ALLTIME_DRIP_TRADES}/${moment.utc(variables.till).format('YYYY-MM-DD')}.json`);
      await file.save(JSON.stringify(top500));
    }

  } catch (e) {
    console.log(e);
  }

  // Send back a message that we've successfully written the message  
  // res.send('done')
  return null;
});

//refresh every 10 mins starting at beginning of day to end
exports.refreshDripData = functions.pubsub.schedule('*/5 0-23 * * *').onRun(async (context) => {
  // exports.refreshDripData = functions.pubsub.schedule('every 2 minutes').onRun(async (context) => {
  // exports.refreshDripData = functions.https.onRequest(async (req, res) => {
  // token
  const contract = new ethers.Contract(dripTokenAddress, dripTokenAbi, provider);
  const totalSupply = ethers.utils.formatEther((await contract.totalSupply()).toString());

  // Push the new message into Firestore using the Firebase Admin SDK.
  await admin.firestore().collection('stats').doc(dripTokenAddress.toLowerCase()).set({
    totalSupply: totalSupply,
    lastUpdated: moment().utc().format()
  });

  // refresh latestDripTrades
  try {
    let variables = {};
    variables.since = moment().utc().subtract(1, 'd').format();
    variables.till = moment().utc().format();

    let file;

    await admin.firestore().collection('dripTracking').doc(dripTokenAddress).set({
      lastUpdated: moment().utc().format()
    });

    console.log('grabbing dripTrades result1')
    const result = await getDripTrades({ ...variables });

    if (result !== undefined && result.length > 0) {
      console.log('saving drip trades to cloud storage');
      file = bucket.file(`${DRIP_TRADES}/${moment.utc(variables.till).format('YYYY-MM-DD')}/${dripTokenAddress}.json`);
      await file.save(JSON.stringify(result));
    }

    const variables2 = { ...variables };
    variables2.since = moment().utc().subtract(2, 'd').format();
    variables2.till = moment().utc().subtract(1, 'd').format();
    console.log('grabbing drip trades result2')
    const result2 = await getDripTrades(variables2);

    if (result2 !== undefined && result2.length > 0) {

      console.log('saving driptrades 2 to cloud storage')

      file = bucket.file(`${DRIP_TRADES}/${moment.utc(variables2.till).format('YYYY-MM-DD')}/${dripTokenAddress}.json`);
      await file.save(JSON.stringify(result2));

      console.log(`successfully downloaded data for token ${dripTokenAddress} (DRIPPPP) : TX COUNT = ${result.length + result2.length}`);
    }

  } catch (e) {
    console.log(e);
  }

  // Send back a message that we've successfully written the message  
  return null;
});

exports.refreshTopTradesByTokenList = functions.pubsub.schedule('0,10 0-23 * * *').onRun(async (context) => {
  console.log('grabbing latest top trade data');

  try {
    const gresponse = await jwtClient.authorize();
    if (gresponse.error) {
      console.log("Error making request to generate access token:", error);
      return null;
    } else if (gresponse.access_token === null) {
      console.log("Provided service account does not have permission to generate access tokens");
      return null;
    }

    accessToken = gresponse.access_token;

    const collectionRef = await admin.firestore().collection(PAIRS_BY_TRADE_AMOUNT);
    const snapshot = await collectionRef.orderBy("lastUpdated", "desc").limit(1).get();

    if (snapshot.docs !== undefined && snapshot.docs.length > 0) {
      const doc = snapshot.docs[0];

      const topPairs = doc.data();

      let variables = {};
      variables.since = moment().utc().subtract(1, 'd').format();
      variables.till = moment().utc().format();
      variables.limit = parseInt(10000);
      variables.offset = 0;
      variables.network = 'bsc';
      variables.accessToken = accessToken;

      for (const pair of topPairs.data) {

        variables.token = pair.baseCurrency.address.toLowerCase();
        console.log('grabbing token data: ', variables.token)

        const topic = pubsub.topic('refresh-top-trades');

        const msgBuffer = Buffer.from(JSON.stringify(variables));
        await topic.publish(msgBuffer);

        console.log('msg sent for ' + variables.token)
      };

      console.log('got all trades')
    }
  } catch (error) {
    console.error(error)
  }

  return null;
});

exports.refreshNameserviceListsV2 = functions.runWith({ timeoutSeconds: 540, memory: "512MB" }).https.onRequest(async (req, res) => {
  //exports.refreshNameserviceListsV2 = functions.runWith({ timeoutSeconds: 540, memory: "1GB" }).pubsub.schedule('*/1 0-23 * * *').onRun(async (context) => {
  console.log('grabbing latest name service lists');
  // cehck the gangster finance / sidekick name service and build out an array of mappings 

  const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET_RPC_URL);
  const skNameContract = new ethers.Contract(sidekickNameserviceAddress, skNameserviceAbi, provider);
  let filter = skNameContract.filters["onSetNameForAddress(address,address,string,bool)"]();
  const gangsterNameContract = new ethers.Contract(gangsterNameServiceAddress, gangsterNameserviceAbi, provider);
  let gFilter = gangsterNameContract.filters["onSetNameForAddress(address,address,string,bool)"]();

  const blockIncrement = 50;
  let skStartBlock = 12870600;
  let gangsterStartBlock = 12765407;
  // let gangsterStartBlock = 9407000;
  let latestBlock = skStartBlock + 100;
  let skNamesArray = [], gangsterNamesArray = [];
  let retries = 0;
  console.log('here');

  /* /// DOWNLOAD GANGSTER NAMES AND STORE IN STORAGE
  let doc = await admin.firestore().collection('nameservice').doc('gangster').get();
  let gangsterData = doc.data();
  console.log('here');
  //testing
  // gangsterData = { latestBlock: 1, lastBlock: 10165500 }

  if (gangsterData !== null && gangsterData !== undefined && gangsterData.latestBlock !== null && gangsterData.latestBlock > 0) {
    gangsterStartBlock = gangsterData.latestBlock;

    const file = bucket.file(`${NAME_SERVICE}/gangster_names.json`);
    const exists = await file.exists();
    if (file !== undefined && exists && exists[0] === true) {
      let blobResponse = await file.download();
      gangsterNamesArray = JSON.parse(Buffer.from(blobResponse[0], 'base64').toString());
    }
  }

  do {
    try {
      let events = await gangsterNameContract.queryFilter(gFilter, gangsterStartBlock, gangsterStartBlock + blockIncrement); //10138160 starting block for sk nameserivce
      gangsterNamesArray = gangsterNamesArray.concat(events);
      gangsterStartBlock += blockIncrement;
    } catch (e) {
      console.log('failed to download gangster events: block: ' + gangsterStartBlock + '/' + latestBlock);
      gangsterStartBlock += -500
      console.log('restarting on block: ' + gangsterStartBlock + ' - ' + moment().utc().format())
      retries += 1;
      // sleep(1000);
      if (retries > 100) {
        retries = 0;
        break;
      }
    }
  }
  while (gangsterStartBlock < latestBlock)

  let file = bucket.file(`${NAME_SERVICE}/gangster_names.json`);
  await file.save(JSON.stringify(gangsterNamesArray));

  file = bucket.file(`${NAME_SERVICE}/gangster_names_mapped.json`);
  let mapped = gangsterNamesArray.map(x => {
    if (x !== undefined && x.args !== undefined) {
      return { address: x.args[1], name: x.args[2], hash: x.transactionHash }
    }
  });

  await file.save(JSON.stringify(mapped));

  await admin.firestore().collection('nameservice').doc('gangster').set({
    lastUpdated: moment().utc().format(),
    lastBlock: gangsterStartBlock > latestBlock ? latestBlock : gangsterStartBlock,
    latestBlock: latestBlock
  }); */


  /// DOWNLOAD SIDEKICK NAMES AND STORE IN STORAGE
  doc = await admin.firestore().collection('nameservice').doc('sidekickV2').get();
  console.log('here1');
  const skData = doc.data();
  console.log('here');
  if (skData !== null && skData !== undefined && skData.latestBlock !== null && skData.latestBlock > 0) {
    console.log('here2');
    skStartBlock = skData.lastBlock;

    file = bucket.file(`${NAME_SERVICE}/sidekick_namesV2.json`);
    const exists = await file.exists();
    if (file !== undefined && exists && exists[0] === true) {
      let blobResponse = await file.download();
      skNamesArray = JSON.parse(Buffer.from(blobResponse[0], 'base64').toString());
    }
  }

  do {
    console.log('here3');
    try {
      let events = await skNameContract.queryFilter(filter, skStartBlock, skStartBlock + blockIncrement); //10138160 starting block for sk nameserivce
      skNamesArray = skNamesArray.concat(events);
      skStartBlock += blockIncrement;
      console.log('here4');
    } catch (e) {
      console.log('failed to download sidekick events: block: ' + skStartBlock + '/' + latestBlock);
      skStartBlock += -500
      console.log('restarting on block: ' + skStartBlock + ' - ' + moment().utc().format())
      if (retries > 0) {
        break;
      }
    }
    console.log('heree5');
  }

  while (skStartBlock < latestBlock)

  file = bucket.file(`${NAME_SERVICE}/sidekick_namesV2.json`);
  await file.save(JSON.stringify(skNamesArray));

  file = bucket.file(`${NAME_SERVICE}/sidekick_names_mappedV2.json`);
  mapped = skNamesArray.map(x => {
    if (x !== undefined && x.args !== undefined) {
      return { address: x.args[1], name: x.args[2], hash: x.transactionHash }
    }
  });
  await file.save(JSON.stringify(mapped));

  // Push the new message into Firestore using the Firebase Admin SDK.
  await admin.firestore().collection('nameservice').doc('sidekickV2').set({
    lastUpdated: moment().utc().format(),
    lastBlock: skStartBlock > latestBlock ? latestBlock : skStartBlock,
    latestBlock: latestBlock
  });
  //Send back a message that we've successfully written the message  
  return res.status(200).send('Successfully written');
  //res.send('success');
});

exports.getNameServiceNames = exports.refreshNameserviceListsV2 = functions.runWith({ timeoutSeconds: 540, memory: "512MB" }).pubsub.schedule('*/4 0-23 * * *').onRun(async (context) => {
  //exports.getNameServiceNames = functions.runWith({ timeoutSeconds: 540, memory: "512MB" }).https.onRequest(async (req, res) => {
  let response = {};
  try {
    let variables = {};
    let gvariables = {};
    let sideKickNamesArray = [];
    let gangsterNamesArray = [];



    variables.smartContractAddress = sidekickNameserviceAddress;
    sidekickNames = await graphQlClient.request(GET_NAMESERVICE_NAMES, variables);
    for (let nameObject of sidekickNames.ethereum.smartContractEvents) {
      let existingName = sideKickNamesArray.find(x => x.address.toUpperCase() === nameObject.arguments[1].value.toUpperCase());
      if (existingName !== undefined && nameObject.block.timestamp.unixtime > existingName.block) {
        index = sideKickNamesArray.indexOf(existingName);
        sideKickNamesArray.splice(index, 1);

        skName = { address: nameObject.arguments[1].value, name: nameObject.arguments[2].value, block: nameObject.block.timestamp.unixtime }
        sideKickNamesArray.push(skName);
      } else if (existingName === undefined) {
        skName = { address: nameObject.arguments[1].value, name: nameObject.arguments[2].value, block: nameObject.block.timestamp.unixtime }
        sideKickNamesArray.push(skName);
      }
    }

    file = bucket.file(`${NAME_SERVICE}/sidekick_names_mappedV2.json`);
    await file.save(JSON.stringify(sideKickNamesArray));


    gvariables.smartContractAddress = gangsterNameServiceAddress;
    gangsterNames = await graphQlClient.request(GET_NAMESERVICE_NAMES, gvariables);

    for (let nameObject of gangsterNames.ethereum.smartContractEvents) {
      let existingName = gangsterNamesArray.find(x => x.address.toUpperCase() === nameObject.arguments[1].value.toUpperCase());
      if (existingName !== undefined && nameObject.block.timestamp.unixtime > existingName.block) {
        index = gangsterNamesArray.indexOf(existingName);
        gangsterNamesArray.splice(index, 1);

        gName = { address: nameObject.arguments[1].value, name: nameObject.arguments[2].value, block: nameObject.block.timestamp.unixtime }
        gangsterNamesArray.push(gName);
      } else if (existingName === undefined) {
        gName = { address: nameObject.arguments[1].value, name: nameObject.arguments[2].value, block: nameObject.block.timestamp.unixtime }
        gangsterNamesArray.push(gName);
      }
    }
    //console.log(gangsterNamesArray);
    gFile = bucket.file(`${NAME_SERVICE}/gangster_names_mappedV4.json`);
    let file2 = bucket.file(`${NAME_SERVICE}/gangster_names_mappedV3.json`);
    let blobResponse2 = await file2.download();
    oldGNamesMapped = JSON.parse(Buffer.from(blobResponse2[0], 'base64').toString());
    console.log(oldGNamesMapped.length);
    //compare addresses in oldGNamesMapped with gangsterNamesArray, if in both console.log the address and name
    for (let oldGNamesMappedObject of oldGNamesMapped) {
      let existingName = gangsterNamesArray.find(x => x.address.toUpperCase() === oldGNamesMappedObject.address.toUpperCase());
      if (existingName !== undefined) {
        console.log('found matching addresses');
        if (existingName.block > oldGNamesMappedObject.block) {
          index = oldGNamesMapped.indexOf(oldGNamesMappedObject);
          const spliced = oldGNamesMapped.splice(index, 1);
          console.log(spliced);
        }
      }
    }
    console.log(oldGNamesMapped.length);
    //await file2.save(JSON.stringify(oldGNamesMapped));

    gNamesCombined = gangsterNamesArray.concat(oldGNamesMapped);

    await gFile.save(JSON.stringify(gNamesCombined));

  } catch (error) {
    console.error(error)
    res.send(error);

  }

  res.status(200).send('success');
});

exports.scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  console.log('grabbing latest contract data');
  const initialSupply = 100000000;
  // token

  const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET_RPC_URL);

  const skContract = new ethers.Contract(contractAddress, abi, provider);
  const totalSupply = ethers.utils.formatEther((await skContract.totalSupply()).toString());
  const totalHodlers = (await skContract.numberOfTokenHolders()).toString();

  const skInBurnAddress = ethers.utils.formatEther((await skContract.balanceOf(burnContractAddress)).toString());

  const lpContract = new ethers.Contract(basePairAddress, pancakePairAbi, provider);

  const reserves = await lpContract.getReserves();

  const lpBaseTokenReserves = ethers.utils.formatEther(reserves._reserve0.toString());
  const lpBNBTokenReserves = ethers.utils.formatEther(reserves._reserve1.toString());

  console.log(`total SK: ${lpBaseTokenReserves}`)
  console.log(`total bnb: ${lpBNBTokenReserves}`)

  const bnbInfo = await axios.get('https://api.coingecko.com/api/v3/coins/wbnb?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false');

  const bnbPrice = bnbInfo.data.market_data.current_price.usd;

  const totalUSDLiquidity = parseFloat(bnbPrice) * parseFloat(lpBNBTokenReserves);

  const tokenPrice = (parseFloat(lpBNBTokenReserves) / parseFloat(lpBaseTokenReserves)) * parseFloat(bnbPrice);
  const circulatingSupply = parseFloat(totalSupply) - parseFloat(skInBurnAddress);
  const mktCap = tokenPrice * circulatingSupply;

  // Push the new message into Firestore using the Firebase Admin SDK.
  await admin.firestore().collection('stats').doc(contractAddress).set({
    circulatingSupply: circulatingSupply,
    burned: skInBurnAddress,
    totalBNBInPool: lpBNBTokenReserves,
    liquidityPoolUSD: totalUSDLiquidity,
    marketcapUSD: mktCap,
    skPrice: tokenPrice,
    totalHodlers: totalHodlers,
    lastUpdated: moment().utc().format()
  });
  // Send back a message that we've successfully written the message  
  return null;
});


class ReferralNode {
  constructor(value) {
    this.value = value;
    this.downline = [];
  }
}

let allUplines = {};
//get the latest upline events from flow contract
exports.getFlowInfo = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  console.log('grabbing latest flow team');

  try {
    const provider = new ethers.providers.JsonRpcProvider(
      BSC_TESTNET_RPC_URL
    );

    const flowContract = new ethers.Contract(
      flowContractTestnet,
      flowAbi,
      provider
    );
    let address = req.query.address;
    address = address.toLowerCase();

    const base = new ReferralNode(address);

    const response = await graphQlClient.request(GET_FLOW_UPLINES);


    //console.log(response.ethereum.smartContractEvents);
    allUplines = response.ethereum.smartContractEvents;

    let baseLine = calculateLine(base); //Get Base downline tree


    let nextLine = iterateThroughDownline(baseLine);


    //await admin.firestore().collection('flow').collection(flowContractTestnet)

    //
    res.send(base);
  } catch (e) {
    console.log(e);
    res.send("Error");
  }

  //return null;
});



//#endregion

const calculateLine = (currentLine) => {

  let txCount = 0;
  allUplines.forEach((transaction) => {
    let sender = transaction.arguments[0].value;
    let upline = transaction.arguments[1].value;

    if (upline === currentLine.value) {
      sender = new ReferralNode(sender);
      currentLine.downline.push(sender);
      //allUplines.splice(txCount, 1);
    }


    txCount++;

    /* console.log(`User **${user}**`);
      console.log(`Set new upline **${upline}**`); */
  });
  return currentLine.downline;
};

const iterateThroughDownline = (downlineArray) => {
  console.log("going thru downline");
  downlineArray.forEach((referral) => {
    let line = calculateLine(referral);
    iterateThroughDownline(line);
  })
  return downlineArray;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function generateRandomKey(length) {
  return new Array(length).fill(null).map(n => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 52)]).join("")
}
