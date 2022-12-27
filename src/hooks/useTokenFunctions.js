import mbudABI from '../config/abi/MoonBuddy.json';
import erc20ABI from '../config/abi/erc20.json';
import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { getContract } from 'utils/web3';
import * as addressHelper from '../utils/addressHelpers';
import useRefresh from './useRefresh';
import { getWeb3 } from 'utils/web3';
import { getRootedContract, getStakingContract, getFlowTokenContract } from 'utils/contractHelpers';

//TODO Update supported chain logic below
const supportedChainId = addressHelper.supportedChain();

const useTotalSupply = (address, wallet) => {
  const { slowRefresh, fastRefresh } = useRefresh();
  const [totalSupply, setTotalSupply] = useState();
  const web3 = getWeb3(wallet);
  useEffect(() => {
    async function fetchTotalSupply() {
      let abi = erc20ABI;
      try {
        let { contract } = await getContract(address, abi, wallet);
        const supply = await contract.methods.totalSupply().call({ from: contract.defaultAccount });
        const decimals = await contract.methods.decimals().call({ from: contract.defaultAccount });
        let formattedSupply = 0;
        if (decimals === 18) {
          formattedSupply = web3.utils.fromWei(supply);
        } else {
          formattedSupply = parseFloat(supply) / parseFloat('1e' + decimals);
        }

        setTotalSupply(formattedSupply);
      } catch (e) {
        console.log(e);
      }

    }

    if (supportedChainId && address !== undefined) {
      fetchTotalSupply();
    }
  }, [fastRefresh, address, supportedChainId]);

  return totalSupply;
};

//Gets Balance of XSK in wallet, NOT REWARDS
const useXSKBalance = (wallet) => {
  const { fastRefresh } = useRefresh();
  const [balance, setBalance] = useState();
  const web3 = getWeb3(wallet);

  useEffect(() => {
    async function fetchBalance() {
      let address = wallet.account;
      const contract = await getStakingContract(wallet);
      let Balance = await contract.methods.balanceOf(address).call({ from: address });
      Balance = web3.utils.fromWei(Balance);
      setBalance(Balance);
    }
    if (supportedChainId && wallet.status === 'connected') {
      fetchBalance();
    }
  }, [fastRefresh]);

  return balance;
};

//GET BALANCE IF USER UNSTAKES 100%
const usePriceOfXSkToSk = (totalXSkSupply, wallet) => {
  const { fastRefresh, slowRefresh } = useRefresh();
  const [balance, setBalance] = useState();
  const web3 = getWeb3(wallet);

  useEffect(() => {
    async function fetchBalance() {
      if (totalXSkSupply !== undefined) {
        const contract = await getRootedContract(wallet);
        let Balance = await contract.methods.balanceOf(addressHelper.getStakingAddress()).call({ from: contract.defaultAccount });
        const totalSkInStakingContract = web3.utils.fromWei(Balance);
        const total = 2 - (parseFloat(totalXSkSupply) / parseFloat(totalSkInStakingContract));
        Balance = total;
        setBalance(Balance);
      }
    }
    if (supportedChainId && wallet.status === 'connected') {
      fetchBalance();
    }
  }, [fastRefresh, totalXSkSupply, wallet]);

  return balance;
};

const useStakingAllowance = (wallet) => {
  const { fastRefresh } = useRefresh();
  const [approved, setApproved] = useState(false);
  const web3 = getWeb3(wallet);

  useEffect(() => {
    async function fetchBalance() {
      let stakingAddress = addressHelper.getStakingAddress();
      let address = wallet.account;

      const contract = await getRootedContract(wallet);

      let allowance = await contract.methods.allowance(address, stakingAddress).call({ from: address });

      allowance = web3.utils.fromWei(allowance);
      if (allowance > 0) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    }
    if (supportedChainId && wallet.status === 'connected') {
      fetchBalance();
    }
  }, [fastRefresh]);

  return approved;
};

const useSKBalance = (wallet) => {
  const { fastRefresh } = useRefresh();
  const [balance, setBalance] = useState();
  const web3 = getWeb3(wallet);

  useEffect(() => {
    async function fetchBalance() {
      const contract = await getRootedContract(wallet);
      let Balance = await contract.methods.balanceOf(wallet.account).call({ from: wallet.account });
      Balance = web3.utils.fromWei(Balance);
      setBalance(Balance);
    }
    if (supportedChainId && wallet.status === 'connected') {
      fetchBalance();
    }
  }, [fastRefresh]);

  return balance;
};
const useDripBalance = (wallet) => {
  const { fastRefresh } = useRefresh();
  const [balance, setBalance] = useState();
  const web3 = getWeb3(wallet);

  useEffect(() => {
    async function fetchBalance() {
      const contract = await getFlowTokenContract(wallet);
      let Balance = await contract.methods.balanceOf(wallet.account).call({ from: wallet.account });
      Balance = web3.utils.fromWei(Balance);
      setBalance(Balance);
    }
    if (supportedChainId && wallet.status === 'connected') {
      fetchBalance();
    }
  }, [fastRefresh]);

  return balance;
};

const useBnbBalance = (wallet) => {
  const { fastRefresh } = useRefresh();
  const [balance, setBalance] = useState();

  useEffect(() => {
    const web3 = getWeb3(wallet);
    async function fetchBalance() {
      if (window.ethereum) {
        if (window.ethereum.selectedAddress) {
          let Balance = await web3.eth.getBalance(
            window.ethereum.selectedAddress
          );
          Balance = web3.utils.fromWei(Balance);

          setBalance(parseFloat(Balance).toFixed(3));
        }
      }
    }
    if (supportedChainId && wallet.status === 'connected') {
      fetchBalance();
    }


  }, [fastRefresh]);
  return balance;
};

/* const useTokenBalance = (tokenAddress, account, abi, wallet) => {
  const [balance, setBalance] = useState(new BigNumber(0));
  //const { account, ethereum } = useWallet()
  const { fastRefresh } = useRefresh();
  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(provider, tokenAddress, account);
      setBalance(new BigNumber(res));
    };

    if (account && provider) {
      fetchBalance();
    }
  }, [account, provider, tokenAddress, fastRefresh]);

  return balance;
}; */

const useBurnedBalance = (tokenAddress) => {
  const [balance, setBalance] = useState(new BigNumber(0));
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalance = async () => {
      let abi = mbudABI;
      let mbudContractAddress = addressHelper.getMbudAddress();
      let lazBurnPit = addressHelper.getBurnAddress();

      const contract = await getContract(abi, mbudContractAddress);
      const bal = await contract.balanceOf(lazBurnPit);
      setBalance(new BigNumber(bal));
    };

    fetchBalance();
  }, [tokenAddress, slowRefresh]);

  return balance;
};

export {
  useTotalSupply,
  //useTokenBalance,
  useBurnedBalance,
  useBnbBalance,
  useSKBalance,
  useXSKBalance,
  useStakingAllowance,
  usePriceOfXSkToSk,
  useDripBalance
};
