import Web3 from 'web3'
import { provider as ProviderType } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import erc20 from 'config/abi/erc20.json'

const getContract = (provider, address) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract((erc20), address)
  return contract
}

// const getAllowance = async (
//   lpContract,
//   masterChefContract,
//   account,
// ): Promise<string> => {
//   try {
//     const allowance: string = await lpContract.methods.allowance(account, masterChefContract.options.address).call()
//     return allowance
//   } catch (e) {
//     return '0'
//   }
// }

const getTokenBalance = async (
  provider,
  tokenAddress,
  userAddress,
) => {
  const contract = getContract(provider, tokenAddress)
  try {
    const balance = await contract.methods.balanceOf(userAddress).call()
    return balance
  } catch (e) {
    return '0'
  }
}

export { getContract, getTokenBalance }
