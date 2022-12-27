const { request, gql, GraphQLClient } = require('graphql-request')
const axios = require('axios');
const { PubSub } = require('@google-cloud/pubsub');
const moment = require('moment');
const { tokens,
    getCandleData,
    GET_PAIRS_BY_TRADE_AMOUNT,
    getLatestPairs,
    getTokenPairQuotePrice,
    GET_TRADES_FOR_ADDRESS,
    GET_TRADES_FOR_ADDRESS_BY_TOKEN,
    GET_TOP_TRADES_BY_TOKEN,
    GET_TOP_TRADES_BY_TOKEN_COUNT,
    GET_DRIP_TRADES,
    GET_TOKENS_BY_NAME } = require('./graphql_constants');

const BIT_QUERY_URL = 'https://graphql.bitquery.io';
const POO_COIN_URL = 'https://chartdata.poocoin.app/';
const TOP_TRADES_BY_TOKEN = 'TOP_TRADES_BY_TOKEN';
const REALTIME_DB_URL = 'https://projectsidekick-9feaf-default-rtdb.firebaseio.com/';

const graphQlClient = new GraphQLClient(BIT_QUERY_URL, 
    {
      headers :{
          'X-API-KEY': 'BQYcxPYgpD0GWjh8twe4Sn0EpAXVIplC'  
        }
    })
  

const pubsub = new PubSub();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports.saveTopTradesByToken = async function saveTopTradesByToken(trades, variables, saveRef, db) {
    let dbResult;

    // firebase best practices for arrays
    let updates = {};
    trades.map(item => {
        const newPostKey = db.ref(`db/${TOP_TRADES_BY_TOKEN}/${variables.token}/${saveRef}`).child(`data/`).push().key;
        updates[newPostKey] = item;
    })

    dbResult = await axios({
        method: 'put',
        url: `${REALTIME_DB_URL}db/${TOP_TRADES_BY_TOKEN}/${variables.token}/${saveRef}.json?access_token=${variables.accessToken}`,
        data: {
            data: updates,
            since: variables.since,
            till: variables.till
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    })

}

module.exports.getDripTrades = async function getDripTrades(variables){
    let response = {};
    let queryResp = await graphQlClient.request(GET_DRIP_TRADES, variables);

    if (queryResp !== undefined && queryResp.ethereum !== undefined && queryResp.ethereum.arguments !== undefined) {
      response = queryResp.ethereum.arguments;
    }
    
    return response;
}

module.exports.getTopTradesByToken = async function getTopTradesByToken(variables) {
    let response;
    let dexTrades = [];
    let retries = 0;
    // check total count
    response = await graphQlClient.request(GET_TOP_TRADES_BY_TOKEN_COUNT, variables);

    if (response !== undefined && response.ethereum && response.ethereum.dexTrades && response.ethereum.dexTrades.length > 0 &&
        response.ethereum.dexTrades[0].count > variables.limit) {
        console.log('Trade Count: ', response.ethereum.dexTrades[0].count);
        console.log('Token', variables.token)
        let pages = Math.ceil(response.ethereum.dexTrades[0].count / variables.limit);
        variables.limit = variables.limit;
        variables.offset = 0;

        for (let i = 0; i < pages; i++) {
            if (i > 0) {
                variables.offset = variables.limit * i;
            }
            try {
                response = await graphQlClient.request(GET_TOP_TRADES_BY_TOKEN, variables);
            } catch (error) {
                console.log(error);
                if (retries < 4) {
                    await delay(200);
                    response = await graphQlClient.request(GET_TOP_TRADES_BY_TOKEN, variables);
                }
                else {
                    return response;
                }
            }
            dexTrades = dexTrades.concat(response.ethereum.dexTrades);
            dexTrades = [...new Set(dexTrades)]
            console.log("Page #", i + 1, " processed")
        }
    } else {
        response = await graphQlClient.request(GET_TOP_TRADES_BY_TOKEN, variables);
        dexTrades = dexTrades.concat(response.ethereum.dexTrades)
    }

    return dexTrades;
}

module.exports.publishMessageToTopic = async function publishMessageToTopic(data, topicString) {
    const topic = pubsub.topic(topicString);

    const msgBuffer = Buffer.from(JSON.stringify(data));
    await topic.publish(msgBuffer);
}