import { useEffect, useState } from 'react';
import * as addressHelper from '../utils/addressHelpers';
import useRefresh from './useRefresh';
import { getWeb3, format } from 'utils/web3';
import { getSubscriptionContract, getRootedContract, getStakingContract } from 'utils/contractHelpers';
import { faBorderNone } from '@fortawesome/pro-duotone-svg-icons';


//TODO change supportedChainID to matic network
//const supportedChainId = 97;
//TODO Update supported chain logic below
const supportedChainId = addressHelper.supportedChain();

const useSubscriptionAllowance = (wallet) => {
    const { fastRefresh} = useRefresh();
    const [subscriptionAllowance, setSubscriptionAllowance] = useState(false);
    const web3 = getWeb3(wallet);

    useEffect(() => {
        async function fetchAllowance() {
            const address = wallet.account;
            const subscriptionAddress = addressHelper.getSubscriptionAddress();
            
            const contract = await getRootedContract(wallet);            
            let allowance = await contract.methods.allowance(address, subscriptionAddress).call({ from: address });           
            allowance = (allowance > 0);
            //return boolean value
            setSubscriptionAllowance(allowance);            
        }

        if (supportedChainId && wallet.status === 'connected') {
            fetchAllowance();
        }
    }, [fastRefresh]);

    return subscriptionAllowance;
}

// to do turn into firebase call using backend function that always calls using bsc network
// this makes it so users dont have to be on bsc network for us to know if theyre subscribed
const useSubscriptionLevel = (wallet) => {
    const { fastRefresh } = useRefresh();
    const [subscription, setSubscription] = useState(undefined);

    useEffect(() => {
        async function fetchSubLevel() {
            const user = wallet.account;

            //check subscription contract
            const contract = await getSubscriptionContract(wallet);
            const plans = await contract.methods.nextPlanId().call({ from: user });

            let isSubbed = false;
            let sub = {id:undefined, level: -1, active:false, nextPayment:0, subscriptionType: 'none', stakedSK:'' };
            for (let i = 0; i < plans; i++) {
                isSubbed = await contract.methods.checkSubscription(i, user).call({ from: user });
                
                if (isSubbed === true) {
                    const stats = await contract.methods.subscriptions(user, i).call({ from: user });
                    const plan = await contract.methods.plans(i).call({ from: user });
                    sub.id = i;
                    sub.level = parseInt(plan.level);
                    sub.active = true;
                    sub.subscriptionType = 'subscription'
                    sub.nextPayment = new Date(stats.nextPayment * 1000);
                }
            }
            //check staked sidekick
            if (isSubbed === false) {
                const staking = await getStakingContract(wallet);
                let bal = await staking.methods.balanceOf(user).call({ from: user });
                bal = format(wallet, bal);
                sub.stakedSK = bal;                
                //sub.unstakedSK?                
                if (bal >= 50000) {
                    sub.level = 1;
                    sub.active = true;
                    sub.subscriptionType = 'staking';
                }

                if (bal >= 500000) {
                    sub.level = 2;
                    sub.active = true;
                    sub.subscriptionType = 'staking';
                }
            }
                        
            setSubscription(sub);
        }
        if (supportedChainId && wallet.status === 'connected') {
            fetchSubLevel();
        }
    }, [fastRefresh]);
    return subscription;
}

export { useSubscriptionAllowance, useSubscriptionLevel };

