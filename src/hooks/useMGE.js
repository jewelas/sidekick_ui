import { useEffect, useState } from 'react'
import useRefresh from './useRefresh'
import { getWeb3 } from 'utils/web3';
import { getMarketDistContract, getMarketGenContract } from 'utils/contractHelpers';

const useMgeActive = (wallet) => {
  const { fastRefresh } = useRefresh()
  const [active, setActive] = useState()

  useEffect(() => {
    async function fetchActive() {
      
      let { contract } = await getMarketGenContract(wallet);
      let contractActive = await contract.isActive();

      setActive(contractActive);
    }
    if (wallet.chainId === 56 && wallet.status === 'connected') {
      fetchActive();
    }
  }, [fastRefresh, wallet])

  return active;
}

const useMgeStats = (wallet) => {
  const { fastRefresh} = useRefresh()
  const [contractStats, setContractStats] = useState()
  const web3 = getWeb3(wallet);
  let stats = {};
  useEffect(() => {
    async function fetchStats() {

      let address = wallet.account;
      let { contract } = await getMarketGenContract(wallet);
      stats.totalContribution = await contract.totalContribution();
      stats.userContribution = await contract.contribution(address);

      stats.totalContribution = web3.utils.fromWei(stats.totalContribution._hex);
      stats.userContribution = web3.utils.fromWei(stats.userContribution._hex);

      setContractStats(stats);

    }
    if (wallet.chainId === 56 && wallet.status === 'connected') {
      fetchStats();
    }

  }, [fastRefresh, stats, wallet, web3.utils])

  return contractStats;
}

const useMgdStats = (wallet) => {
  const { fastRefresh } = useRefresh()
  const [contractStats, setContractStats] = useState()
  const web3 = getWeb3(wallet);
  let stats = {};
  useEffect(() => {
    async function fetchStats() {

      let address = wallet.account;
      let { contract } = await getMarketDistContract(wallet);
      stats.totalClaim = await contract.getTotalClaim(address);
      stats.referralRewards = await contract.getReferralClaim(address);

      stats.totalClaim = web3.utils.fromWei(stats.totalClaim._hex);
      stats.referralRewards = web3.utils.fromWei(stats.referralRewards._hex);

      setContractStats(stats);

    }
    if (wallet.chainId === 56 && wallet.status === 'connected') {
      fetchStats();
    }
  }, [fastRefresh, stats, wallet, web3.utils])

  return contractStats;
}

/* const useTotalHolders = (tokenAddress) => {
  const [holders, setHolders] = useState(new BigNumber(0))
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      let abi = mbudABI;
      let mbudContractAddress = addressHelper.getMbudAddress();

      const contract = await getContract(abi, mbudContractAddress)
      const bal = await contract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call()
      setHolders(new BigNumber(bal))
    }

    fetchBalance()
  }, [tokenAddress, fastRefresh])

  return holders
} */

export { useMgeActive, useMgeStats, useMgdStats };