import React, { useState, useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Button } from '@material-ui/core';
import { useWallet } from 'use-wallet';
import NameServiceComponent from 'dapp-components/NameReturn';

export default function SystemAlert() {
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    toastrStyle: '',
    message: 'This is a toastr/snackbar notification!',
    action: (
      <Button color="secondary" size="small" href="https://www.google.com">
        poop
      </Button>
    )
  });
  const { transactionMessage, systemNotification } = useStoreState((state) => state.Dapp);
    const { setTransactionMessage, setSystemNotification } = useStoreActions((state) => state.Dapp);
    

  const { vertical, horizontal, open, toastrStyle, message } = state;

  useEffect(() => {
    if (
      systemNotification === undefined ||
      systemNotification === null
    ) {
      handleClose();
    }
    if (
      systemNotification !== undefined &&
      systemNotification !== null
    )
    
    {
        if (transactionMessage.message === null || transactionMessage.message === undefined) {
          handleOpen(systemNotification);  
        }
          
    }
  }, [systemNotification]);


  const handleOpen = (transMessage) => {
    
    const newState = {
      open: true,
      message: transMessage,
      //toastrStyle: style,
      toastrStyle: 'toastr-success',
      vertical: 'bottom',
      horizontal: `right`,
      
    };
    setState(newState);
  };
    const handleClose = () => {
      setSystemNotification(null);
    setState({ ...state, open: false });
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center flex-wrap">
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleClose}
          message={message}></Snackbar>
      </div>
    </>
  );
}
