import addresses from '../config/contracts';
import moreAddresses from '../config/blockchain_address';
import networkChains from '../config/network';
import { chain } from 'underscore';

//TODO Change the way this chainId is set?
const chainId = process.env.REACT_APP_CHAIN_ID;
//BSC CONTRACTS
const getMbudAddress = () => {
  return addresses.RootedToken[chainId];
};
const getRootedAddress = () => {
  return addresses.RootedToken[chainId];
};
const getMGEAddress = () => {
  return addresses.MarketGeneration[chainId];
};
const getMGDAddress = () => {
  return addresses.MarketDistribution[chainId];
};
const getBurnAddress = () => {
  return addresses.LazarusBurnPit[chainId];
};
const getStakingAddress = () => {
  return addresses.StakingToken[chainId];
};
const getPancakeRouterAddress = () => {
  return addresses.PancakeRouter[chainId];
};
const getPancakeFactoryAddress = () => {
  return addresses.PancakeFactory[chainId];
};
const getDripTokenAddress = () => {
  return addresses.DripToken[chainId];
};
const getDripFountainAddress = () => {
  return addresses.DripFountain[chainId];
};
const getDripFaucetAddress = () => {
  return addresses.DripFaucet[chainId];
};
const getBr34pTokenAddress = () => {
  return addresses.Br34pToken[chainId];
};
const getMulticallAddress = () => {
  return addresses.mulltiCall[chainId];
};
const getWbnbAddress = () => {
  return addresses.wbnb[chainId];
};
const getBusdAddress = () => {
  return addresses.busd[chainId];
};
const getUsdtAddress = () => {
  return addresses.usdt[chainId];
};
const getMaticAddress = () => {
  return addresses.matic[chainId];
};
const getEthereumAddress = () => {
  return addresses.ethereum[chainId];
};
const getSideflowAddress = () => {
  return addresses.Faucet[chainId];
};
const getNamingAddress = () => {
  return addresses.NameSystem[chainId];
};
const getFlowTokenAddress = () => {
  return addresses.FlowToken[chainId];
};
const getBuddySystemAddress = () => {
  return addresses.BuddySystem[chainId];
};
const getGfiTokenAddress = () => {
  return addresses.GfiToken[chainId];
};
const getGFIVaultAddress = () => {
  return addresses.GFIVault[56];
};
const getSubscriptionAddress = () => {
  return addresses.Subscription[chainId];
};
const getDevAddress = () => {
  return moreAddresses.Developers.Hitsu;
};
const supportedChain = (networkId) => {
  return networkId === networkChains.networkId;
};

export {
  getSideflowAddress,
  getFlowTokenAddress,
  getBuddySystemAddress,
  getMbudAddress,
  getPancakeRouterAddress,
  getPancakeFactoryAddress,
  getRootedAddress,
  getMGEAddress,
  getDevAddress,
  getMGDAddress,
  getWbnbAddress,
  getBusdAddress,
  getUsdtAddress,
  getMaticAddress,
  getEthereumAddress,
  supportedChain,
  getStakingAddress,
  getBurnAddress,
  getDripTokenAddress,
  getDripFountainAddress,
  getDripFaucetAddress,
  getBr34pTokenAddress,
  getNamingAddress,
  getGfiTokenAddress,
  getGFIVaultAddress,
  getSubscriptionAddress
};
