const { request, gql } = require('graphql-request')

exports.TOKENS = gql`query GetTokenInfo($tokens: [String!]) {
    ethereum(network: bsc) {
      address(address: {in: $tokens}){
        address
        smartContract {
          currency{
            symbol
            name
          }
        }
      }
    }
}`

exports.GET_BARS = gql`query GetBars(
  $baseCurrency: String!,
  $since: ISO8601DateTime,
  $till: ISO8601DateTime,
  $quoteCurrency: String!,
  $network: EthereumNetwork,
  $minTrade: Float
  $window: Int) {
    ethereum(network: $network) {
         dexTrades(
            options: {asc: "timeInterval.minute"}
            time: {since: $since, till: $till}
            baseCurrency: {is: $baseCurrency},
            quoteCurrency: {is: $quoteCurrency},
            tradeAmountUsd: {gt: $minTrade}
            )  
      {
           timeInterval 
          {
            minute(count: $window, format: "%Y-%m-%dT%H:%M:%SZ")  
          }
          volume: quoteAmount
          median: quotePrice (calculate: median) 
          high: quotePrice(calculate: maximum)
          median: quotePrice (calculate: median) 
          low: quotePrice(calculate: minimum)
          open: minimum(of: block, get: quote_price)
          close: maximum(of: block, get: quote_price) 
        }
    }
}`

exports.RESOLVE_SYMBOL = gql`query ResolveSymbol(
  $baseCurrency: String!,
  $quoteCurrency: String!,
  $network: EthereumNetwork)
{
  ethereum(network: $network) {
  dexTrades(
  options: {desc: ["block.height", "transaction.index"], limit: 1}
  baseCurrency: {is: $baseCurrency}
  quoteCurrency: {is: $quoteCurrency}
) 
  {
    block {
      height
      timestamp {
        time(format: "%Y-%m-%d %H:%M:%S") 
      }
    }
    transaction {
      index
    }
    baseCurrency {
      name
      symbol
      decimals
    }
    quotePrice
    }
  }
}`

exports.GET_CANDLE_DATA = gql`query GetCandleData(
  $baseCurrency: String!,
  $since: ISO8601DateTime,
  $till: ISO8601DateTime,
  $quoteCurrency: String!,
  $minTrade: Float
  $window: Int,
  $network: EthereumNetwork!) {
    ethereum(network: $network) {
        dexTrades(
            options: {asc: "timeInterval.minute"}
            date: {since: $since, till: $till}
            baseCurrency: {is: $baseCurrency}
            quoteCurrency: {is: $quoteCurrency} # WBNB
            tradeAmountUsd: {gt: $minTrade}
        ) {
            timeInterval {
                minute(count: $window, format: "%Y-%m-%dT%H:%M:%SZ")
            }
            baseCurrency {
                symbol
                address
            }
            quoteCurrency {
                symbol
                address
            }

            tradeAmount(in: USD)
            trades: count
            quotePrice
            maximum_price: quotePrice(calculate: maximum)
            minimum_price: quotePrice(calculate: minimum)
            open_price: minimum(of: block, get: quote_price)
            close_price: maximum(of: block, get: quote_price)
        }
    }
}`
exports.GET_PAIRS_BY_TRADE_AMOUNT = gql`query GetPairsByTradeAmount($network: EthereumNetwork!, $exchange:[String!], $excludedBaseCurrencies:[String!], $limit: Int!, $offset: Int!, $since: ISO8601DateTime, $till: ISO8601DateTime) {
ethereum(network: $network) {
dexTrades(
  options: {desc: ["tradeAmount"], limit: $limit, offset: $offset}
  time: {since: $since, till: $till}
  exchangeName: {in: $exchange}
  baseCurrency: {notIn: $excludedBaseCurrencies}
) {
  exchange {
    fullName
  }
  baseCurrency {
    address
    symbol
  }
  trades: count
  tradeAmount(in: USD)
}
}
}`
exports.GET_LATEST_PAIRS = gql`query GetLatestPairs(
$limit: Int,
$offset: Int,
$network: EthereumNetwork!,
$factoryAddress: String!
)
{
ethereum(network: $network) {
  arguments(
    options: {desc: ["block.height","index"], limit: $limit,offset:$offset}
    smartContractAddress: {in: $factoryAddress, }
    smartContractEvent: {is: "PairCreated"}
  ) {
    block {
      height
      timestamp {time}
    }
    index
    pair: any(of: argument_value, argument: {is: "pair"})
    token0: any(of: argument_value, argument: {is: "token0"})
    token0Name: any(of: argument_value, argument: {is: "token0"}, as: token_name)
    token1: any(of: argument_value, argument: {is: "token1"})
    token1Name: any(of: argument_value, argument: {is: "token1"}, as: token_name)
  }
}
}`
exports.GET_QUOTE_PRICE = gql`query GetQuotePrice($baseCurrency: String, $network: EthereumNetwork!) {
ethereum(network: $network) {
  dexTrades(
    baseCurrency: {is: $baseCurrency}
    options: {desc: ["block.height", "transaction.index"], limit: 1}
  ) {
    block {
      height
      timestamp {
        time(format: "%Y-%m-%d %H:%M:%S")
      }
    }
    transaction {
      index
    }
    baseCurrency {
      symbol
      name
    }
    quoteCurrency {
      symbol
      name
    }
    quotePrice
  }
}
}`
exports.GET_TRADES_FOR_ADDRESS = gql`query GetTradesForAddress($wallet: String, $since: ISO8601DateTime, $till: ISO8601DateTime, $limit: Int, $offset: Int, $network: EthereumNetwork!) {
  ethereum(network: $network) {
    dexTrades(
      options: {desc: ["block.timestamp.time"], limit: $limit, offset: $offset}
      txSender: {is: $wallet}
      time: {after: $since, before: $till}
      quoteCurrency: { in: ["0xe9e7cea3dedca5984780bafc599bd69add087d56", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "0x55d398326f99059ff775485246999027b3197955"]}
    ) {
      block {
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
      }
      baseAmount
      baseCurrency {
        address
        symbol
      }
      quoteAmount
      quoteCurrency {
        address
        symbol
      }
      transaction {
        hash
        txFrom {
          address
        }
      }
      tradeAmount(in: USD)
      buyAmount(in: USD)
      sellAmount(in: USD)
      side
    }
  }
}`

exports.GET_TRADES_FOR_ADDRESS_BY_TOKEN = gql`query GetTradesForAddressByToken($network: EthereumNetwork!,$wallet:String $token: String!, 
  $limit: Int!, $offset: Int!, $since: ISO8601DateTime, $till: ISO8601DateTime) {
ethereum(network: $network) {
  dexTrades(
    options: {desc: ["block.height", "tradeIndex"], limit: $limit, offset: $offset}
    date: {since: $since, till: $till}
    baseCurrency: {is: $token}
    txSender: {is: $wallet}
  ) {
    block {
      timestamp {
        time(format: "%Y-%m-%d %H:%M:%S")
      }
      height
    }
    tradeIndex
    exchange {
      fullName
    }
    baseAmount
    baseCurrency {
      address
      symbol
    }
    quoteAmount
    quoteCurrency {
      address
      symbol
    }
    transaction {
      hash
      txFrom {
        address
      }
    }
    tradeAmount(in: USD)
    buyAmount(in: USD)
    sellAmount(in: USD)
    gasPrice
    gasValue(in: USD)
  }
}
}`

// gets trades by tradeamount between certain timeperiod
exports.GET_TRUE_TOP_TRADES = gql`query GetTrueTopTrades($network: EthereumNetwork!,$token: String!, $limit: Int!, $offset: Int!, $since: ISO8601DateTime, $till: ISO8601DateTime) {
  ethereum(network: $network) {
    dexTrades(
      options: {desc: ["tradeAmount"], limit: $limit, offset: $offset}
      time: {since: $since, till: $till}
      baseCurrency: {is: $token}
    ) {
      block {
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
      }
      baseAmount
      baseCurrency {
        symbol
      }
      quoteAmount
      quoteCurrency {
        address
        symbol
      }
      transaction {
        hash
        txFrom {
          address
        }
      }
      tradeAmount(in: USD)
      buyAmount(in: USD)
      sellAmount(in: USD)
    }
  }
}`

exports.GET_TOP_TRADES_BY_TOKEN = gql`query GetLatestTrades($network: EthereumNetwork!,$token: String!, $limit: Int!, $offset: Int!, $since: ISO8601DateTime, $till: ISO8601DateTime) {
  ethereum(network: $network) {
    dexTrades(
      options: {asc: ["block.timestamp.time"], limit: $limit, offset: $offset}
      time: {since: $since, till: $till}
      baseCurrency: {is: $token}
    ) {
      block {
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
      }
      baseAmount
      baseCurrency {
        address
        symbol
      }
      quoteCurrency {
        symbol
      }
      transaction {
        hash
        txFrom {
          address
        }
      }
      tradeAmount(in: USD)
      buyAmount(in: USD)
      sellAmount(in: USD)
      exchange {
        fullName
        fullNameWithId
      }
    }
  }
}`
exports.GET_TOP_TRADES_BY_TOKEN_COUNT = gql`query GetLatestTradesCount($network: EthereumNetwork!, $token: String!, $since: ISO8601DateTime, $till: ISO8601DateTime) {
ethereum(network: $network) {
dexTrades(
  time: {since: $since, till: $till}
  baseCurrency: {is: $token}
) {
  count(uniq: txs)
}
}
}`

exports.GET_TOKENS_BY_NAME = gql`query TokenSearch($search: String!, $network: Network) {
search(string: $search, network: $network) {
network {
  network
}
subject {
  __typename
  ... on Address {
    address
    annotation
  }
  ... on Currency {
    symbol
    name
    address
    tokenType
    decimals
  }
  ... on SmartContract {
    address
    annotation
    contractType
    protocol
  }
  ... on TransactionHash {
    hash
  }
}
}
}`

exports.GET_DRIP_TRADES = gql`query GetDripLatestTrades($since: ISO8601DateTime, $till: ISO8601DateTime) {
  ethereum(network: bsc) {
    arguments(
      smartContractEvent: {in: ["onTokenPurchase(address,uint256,uint256)", "onBnbPurchase(address,uint256,uint256)"]}
      smartContractAddress: {is: "0x4Fe59AdcF621489cED2D674978132a54d432653A"}
      time: {since: $since, till: $till}
    ) {
      block {
        timestamp {
          time
        }
      }
      transaction {
        hash
      }
      buyer: any(of: argument_value, argument: {in: ["customerAddress", "buyer"]})
      bnb_amount: any(of: argument_value, argument: {in: ["incomingEthereum", "bnb_amount"]})
      token_amount: any(of: argument_value, argument: {in: ["tokensMinted", "token_amount"]})
      method: any(of: signature_name, smartContractEvent: {})
    }
  }
}`

exports.GET_ALLTIME_DRIP_TRADES = gql`query GetDripAlltimeTrades($since: ISO8601DateTime, $till: ISO8601DateTime) {
  ethereum(network: bsc) {
    arguments(
      smartContractEvent: {in: ["onTokenPurchase(address,uint256,uint256)", "onBnbPurchase(address,uint256,uint256)"]}
      smartContractAddress: {is: "0x4Fe59AdcF621489cED2D674978132a54d432653A"}
      time: {since: $since, till: $till}
    ) {
      block {
        timestamp {
          time
        }
      }
      transaction {
        hash
      }
      buyer: any(of: argument_value, argument: {in: ["customerAddress", "buyer"]})
      bnb_amount: any(of: argument_value, argument: {in: ["incomingEthereum", "bnb_amount"]})
      token_amount: any(of: argument_value, argument: {in: ["tokensMinted", "token_amount"]})
      method: any(of: signature_name, smartContractEvent: {})
    }
  }
}`

exports.GET_FLOW_UPLINES = gql`
  query FlowUplines {
    ethereum(network: bsc_testnet) {
      smartContractEvents(
        smartContractAddress: {
          is: "0xf6B5B7cc91e2CD624fFAA581866D58d40E8c9DE1"
        }
        smartContractEvent: { is: "Upline" }
      ) {
        smartContractEvent {
          name
        }
        arguments {
          value
          argument
        }
        transaction {
          hash
        }
      }
    }
  }
`;
exports.GET_NAMESERVICE_NAMES = gql`
query MyQuery($smartContractAddress: String!) {
  ethereum(network: bsc) {
    smartContractEvents(
      smartContractEvent: {is: "onSetNameForAddress"}
      smartContractAddress: {is: $smartContractAddress}
      options: {asc: "block.height"}
    ) {
      arguments {
        argument
        value
      }
      block {
        timestamp {
          unixtime
        }
        height
      }
    }
  }
}

`;
