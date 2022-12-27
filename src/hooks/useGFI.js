import { useEffect, useState } from 'react';
import * as addressHelper from '../utils/addressHelpers';
import useRefresh from './useRefresh';
import { getWeb3, format } from 'utils/web3';
import {
  getGFIVaultContract, getStakingContract
} from 'utils/contractHelpers';

//TODO change supportedChainID to matic network
//const supportedChainId = 97;
//TODO Update supported chain logic below
const supportedChainId = addressHelper.supportedChain();

//Get Current Flow User Info
const useVaultStats = (wallet) => {
  const { fastRefresh } = useRefresh();
  const [vaultStats, setVaultStats] = useState();

  useEffect(() => {
    async function fetchAccount() {
      const dummyCurrentUserAddr = "0x64edCA441aaE7B3dDA4B23f2cd6546c501ab894f";
      // const address = dummyCurrentUserAddr;
      const address = wallet.account;
      const contract = await getGFIVaultContract(wallet);
      let stats = {};
        let currentAccount = await contract.methods.accountOf(address).call({ from: address });
        
        let currentStake = await contract.methods.balanceOf(address).call({ from: address });
        
      const availableClaim = await contract.methods.dividendsOf(address).call({ from: address });

      const dailyEstimate = await contract.methods.dailyEstimate(address).call({ from: address });

      stats.totalDeposit = format(wallet, currentAccount[0]);
      stats.rewards = format(wallet, availableClaim);
      stats.withdrawn = format(wallet, currentAccount[1]);
      stats.compounds = currentAccount[13];
      stats.totalCompounded = format(wallet, currentAccount[3])
      stats.currentStake = format(wallet, currentStake);
      stats.dailyEstimate = format(wallet, dailyEstimate);



      setVaultStats(stats);
    }

    if (supportedChainId && wallet.status === 'connected') {
      fetchAccount();
    }
  }, [fastRefresh]);

  return vaultStats;
};

const useVaultAllowance = (wallet) => {
  const { fastRefresh } = useRefresh();
  const [vaultAllowance, setVaultAllowance] = useState(false);

    useEffect(() => {
        async function fetchAllowance() {
            const address = wallet.account;
            const vaultAddress = addressHelper.getGFIVaultAddress();
            const contract = await getStakingContract(wallet);
            
            let allowance = await contract.methods.allowance(address, vaultAddress).call({ from: address });
           
            allowance = (allowance > 0);
            //return boolean value
            setVaultAllowance(allowance);
            
        }

        if (supportedChainId && wallet.status === 'connected') {
            fetchAllowance();
        }
    }, [fastRefresh]);

    return vaultAllowance;
}


export { useVaultStats, useVaultAllowance };
