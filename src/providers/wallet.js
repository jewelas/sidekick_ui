import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useContext, useMemo, useState } from 'react'
import { ChainUnsupportedError,
    ConnectionRejectedError,
  
    ConnectorUnsupportedError,
    useWallet,
    UseWalletProvider } from 'use-wallet'



export default function WalletProvider({ children }) {
    const { chainId } = useStoreState((state) => state.Dapp);
  const { setChainId } = useStoreActions((state) => state.Dapp);
   //Check chain ID before connecting to wallet, if its not equal to state or (whats already in wallet object) pass it to state for proper connection
   //this implementation probably will not work with trust wallet...
    if (window.ethereum) {
    if (parseInt(window.ethereum.chainId) !== chainId) {
      console.log("Detected new network, setting chain ID")
      //setChainId(parseInt(window.ethereum.chainId));
      //const response = await wallet.connect('injected');
    }
  }

const rpc = 'https://bsc-dataseed.binance.org/'; //default rpc use state to update
const rpcTestnet = 'https://data-seed-prebsc-1-s1.binance.org:8545';
  return (
    <UseWalletProvider
      chainId={chainId}
      connectors={{
        walletconnect: {
          rpcUrl: rpc,
          handleActivationError(err) {
            if (err instanceof ConnectionRejectedError) {
            return new ConnectionRejectedError();
            }
          },
          handleChainUnsupportedError(err){
            if (err instanceof ChainUnsupportedError) {
              console.log(err);
              return new ChainUnsupportedError();
            }
          },
          handleConnectorUnsupportedError(err) {
            if (err instanceof ConnectorUnsupportedError) {
              return new ConnectorUnsupportedError();
            }
          },
          
          },
          injected: {
            handleActivationError(err) {
                if (err instanceof ConnectionRejectedError) {
                return new ConnectionRejectedError();
                }
              },
              handleChainUnsupportedError(err){
                  if (err instanceof ChainUnsupportedError) {
                      const log = new ChainUnsupportedError();
                      console.log(log);
                  return log;
                }
              },
              handleConnectorUnsupportedError(err) {
                if (err instanceof ConnectorUnsupportedError) {
                  return new ConnectorUnsupportedError();
                }
              },
          },
        
      }}
    >
    {children}
    </UseWalletProvider>
  )
}

//export { useWalletAugmented as useWallet, WalletProvider }