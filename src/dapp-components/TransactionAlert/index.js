import React, { useState, useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {
  Button
} from '@material-ui/core';

export default function TransactionAlert() {
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    toastrStyle: '',
    message: 'This is a toastr/snackbar notification!',
    action: <Button color="secondary" size="small" href='https://www.google.com'>poop</Button>
  });
    const { transactionMessage } = useStoreState((state) => state.Dapp);
    const { setTransactionMessage } = useStoreActions((state) => state.Dapp);

    const { vertical, horizontal, open, toastrStyle, message, action } = state;
    
    
  useEffect(() => {
      if (transactionMessage.message === undefined || transactionMessage.message === null) {
        handleClose();
      }
      if (transactionMessage.message !== undefined && transactionMessage.message !== null) {
        handleOpen(transactionMessage.message, transactionMessage.style, transactionMessage.url);
      }
  }, [transactionMessage]);

   
    const handleOpen = (transMessage, style, url) => {
       // const url = (<i href='google.com'>Click here to view tx.</i>)
        const newState = {
          open: true,
          message: transMessage,
          toastrStyle: style,
          //toastrStyle: 'toastr-success',
          vertical: 'bottom',
        horizontal: `right`,
            action: <Button color="primary" size="small" className={`txButton-${style}`} target="_blank" href={url}>View TX.</Button>
        };
      setState(newState);
    };
  const handleClose = () => {
    
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
          message={message}
          action={action}       
              >
                
        </Snackbar>
      </div>
    </>
  );
}
