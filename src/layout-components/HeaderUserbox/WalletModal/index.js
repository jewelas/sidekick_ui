import React, { useState, useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useWallet } from 'use-wallet';

import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent
} from '@material-ui/core';
import { MoonLoader } from 'react-spinners';
import metamaskIcon from '../../../assets/images/metamask.png';
import walletConnectIcon from '../../../assets/images/walletConnectIcon.png';
import useInactiveListener from 'hooks/useInactiveListener';
import StringComponent from '../../../dapp-components/StringComponent/index';
import Strings from '../../../config/localization/translations';
const WalletModal = () => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [loadingInjected, setLoadingInjected] = useState(false);
  const [loadingWC, setLoadingWC] = useState(false);
  const wallet = useWallet();
  const listener = useInactiveListener(false, wallet);
  const { firebase } = useStoreState((state) => state.Dapp);
  const {  setConnectedWallet } = useStoreActions((actions) => actions.Dapp);
  
  
  const connect = async () => {
    let unmounted = false;   

    setLoadingInjected(true);
    
    try {
      console.log("Injecting");
      const response = await wallet.connect('injected');
      setConnectedWallet(wallet);      
      setLoadingInjected(false);
      firebase.analytics.logEvent('login', { method: 'Metamask/Injected' });  
    } catch (e) {
      
      console.log(e);
      setLoadingInjected(false);
    }

    return () => { unmounted = true; }
  };

  const trustConnect = async () => {
    try {
      setLoadingWC(true);
      const response = await wallet.connect('walletconnect');
      setLoadingWC(false);
      setConnectedWallet(wallet);
      firebase.analytics.logEvent('login', { method: 'WalletConnect' });  
    } catch (e) {
      console.log(e);
      setLoadingWC(false);
    }
  };
  
  const modalStrings = Strings.HeaderUserBox.Modal;
  return (
    <>
      <Button
        onClick={toggleModal}
        className="m-2 btn-gradient shadow-none bg-sidekick-dark text-primary font-weight-bold text-uppercase">
        {/* <span className="btn-wrapper--icon">
          <FontAwesomeIcon icon={['fas', 'plus']} />
        </span> */}
        <span className="btn-wrapper--label"><StringComponent string={modalStrings.string1}/></span>
      </Button>

      <Dialog
        open={modal}
        scroll="body"
        maxWidth="sm"
        fullWidth={true}
        onClose={toggleModal}
        classes={{ paper: 'border-0 bg-first text-white' }} >
        <DialogTitle>
          {' '}
          {
            <div>
              <div className="modalHeader font-weight-bold text-center mt-2">
                <StringComponent string={modalStrings.string2}/>
              </div>
            </div>
          }
        </DialogTitle>
        <DialogContent>
          <div className="px-4 pb-3 text-center">
            <div className="px-3 pt-1 pb-3">
              <Button
                fullWidth
                onClick={() => connect()}
                className="btn-outline-dark text-left rounded shadow-none py-3 px-1 px-xl-3">              
                <div className="pr-3 ">
                  <MoonLoader
                    color={'var(--green)'}
                    loading={loadingInjected}
                    size={25}        
                  />              
                </div>
                <div className="d-30 p-d-flex">
                  <img src={metamaskIcon} alt="..." className="img-fit-width" />
                </div>
                <div className="d-flex">
                  <div>
                    <div className="font-size-lg font-weight-bold ml-3">
                      {window.ethereum == null && 'Install '}
                      <StringComponent string={modalStrings.string3}/>
                    </div>
                  </div>
                </div>
              </Button>
            </div>
            <div className="p-3">
              <Button
                fullWidth
                onClick={() => trustConnect()}
                className="btn-outline-dark text-left rounded shadow-none py-3 px-1 px-xl-3 pl-0">
                  <div className="pr-3">
                    <MoonLoader
                      color={'var(--green)'}
                      loading={loadingWC}
                      size={25}
                      className="pr-4"
                    />
                </div>  
                <div className="d-30">
                  <img
                    src={walletConnectIcon}
                    alt="..."
                    className="img-fit-width mr-1"
                  />
                </div>
                <div className="d-flex ">
                  <div>
                    <div className="font-size-lg font-weight-bold ml-2">
                    <StringComponent string={modalStrings.string4}/>
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>

        <div className="d-flex justify-content-center mb-4">
          <Button onClick={toggleModal} variant="outlined" className="font-weight-bold shadow-black-lg btn-second text-first">
          <StringComponent string={modalStrings.string5}/>
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default WalletModal;
