import BigNumber from 'bignumber.js'

const getBalanceNumber = (balance, decimals) => {
  const displayBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

const getFullDisplayBalance = (balance, decimals ) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed()
}

const getDisplayBalance = (balance) => {
  return parseFloat(balance.toFixed()).toLocaleString('en')
}

const getDisplayUsd= (balance) => {
  return parseFloat(balance.toFixed(4))
}

const convertNumberToShortString = ( number ) => {
  let newValue = number.toString();
  if (number >= 1000000) {
    const ranges = [
      { divider: 1, suffix: '' },
      { divider: 1e3, suffix: ' K' },
      { divider: 1e6, suffix: ' Mil' },
      { divider: 1e9, suffix: ' Bil' },
      { divider: 1e12, suffix: ' Tril' },
      { divider: 1e15, suffix: 'Quad' },
      { divider: 1e18, suffix: 'Quin' }
    ];
    //find index based on number of zeros
    const index = Math.floor(Math.abs(number).toString().length / 3);
    let numString;
    (number / ranges[index].divider) % 1 > 0 ? numString = (number / ranges[index].divider).toFixed(2) : 
    numString = (number / ranges[index].divider).toFixed();    
    numString =
      parseInt(numString.substring(numString.indexOf('.') + 1)) === 0
        ? Math.floor(number / ranges[index].divider).toString()
        : numString;
    newValue = numString + ranges[index].suffix;
  }
  return newValue;
}

export { getBalanceNumber, getFullDisplayBalance, getDisplayBalance, getDisplayUsd, convertNumberToShortString }
