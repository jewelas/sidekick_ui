import React, { useState, useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Grid, Card,  Button, InputAdornment, DialogContentText, Dialog, DialogContent, TextField, DialogTitle, DialogActions } from '@material-ui/core';

export default function SubscriptionModal() {
  const [state, setState] = useState(false);
  const { openSubscriptionModal } = useStoreState((state) => state.Dapp);
  const { setOpenSubscriptionModal } = useStoreActions((state) => state.Dapp);
  const handleClose = () => { setOpenSubscriptionModal(false); };

  return (
    <>
      <Dialog classes={{ paper: 'modal-content bg-primary rounded-lg modal-dark' }} open={openSubscriptionModal} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className="text-center">Subscription Dialogue</DialogTitle>
        <DialogContent className="px-4 pt-3 pb-4 text-center">
          <DialogContentText>Access the most robust combination of data and tools in the Defi community by becoming a SideKick Superhero today!
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4">
          <Button href="/Profile?tab=2" className="btn-success shadow-none text-uppercase mr-3">
            Upgrade
          </Button>
          <Button onClick={handleClose} variant="text" className="bg-white-10 text-white shadow-none text-uppercase">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
