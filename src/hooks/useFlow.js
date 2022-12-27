import { useEffect, useState } from 'react';
import * as addressHelper from '../utils/addressHelpers';
import useRefresh from './useRefresh';
import { getWeb3, format } from 'utils/web3';
import { GetFlowTeam } from 'services/FirebaseService';
import { getFlowTokenContract, getSideflowContract, getBuddyContract } from 'utils/contractHelpers';

//TODO change supportedChainID to matic network
//const supportedChainId = 97;
//TODO Update supported chain logic below
const supportedChainId = addressHelper.supportedChain();

//Get Current Flow User Info
const useFlowAccount = (wallet) => {
    const { fastRefresh} = useRefresh();
    const [flowAccount, setFlowAccount] = useState();
    const web3 = getWeb3(wallet);

    useEffect(() => {
        async function fetchAccount() {
            const address = wallet.account;
            const contract = await getSideflowContract(wallet);
            const buddyContract = await getBuddyContract(wallet);
          
            let account = await contract.methods.users(address).call({ from: address });
            const availableClaim = await contract.methods.claimsAvailable(address).call({ from: address });
            const maxPayout = await contract.methods.maxPayoutOf(account.deposits).call({ from: address });
            let netDeposit = await contract.methods.creditsAndDebits(address).call({ from: address });
            let airDropInfo = await contract.methods.userInfo(address).call({ from: address });
            let airdrops = await contract.methods.userInfoTotals(address).call({ from: address });
            let buddy = await buddyContract.methods.buddyOf(address).call({ from: address });
            
            netDeposit = await calculateNetDeposit(wallet, netDeposit._credits, netDeposit._debits);
            
            account.deposits = format(wallet, account.deposits);
            account.direct_bonus = format(wallet, account.direct_bonus);
            //account.last_airdrop = format(wallet, account.last_airdrop);
            account.match_bonus = format(wallet, account.match_bonus);
            account.payouts = format(wallet, account.payouts);
            account.availableClaim = format(wallet, availableClaim);
            account.maxPayout = format(wallet, maxPayout);
            account.airdropsTotal = format(wallet, airdrops.airdrops_total);
            account.airdropsRecieved = format(wallet, airdrops.airdrops_received);
            account.airDropsSent = account.airdropsTotal - account.airdropsRecieved;
            account.airdropLastSent = format(wallet, airDropInfo.last_airdrop);
            account.netDeposit = netDeposit;
            account.buddy = buddy;
            setFlowAccount(account);
        }

        if (supportedChainId && wallet.status === 'connected') {
            fetchAccount();
        }
    }, [fastRefresh]);

    return flowAccount;
}
const calculateNetDeposit = async (wallet, credits, debits) => {
    credits = format(wallet, credits);
    debits = format(wallet, debits);
    return credits - debits;
}

const useFlowAllowance = (wallet) => {
    const { fastRefresh} = useRefresh();
    const [flowAllowance, setFlowAllowance] = useState(false);
    const web3 = getWeb3(wallet);

    useEffect(() => {
        async function fetchAllowance() {
            const address = wallet.account;
            const flowAddress = addressHelper.getSideflowAddress();
            const contract = await getFlowTokenContract(wallet);
            
            let allowance = await contract.methods.allowance(address, flowAddress).call({ from: address });
           
            allowance = (allowance > 0);
            //return boolean value
            setFlowAllowance(allowance);
            
        }

        if (supportedChainId && wallet.status === 'connected') {
            fetchAllowance();
        }
    }, [fastRefresh]);

    return flowAllowance;
}

const useFlowTeam = (wallet, previousTeam) => {
    const { fastRefresh } = useRefresh();
    const [flowTeam, setFlowTeam] = useState({});
    
    useEffect(() => {
        
      async function fetchTeam() {
        const currentTeam = await GetFlowTeam(wallet.account.toLowerCase());
        
        setFlowTeam(currentTeam);
      }

      if (
        wallet !== null &&
        wallet !== undefined &&
        wallet.account !== null &&
        wallet.account !== undefined &&
        supportedChainId &&
        wallet.status === 'connected'
      ) {
        if (previousTeam.data) {
          if (previousTeam.data.value === wallet.account.toLowerCase()) {
            return previousTeam;
          }
        } else {
          fetchTeam();
        }
      }
    }, [wallet.status === 'connected']);
    return flowTeam;
  
}

export {
    useFlowAccount,
    useFlowAllowance, useFlowTeam
};

