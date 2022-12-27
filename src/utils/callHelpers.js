import * as addressHelper from 'utils/addressHelpers';
import {
  getSideflowContract,
  getRootedContract,
  getMarketGenContract,
  getStakingContract,
  getFlowTokenContract,
  getBuddyContract,
  getNamingContract,
  getERC721Contract,
  getGFIVaultContract,
  getSubscriptionContract
} from 'utils/contractHelpers';
import { getWeb3, format, formatToWei } from 'utils/web3';
import { MaxUint256 } from '@ethersproject/constants';
import { GetNFTData } from 'services/ApiService';

const zeroAddress = '0x0000000000000000000000000000000000000000';
//BSC / MGE CONTRACT CALLS //////////////////////////////////////////
export const contribute = async (amount, referral = null, wallet) => {
  const web3 = getWeb3(wallet);
  if (referral === null || referral.startsWith('0x') === false)
    referral = addressHelper.getDevAddress();
  const contract = await getMarketGenContract(wallet);
  const contribution = web3.utils.toWei(amount);

  let contribute = await contract.contribute(referral, { value: contribution });
  return contribute;
};
export const claim = async (wallet) => {
  const contract = await getMarketGenContract(wallet);
  let claim = await contract.methods.claim().send({ from: wallet.account });
  return claim;
};
export const claimReferralRewards = async (wallet) => {
  const contract = await getMarketGenContract(wallet);
  let claimRefRewards = await contract.methods
    .claimReferralRewards()
    .send({ from: wallet.account });
  return claimRefRewards;
};
export const approveStaking = async (wallet, txMessage) => {
  const contract = await getRootedContract(wallet);
  let stakingAddress = addressHelper.getStakingAddress();
  let approveStaking = await contract.methods
    .approve(stakingAddress, MaxUint256)
    .send({ from: wallet.account })
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);
      let msg = {
        message: `Transaction Complete! Approved SK for staking.`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return approveStaking;
};
export const stakeSideKick = async (amount, wallet, txMessage) => {
  const contract = await getStakingContract(wallet);

  let stakeTokens = await contract.methods
    .stake(amount)
    .send({ from: wallet.account })
    //.once('sending', (payload)=>{LogTx(payload)})
    //.once('sent', (payload)=>{LogTx(payload)})
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);

      let msg = {
        message: `Transaction Complete! Staked SK!`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return stakeTokens;
};
export const unstakeSideKick = async (amount, wallet, txMessage) => {
  const contract = await getStakingContract(wallet);
  let unstakeTokens = await contract.methods
    .unstake(amount)
    .send({ from: wallet.account })
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);
      let msg = {
        message: `Transaction Complete! Unstaked xSK`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return unstakeTokens;
};
////////////////////////////////////////////////////////////

///     FLOW CONTRACT CALLS   ///
export const approveDeposit = async (wallet, txMessage) => {
  const contract = await getFlowTokenContract(wallet);
  const flowAddress = addressHelper.getSideflowAddress();
  const approve = await contract.methods
    .approve(flowAddress, MaxUint256)
    .send({ from: wallet.account });

  return approve;
};
export const deposit = async (referral, amount, wallet) => {
  let contract = await getSideflowContract(wallet);
  //TODO Handle referral logic if no ref passed in, might not handle it here but prolly on front end
  let deposit = await contract.methods
    .deposit(referral, amount)
    .send({ from: wallet.account });
  return deposit;
};

export const flowClaim = async (wallet) => {
  const contract = await getSideflowContract(wallet);

  let claim = await contract.methods.claim().send({ from: wallet.account });
  return claim;
};

export const roll = async (wallet) => {
  const contract = await getSideflowContract(wallet);

  let roll = await contract.methods.roll().send({ from: wallet.account });
  return roll;
};

export const setFlowBuddy = async (wallet, address) => {
  const contract = await getBuddyContract(wallet);
  let buddy = await contract.methods
    .updateBuddy(address)
    .send({ from: wallet.account });
  return buddy;
};

export const playerLookup = async (wallet, address) => {
  const contract = await getSideflowContract(wallet);
  const caller = wallet.account;
  let lookupStats = await contract.methods
    .userInfoTotals(address)
    .call({ from: caller });
  let airDropInfo = await contract.methods
    .userInfo(address)
    .call({ from: caller });
  let netDeposit = await contract.methods
    .creditsAndDebits(address)
    .call({ from: caller });

  lookupStats.total_deposits = format(wallet, lookupStats.total_deposits);
  lookupStats.total_payouts = format(wallet, lookupStats.total_payouts);
  lookupStats.airdrops_received = format(wallet, lookupStats.airdrops_received);
  lookupStats.airdrops_sent = format(wallet, lookupStats.airdrops_total);
  lookupStats.last_airdrop = format(wallet, airDropInfo.last_airdrop);
  lookupStats.net_deposits = await calculateNetDeposit(
    wallet,
    netDeposit._credits,
    netDeposit._debits
  );

  return lookupStats;
};

//Account Management Functions
export const updateBeneficiary = async (wallet, address, timeThreshold) => {
  const contract = await getSideflowContract(wallet);
  const caller = wallet.account;
  await contract.methods
    .updateBeneficiary(address, timeThreshold)
    .send({ from: caller });
};
export const updateManager = async (wallet, address) => {
  const contract = await getSideflowContract(wallet);
  const caller = wallet.account;
  await contract.methods
    .updateManager(address)
    .send({ from: caller });
};

export const calculateNetDeposit = async (wallet, credits, debits) => {
  credits = format(wallet, credits);
  debits = format(wallet, debits);
  return credits - debits;
};

//Name Service Functions
export const approveNameService = async (wallet) => {
  const contract = await getRootedContract(wallet);
  const caller = wallet.account;
  const nameServiceAddress = addressHelper.getNamingAddress();
  const approve = await contract.methods
    .approve(nameServiceAddress, MaxUint256)
    .send({ from: caller });
  return approve;
};
//Set/Update sidekick name
export const updateSideKickName = async (wallet, name, txMessage) => {
  const contract = await getNamingContract(wallet);
  const skAddress = addressHelper.getRootedAddress();
  const caller = wallet.account;
  const updatedName = await contract.methods
    .setNameRecord(name, skAddress)
    .send({ from: caller })
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);
      let msg = {
        message: `Transaction Complete!`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return updatedName;
};

export const updateSideKickNFT = async (wallet, nftAddress, nftId, txMessage) => {
  const contract = await getNamingContract(wallet);
  const caller = wallet.account;
  const updatedNFT = await contract.methods
    .setNFT721(nftAddress, nftId, addressHelper.getRootedAddress())
    .send({ from: caller })
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);
      let msg = {
        message: `Transaction Complete! NFT picture set.`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return updatedNFT;
};

//Find Sidekick Name by ADDRESS
export const findSideKickByAddress = async (wallet, address) => {
  const contract = await getNamingContract(wallet);
  const caller = zeroAddress;
  const sidekickName = await contract.methods
    .getNameByAddress(address)
    .call({ from: caller });
  return sidekickName;
};
//Find an address by looking up a username
export const findAddressByName = async (wallet, name) => {
  const contract = await getNamingContract(wallet);
  const caller = zeroAddress;
  const sidekickName = await contract.methods
    .getAddressByName(name)
    .call({ from: caller });
  return sidekickName;
};

//Check if name is available
export const checkSideKickName = async (wallet, name) => {
  const contract = await getNamingContract(wallet);
  const caller = zeroAddress;
  const sidekickName = await contract.methods
    .checkAvailability(name)
    .call({ from: caller });
  return sidekickName;
};

//Get an erc721 nft contract/avatar by looking up an address
export const getNFTInfo = async (wallet, address) => {
  const contract = await getNamingContract(wallet);
  let caller = '';
  if (wallet.status === 'connected') {
    caller = wallet.account;
  } else {
    caller = zeroAddress;
  }

  //Naming contract, get the nft attached to hero address
  const nameRecord = await contract.methods
    .getNameRecordByAddress(address)
    .call({ from: caller });
  if (
    nameRecord.nftAddress !== zeroAddress &&
    nameRecord !== undefined &&
    nameRecord !== null
  ) {
    //get user token info.. how tho..
    //i need the URI which contains json info, any blockchain info neededd?
    //yes, need the tokenId to call tokenUri function.. how to get that? tokenOfOwnerByIndex!!
    //call getimagefromnft ^^
    const data = await getNFTDataFromURI(wallet, nameRecord, address);
    return data;
  } else {
    return undefined;
  }
};

//Get info on a users nft Image using their Address
export const getNFTDataFromURI = async (wallet, nameRecord, user) => {
  const contract = await getERC721Contract(wallet, nameRecord.nftContract);
  //get user address to check
  const caller = zeroAddress;
  //const user = wallet.account;

  //get the id of nft held
  //todo check if user holds more than one token in contract, give option to choose
  // index below will probably be looped thru
  const index = 0;
  const id = nameRecord.nftId;

  //use id to get the json pointer / nft data link
  let uri = await contract.methods.tokenURI(id).call({ from: caller });
  uri = formatUri(uri);
  console.log(uri);
  //Next need to call get info on uri, extract link for avatar/image
  let data = await GetNFTData(uri);
  data = data.data;
  data.image = formatUri(data.image);
  console.log(data);
  return data;
};
const formatUri = (uri) => {
  const base = 'https://ipfs.infura.io/ipfs/';
  if (uri.includes('ipfs://')) {
    const newUri = uri.slice(7);
    return base + newUri;
  }
  return uri;
};
const formatTxHash = (hash) => {
  const base = 'https://bscscan.com/tx/';
  const url = base + hash;
  return url;
};

/// GANGSTER VAULT CONTRACT FUNCTIONS ////////////////
export const approveGFIVault = async (wallet, txMessage) => {
  const contract = await getStakingContract(wallet);
  let vaultAddress = addressHelper.getGFIVaultAddress();
  let approveStaking = await contract.methods
    .approve(vaultAddress, MaxUint256)
    .send({ from: wallet.account })
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);
      let msg = {
        message: `Transaction Complete! Approved xSK for staking in GFI Vault.`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return approveStaking;
};

export const gfiClaim = async (wallet, txMessage) => {
  const contract = await getGFIVaultContract(wallet);

  let claimTokens = await contract.methods
    .harvest()
    .send({ from: wallet.account })
    //.once('sending', (payload)=>{LogTx(payload)})
    //.once('sent', (payload)=>{LogTx(payload)})
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);

      let msg = {
        message: `Transaction Complete! Claimed xSK!`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return claimTokens;
};

export const gfiCompound = async (wallet, txMessage) => {
  const contract = await getGFIVaultContract(wallet);

  let compound = await contract.methods
    .compound()
    .send({ from: wallet.account })
    //.once('sending', (payload)=>{LogTx(payload)})
    //.once('sent', (payload)=>{LogTx(payload)})
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);

      let msg = {
        message: `Transaction Complete! Compounded xSK!`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return compound;
};

export const gfiDeposit = async (amount, wallet, txMessage) => {
  const contract = await getGFIVaultContract(wallet);
  amount = formatToWei(wallet, amount);
  let deposit = await contract.methods
    .deposit(amount)
    .send({ from: wallet.account })
    //.once('sending', (payload)=>{LogTx(payload)})
    //.once('sent', (payload)=>{LogTx(payload)})
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);

      let msg = {
        message: `Transaction Complete! Deposited xSK!`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return deposit;
};

export const gfiWithdraw = async (amount, wallet, txMessage) => {
  const contract = await getGFIVaultContract(wallet);
  amount = formatToWei(wallet, amount);
  let withdraw = await contract.methods
    .resolve(amount)
    .send({ from: wallet.account })
    //.once('sending', (payload)=>{LogTx(payload)})
    //.once('sent', (payload)=>{LogTx(payload)})
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);

      let msg = {
        message: `Transaction Complete! Withdrew xSK!`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return withdraw;
};

//Subscription Contract Calls
export const approveSubscriptionContract = async (wallet) => {
  const contract = await getRootedContract(wallet);
  const caller = wallet.account;
  const subscriptionAddress = addressHelper.getSubscriptionAddress();
  const approve = await contract.methods
    .approve(subscriptionAddress, MaxUint256)
    .send({ from: caller });
  return approve;
};

export const subscribeToContract = async (planId, wallet, txMessage) => {
  const contract = await getSubscriptionContract(wallet);
  let subscription = await contract.methods
    .subscribe(planId)
    .send({ from: wallet.account })
    //.once('sending', (payload)=>{LogTx(payload)})
    //.once('sent', (payload)=>{LogTx(payload)})
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);

      let msg = {
        message: `Transaction Complete! Subscription updated!`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return subscription;
};

export const paySubscription = async (planId, wallet, txMessage) => {
  const user = wallet.account;
  const contract = await getSubscriptionContract(wallet);
  let payment = await contract.methods
    .pay(user, planId)
    .send({ from: user })
    //.once('sending', (payload)=>{LogTx(payload)})
    //.once('sent', (payload)=>{LogTx(payload)})
    .once('transactionHash', (payload) => {
      let txUrl = formatTxHash(payload);
      let msg = {
        message: `Processing Transaction...`,
        style: 'toastr-primary',
        url: txUrl
      };
      txMessage(msg);
    })
    .once('receipt', (payload) => {
      let txUrl = formatTxHash(payload.transactionHash);

      let msg = {
        message: `Transaction Complete! Subscription updated!`,
        style: 'toastr-success',
        url: txUrl
      };
      txMessage(msg);
    });
  return payment;
};


