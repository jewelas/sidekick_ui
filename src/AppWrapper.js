import React, { useEffect } from 'react';
import moment from 'moment';
import App from './App';

import { featuredCoinsList } from 'config/featured_coins_list';
import { platforms } from 'config/coingecko_platforms';

import { useStoreState, useStoreActions } from 'easy-peasy'
import { getMbudAddress, getMGEAddress, getRootedAddress, getWbnbAddress, getDripTokenAddress } from 'utils/addressHelpers';
import { useGetCandleData, useGetNameServiceMappings, useListOfTokenPrices } from 'hooks/useData';
import { useSubscriptionLevel } from 'hooks/useSKSubscription';
import { GetBnbPrice } from 'services/ApiService';
import { GetQuotePrice } from 'services/FirebaseService';
import { useWallet } from 'use-wallet';
import CurrencyConverter from 'utils/currencyConverter';
import TokenPriceCache from 'utils/tokenPriceCache';
import { getCoingeckoPlatform } from './utils/dappUtils';

const AppWrapper = (props) => {
    const { firebase } = props;
    const { bnbPrice, selectedNetwork } = useStoreState(state => state.Dapp);
    const { setFirebase, setSidekickTokenStats, setGenerationEventStats, setCandleData, setBnbPrice, setPairsByTradeAmount, setDripStats, setSystemNotification, setFeaturedCoinsList, setSubscription } = useStoreActions((actions) => actions.Dapp)

    // to do swap featured coin list based on network
    const featuredCoinPriceList = useListOfTokenPrices(featuredCoinsList.map(x => x.subject.address), getCoingeckoPlatform(selectedNetwork).id);

    // past 30 days of candle data for sk
    const skCandleData = useGetCandleData(1440, 30, getRootedAddress(), 'bsc')
    const wallet = useWallet();
    const userSubscription = useSubscriptionLevel(wallet);
    const nameServiceMappings = useGetNameServiceMappings(); // just call it and added to redux

    // Add Singleton Services
    window.CurrencyConverter = window.CurrencyConverter ? window.CurrencyConverter : new CurrencyConverter();
    window.TokenPriceCache = window.TokenPriceCache ? window.TokenPriceCache : new TokenPriceCache();

    useEffect(() => {
        async function GetData() {
            let response = await GetBnbPrice();
            if (response !== undefined && response.data !== undefined && response.data !== undefined &&
                response.data.market_data !== undefined) {
                const bnbPrice = response.data.market_data.current_price.usd;
                setBnbPrice(bnbPrice);
            }
        }

        GetData();

        setTimeout(() => GetData(), 60000)
    }, [])

    useEffect(() => {
        if (featuredCoinPriceList !== undefined && bnbPrice !== undefined) {
            async function GetData() {
                let mappedFeaturedCoinList = await featuredCoinsList.map(async x => {
                    let price = featuredCoinPriceList[x.subject.address];
                    if (price === undefined) {
                        // grab from our system
                        let response = await GetQuotePrice(x.subject.address, getWbnbAddress()) //todo choose quote currency address based on network 
                        price = {
                            usd: response.data.ethereum.dexTrades[0].quotePrice * bnbPrice
                        }
                    }
                    x.price = price;
                    return x;
                })

                var result = await Promise.all(mappedFeaturedCoinList);

                setFeaturedCoinsList(result);
            }

            GetData();
        }

    }, [featuredCoinPriceList, bnbPrice])

    useEffect(() => {
        if (skCandleData !== null && skCandleData !== undefined) {
            setCandleData(skCandleData);
        }
    }, [skCandleData])

    useEffect(() => {
        if (nameServiceMappings !== null && nameServiceMappings !== undefined) {
            setCandleData(skCandleData);
        }
    }, [skCandleData])

    useEffect(() => {
        if (userSubscription != undefined && userSubscription !== null) {
            setSubscription(userSubscription);
        }
    }, [userSubscription])

    useEffect(() => {
        if (firebase !== null && firebase !== undefined) {
            setFirebase(firebase)

            loadFirebaseData();
        }
    }, [firebase])

    const loadFirebaseData = () => {
        var tokenAddress = getMbudAddress();
        var mgeAddress = getMGEAddress();
        const dripTokenAddress = getDripTokenAddress();

        // listen for updates
        firebase.firestore.collection("stats").doc(tokenAddress)
            .onSnapshot((doc) => {
                setSidekickTokenStats(doc.data());
            });

        firebase.firestore.collection("stats").doc(mgeAddress)
            .onSnapshot((doc) => {
                setGenerationEventStats(doc.data());
            });

        firebase.firestore.collection("stats").doc(dripTokenAddress)
            .onSnapshot((doc) => {
                setDripStats({ id: 'totalSupply', value: doc.data()?.totalSupply });
            });

        firebase.firestore.collection('PAIRS_BY_TRADE_AMOUNT_BSC').doc(`${moment().utc().format('YYYY-MM-DD')}`)
            .onSnapshot((doc) => {
                setPairsByTradeAmount({id: 'bsc', value: doc.data()})
            })

        firebase.firestore.collection('PAIRS_BY_TRADE_AMOUNT_MATIC').doc(`${moment().utc().format('YYYY-MM-DD')}`)
            .onSnapshot((doc) => {
                setPairsByTradeAmount({id: 'matic', value: doc.data()})
            })

        firebase.firestore.collection('PAIRS_BY_TRADE_AMOUNT_ETHEREUM').doc(`${moment().utc().format('YYYY-MM-DD')}`)
            .onSnapshot((doc) => {
                setPairsByTradeAmount({id: 'ethereum', value: doc.data()})
            })

        firebase.firestore.collection('system-notifications').onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    if (
                        change.doc.data().time >=
                        Date.now() / 1000 - 180
                    ) {
                        console.log('yerrrr');
                        if (wallet.account !== change.doc.data().account) {
                            if (change.doc.data().name) {
                                setSystemNotification(
                                    change.doc.data().name + ' ' + change.doc.data().message
                                );
                            } else {
                                setSystemNotification(
                                    change.doc.data().account + ' ' +
                                    change.doc.data().message
                                );
                            }
                        }
                    }
                }
                if (change.type === 'modified') {
                    if ((change.doc.data().time) >= ((Date.now() / 1000) - 180)) {
                        console.log('yerrrr');
                        if (wallet.account !== change.doc.data().account) {
                            if (change.doc.data().name) {
                                setSystemNotification(change.doc.data().name + ' ' + change.doc.data().message);
                            } else {
                                setSystemNotification(change.doc.data().account + ' ' + change.doc.data().message);
                            }
                        }
                    }
                }
            })
        })



    }

    return <App />;
}

export default AppWrapper