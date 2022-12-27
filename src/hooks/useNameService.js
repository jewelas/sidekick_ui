import { useEffect, useState } from 'react';
import * as addressHelper from '../utils/addressHelpers';
import useRefresh from './useRefresh';
import { getWeb3, format } from 'utils/web3';
import { getRootedContract } from 'utils/contractHelpers';


//TODO change supportedChainID to matic network
//const supportedChainId = 97;
//TODO Update supported chain logic below
const supportedChainId = addressHelper.supportedChain();

const useNameServiceAllowance = (wallet) => {
    const { fastRefresh} = useRefresh();
    const [namingAllowance, setNamingAllowance] = useState(false);
    const web3 = getWeb3(wallet);

    useEffect(() => {
        async function fetchAllowance() {
            const address = wallet.account;
            const namingAddress = addressHelper.getNamingAddress();
            
            const contract = await getRootedContract(wallet);
            
            let allowance = await contract.methods.allowance(address, namingAddress).call({ from: address });
           
            allowance = (allowance > 0);
            //return boolean value
            setNamingAllowance(allowance);
            
        }

        if (supportedChainId && wallet.status === 'connected') {
            fetchAllowance();
        }
    }, [fastRefresh]);

    return namingAllowance;
}
export {useNameServiceAllowance};