import BigNumber from 'bignumber.js'

export { default as formatAddress } from './formatAddress'

export default const bnToDec = (bn, decimals) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}
