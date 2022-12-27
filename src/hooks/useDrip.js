import { useEffect, useState } from 'react';
import * as addressHelper from '../utils/addressHelpers';
import useRefresh from './useRefresh';
import { getWeb3 } from 'utils/web3';
import { getBr34pContract } from 'utils/contractHelpers';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { GetDripPrice } from 'services/ApiService';

//TODO change supportedChainID to matic network
//const supportedChainId = 97;
//TODO Update supported chain logic below
const supportedChainId = addressHelper.supportedChain();

//Get Current Flow User Info
const useDripPrice = () => {
    const { fastRefresh, slowRefresh } = useRefresh();
    const { bnbPrice, dripStats } = useStoreState(state => state.Dapp);
    const { setDripStats } = useStoreActions(actions => actions.Dapp);
    useEffect(() => {
        async function fetchAccount() {

            const response = await GetDripPrice();
            if (response.data !== undefined && response.data !== null && response.data.length > 0) {
                const dripPrice = response.data.pop().value;
                
                if (bnbPrice !== null && bnbPrice !== undefined)
                    setDripStats({ id: 'dripPerBnb', value: dripPrice / bnbPrice })

                setDripStats({ id: 'usdDripPrice', value: dripPrice })
            }
        }

        // if (supportedChainId) {
        fetchAccount();
        // }
    }, [fastRefresh]);

    return dripStats.usdDripPrice;
}

const useBr34pBalance = (wallet) => {
    const { slowRefresh } = useRefresh();
    const [balance, setBalance] = useState();
    const web3 = getWeb3(wallet);
    useEffect(() => {
        async function fetchBalance() {
            const contract = await getBr34pContract(wallet);
            let Balance = await contract.methods.balanceOf(wallet.account).call({ from: wallet.account });
            Balance = web3.utils.fromWei(Balance);
            setBalance(Balance);
        }
        if (supportedChainId && wallet.status === 'connected') {
            fetchBalance();
        }
    }, [slowRefresh]);

    return balance;
}


export {
    useDripPrice,
    useBr34pBalance
};
