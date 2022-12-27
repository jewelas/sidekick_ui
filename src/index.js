import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import WalletProvider from './providers/wallet'
import {
  ChainUnsupportedError,
  ConnectionRejectedError,

  ConnectorUnsupportedError,
  useWallet,
  UseWalletProvider
} from 'use-wallet';
import { RefreshContextProvider } from 'contexts/RefreshContext';

import configureStore from './config/configureStore';
import { Provider } from 'react-redux';
import { StoreProvider, createStore } from 'easy-peasy';
import Stores from './reducers/_stores';

import Firebase, { FirebaseContext } from './dapp-components/Firebase';
import AppWrapper from './AppWrapper';
import { supportedChain } from './utils/addressHelpers';
import getRpcUrl from './utils/getRpcUrl';
const chainId = process.env.REACT_APP_CHAIN_ID;
const store = configureStore();
const ezStore = createStore(Stores);
//const chainId = supportedChain();

const rpc = 'https://bsc-dataseed.binance.org/';
const rpcTestnet = 'https://data-seed-prebsc-1-s1.binance.org:8545';
ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <StoreProvider store={ezStore}>
      <Provider store={store}>
        <RefreshContextProvider>
          <WalletProvider>
            <FirebaseContext.Consumer>
              {(firebase) => <AppWrapper firebase={firebase} />}
            </FirebaseContext.Consumer>
          </WalletProvider>
        </RefreshContextProvider>
      </Provider>
    </StoreProvider>
  </FirebaseContext.Provider>,
  document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
