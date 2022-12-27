const platforms = {
    binance: {
        id: "binance-smart-chain",
        chain_identifier: 56,
        name: "Binance Smart Chain",
        shortname: "BSC",
        stableCoinList: ['0x55d398326f99059ff775485246999027b3197955', '0x55d398326f99059ff775485246999027b3197955', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        baseToken: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'     
    },
    ethereum: {
        id: "ethereum",
        chain_identifier: 1,
        name: "Ethereum",
        shortname: ""
    },
    matic: {
        id: "polygon-pos",
        chain_identifier: 137,
        name: "Polygon POS",
        shortname: "MATIC"
    },
    tron: {
        id: "tron",
        chain_identifier: null,
        name: "TRON",
        shortname: ""
    }

};

export { platforms };