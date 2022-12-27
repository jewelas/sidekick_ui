//import getContract from '../utils/ethers';
import {getContract} from 'utils/web3'
// Addresses
import * as addressHelper from 'utils/addressHelpers'

// BSC ABI
import rootedABI from '../config/abi/RootedToken.json';
import stakingABI from '../config/abi/StakingToken.json';
import mgeABI from '../config/abi/MarketGeneration.json';
import mgdABI from '../config/abi/MarketDistribution';
import dripFountainABI from 'config/abi/DripFountain.json';
import dripFaucetABI from 'config/abi/DripFaucet.json';
import br34pABI from 'config/abi/Br34pToken.json';
import nameSystemABI from 'config/abi/SideKickNames.json';
import dripABI from 'config/abi/DripToken.json';
import ERC721ABI from 'config/abi/ERC721.json';
import subscriptionABI from 'config/abi/Payment.json';

//FLOW / POLY ABI
import sideFlowABI from 'config/abi/Faucet.json';
import flowTokenABI from 'config/abi/FlowToken.json';
import buddyABI from 'config/abi/BuddySystem.json';
import gfiVaultABI from 'config/abi/GFIVault.json';

//BSC Contracts
export const getRootedContract = async (wallet) => {
  const {contract} = await getContract(addressHelper.getRootedAddress(), rootedABI, wallet);
  return contract;
}

export const getStakingContract = async (wallet) => {
  const {contract} = await getContract(addressHelper.getStakingAddress(),stakingABI, wallet);
  return contract;
}
export const getMarketGenContract = async (wallet) => {
  const { contract } = await getContract(addressHelper.getMGEAddress(), mgeABI, wallet);
  return contract;
}

export const getMarketDistContract = async (wallet) => {
const { contract } = await getContract(addressHelper.getMGDAddress(), mgdABI, wallet);
return contract;
}
export const getFountainContract = async (wallet) => {
  const {contract} = await getContract(addressHelper.getDripFountainAddress(),dripFountainABI, wallet);
  return contract;
}

export const getFaucetContract = async (wallet) => {
  const {contract} = await getContract(addressHelper.getDripFaucetAddress(),dripFaucetABI, wallet);
  return contract;
}
export const getBr34pContract = async (wallet) => {
  const {contract} = await getContract(addressHelper.getBr34pTokenAddress(),br34pABI, wallet);
  return contract;
}
//SideKick Naming System Contract
export const getNamingContract = async (wallet) => {
  const { contract } = await getContract(addressHelper.getNamingAddress(), nameSystemABI, wallet);
  return contract;
}
export const getERC721Contract = async (wallet, address) => {
  const {contract} = await getContract(address, ERC721ABI, wallet);
  return contract;
}

//Sidekick Subscription Contract
export const getSubscriptionContract = async (wallet) => {
  const {contract} = await getContract(addressHelper.getSubscriptionAddress(), subscriptionABI, wallet);
  return contract;
}


//MATIC / POLY / FLOW Contracts

export const getSideflowContract = async (wallet) => {
  const { contract } = await getContract(addressHelper.getSideflowAddress(), sideFlowABI, wallet);
  return contract;
}

export const getFlowTokenContract = async (wallet) => {
  const { contract } = await getContract(addressHelper.getFlowTokenAddress(), flowTokenABI, wallet);
  return contract;
}

export const getBuddyContract = async (wallet) => {
  const { contract } = await getContract(addressHelper.getBuddySystemAddress(), buddyABI, wallet);
  return contract;
}

//GFI Vault(s)
export const getGFIVaultContract = async (wallet) => {
  const { contract } = await getContract(addressHelper.getGFIVaultAddress(), gfiVaultABI, wallet);
  return contract;
}

export const getDripContract = async (wallet) => {
  const { contract } = await getContract(addressHelper.getDripTokenAddress(), dripABI, wallet);
  return contract;
}