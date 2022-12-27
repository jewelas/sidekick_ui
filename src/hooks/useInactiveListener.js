import { useStoreActions } from 'easy-peasy';
import { useEffect } from 'react';

const useInactiveListener = (suppress, wallet) => {
  //const { active, error, activate, ethereum } = wallet;
  
  const { setChainId, setCurrentUserAddress, setConnectedWallet } = useStoreActions((state) => state.Dapp);
    //const { chainId } = useStoreState((state) => state.Dapp);

  useEffect(() => {
    if (wallet.account !== null) {
      setCurrentUserAddress(wallet.account);
    }
  }, [wallet.account])

    useEffect(() => {
      async function watchWallet(wallet) {
        const ethereum = wallet.ethereum;

      if (ethereum && !suppress) {
          const handleConnect = () => {
            //setChainId(parseInt(chainId));
          //console.log("Handling 'connect' event");
          // activate()
        };
        const handleChainChanged = async(chainID) => {
         // console.log("Handling 'chainChanged' event with payload", chainID );
            //activate(injected);
            
            await setChainId(parseInt(chainID));
          await wallet.connect();
          setConnectedWallet(wallet);
          
          
        };
        const handleAccountsChanged = async(accounts) => {
          //console.log(`Handling 'accountsChanged' event with payload`,accounts);
          if (accounts.length > 0) {
            //activate(injected)
              //wallet.connect()
            await setCurrentUserAddress(wallet.account)
            setConnectedWallet(wallet);
          }
        };

        const handleNetworkChanged = (networkId) => {
          console.log(
            "Handling 'networkChanged' event with payload",
            networkId
          );
          // activate(injected)
           // wallet.connect();
        };

        ethereum.on('connect', handleConnect);
        ethereum.on('chainChanged', handleChainChanged);
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('networkChanged', handleNetworkChanged);

        return () => {
          if (ethereum.removeListener) {
            ethereum.removeListener('connect', handleConnect);
            ethereum.removeListener('chainChanged', handleChainChanged);
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('networkChanged', handleNetworkChanged);
          }
        };
      }
    }
    if ( wallet !== null && wallet !== undefined && wallet.account !== null && wallet.status === 'connected') 
    {
      watchWallet(wallet);
    }
  }, [wallet, suppress]);
};
export default useInactiveListener;
