import Web3 from 'web3';
import { HttpProviderOptions } from 'web3-core-helpers';
import { AbiItem } from 'web3-utils';
import { ContractOptions } from 'web3-eth-contract';
import getRpcUrl from './getRpcUrl';

const RPC_URL = getRpcUrl();
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
  timeout: 10000
});

/**
 * Provides a web3 instance using wallet provider
 */
const getWeb3 = (wallet) => {
  if (wallet !== null && wallet !== undefined && wallet.ethereum !== null && wallet.status === 'connected') {
    const web3 = new Web3(wallet.ethereum);
    return web3;
  } else {
    const web3 = new Web3(httpProvider);
    return web3;
  }
};
const getContract = async (address, abi, wallet ) => {
  const web3 = getWeb3(wallet);
  const contract = new web3.eth.Contract(abi, address);
  if (wallet.status === 'connected'){
    const customChain = { name: "", networkId: wallet.chainId, chainId: wallet.chainId };
    contract.defaultAccount = wallet.account;
    contract.defaultCommon = customChain;
  } else {
    const customChain = { name: "", networkId: wallet.chainId, chainId: wallet.chainId };
    contract.defaultAccount = '0xe113831F9FB5924c7bb2b2B5602132e0C61BBcbF';
    contract.defaultCommon = customChain;
  }
  
  //TODO Check chain id on functions calling getContract
  return {contract};
};

const format = (wallet, input) => {
  const web3 = getWeb3(wallet);
  return parseFloat(web3.utils.fromWei(input));
}
const formatToWei = (wallet, input) => {
  const web3 = getWeb3(wallet);
  return web3.utils.toWei(input);
}

export { getWeb3, getContract, httpProvider, format, formatToWei };
