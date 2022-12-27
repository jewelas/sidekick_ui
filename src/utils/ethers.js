import detectProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';

const getContract = (address, abi, wallet) =>
  new Promise(async (resolve, reject) => {
    const request = async (provider) => {
      if (provider) {
        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
        const contract = new Contract(address, abi, signer);
        resolve({ contract });
        return;
      }
      reject('Install Metamask');
    };

    if (window.ethereum) {
      if (window.ethereum.selectedAddress) {
        let provider = await detectProvider();
        //  await provider.request({ method: 'eth_requestAccounts' });
        const chainId = parseInt(provider.chainId);
        if (chainId === 56) {
          await request(provider);
        } else {
        }
      } else {
        let provider = true;
        //await provider.enable().then((val)=>{console.log(val)}, err=>{console.log(err)});
        //await provider.request({ method: 'get_accounts' }).then((val)=>{console.log(val)}, err=>{console.log(err)});

        await request(provider);
      }

      //reject('Install Metamask');
    } else {
      let provider = true;
      //await provider.enable().then((val)=>{console.log(val)}, err=>{console.log(err)});
      //await provider.request({ method: 'get_accounts' }).then((val)=>{console.log(val)}, err=>{console.log(err)});
      await request(provider);
    }
  });

export default getContract;
