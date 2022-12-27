import React, { useState, useEffect } from 'react';
import {
  Input,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { useWallet } from 'use-wallet';
import { updateBeneficiary, updateManager } from 'utils/callHelpers';
import { getDevAddress } from 'utils/addressHelpers';
export default function FlowAccountTab() {
  //const { flowUserInfo } = useStoreState((state) => state.Dapp);
  const [beneficiary, setCurrentBeneficiarey] = useState(null);
  const [inactivityThreshold, setInactivityThreshold] = useState('');
  const [manager, setManager] = useState(null);
  
  const wallet = useWallet();

  /* 

  useEffect(() => {
    if (flowUserInfo !== null && flowUserInfo !== undefined) {
      
    }
  }, [flowUserInfo]) */

  const handleBeneficiaryChange = (e) => {
    setCurrentBeneficiarey(e.target.value);
  };
  const handleInactivityChange = (e) => {
    setInactivityThreshold(e.target.value);
  };
  const handleManagerChange = (e) => {
    setManager(e.target.value);
  };

  const handleUpdateBeneficiary = async() => {
    try {
      const response = await updateBeneficiary(wallet, beneficiary, inactivityThreshold);
    } catch (e) {
      console.log(e);
    }
  };
  const handleResetBeneficiary = async() => {
    try {
  const dev = getDevAddress();
      const response = await updateBeneficiary(wallet, dev, 64281600);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateManager = async() => {
    try {
      const response = await updateManager(wallet, manager);
    } catch (e) {
      console.log(e);
    }

  };
  const handleResetManager = async() => {
    try {
      const dev = getDevAddress();
      const response = await updateManager(wallet, dev);
    } catch (e) {
      console.log(e);
    }

  };

  return (
    <>
      <div className="">
        <Grid container>
          <Grid item xs={9}>
            <span>
              <h6>
                <u>Inactive Account Management</u>
              </h6>
            </span>

            <span>
              <FormControl fullWidth variant="standard" className="mb-2">
                <InputLabel shrink className="skGoldSubtext">
                  Beneficiary (Optional)
                </InputLabel>
                <Input
                  placeholder="Address"
                  value={beneficiary}
                  onChange={handleBeneficiaryChange}
                  label="Address"
                />
              </FormControl>
            </span>

            <span>
              <FormControl fullWidth variant="standard" className="mb-2">
                <InputLabel shrink className="skGoldSubtext">
                  Inactivity Threshold
                </InputLabel>
                <Select
                  value={inactivityThreshold}
                  onChange={handleInactivityChange}
                  label="">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={8035200}>3 Months</MenuItem>
                  <MenuItem value={10713600}>4 Months</MenuItem>
                  <MenuItem value={16070400}>6 months</MenuItem>
                  <MenuItem value={21427200}>8 months</MenuItem>
                  <MenuItem value={32140800}>1 year</MenuItem>
                  <MenuItem value={48211200}>1.5 years</MenuItem>
                  <MenuItem value={64281600}>2 years</MenuItem>
                </Select>
              </FormControl>
            </span>
          </Grid>

          <Grid container className="mb-3">
            <Grid item className="pr-1">
              <Button
                //fullWidth={true}
                size="small"
                //disabled={!isApproved}
                onClick={() => handleUpdateBeneficiary()}
                className="font-weight-bold shadow-black-lg btn-second text-first">
                <span>
                  <span className="btn-wrapper--label">CONFIRM</span>
                </span>
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="small"
                //fullWidth={true}
                //disabled={!isApproved}
                onClick={() => handleResetBeneficiary()}
                className="font-weight-bold shadow-black-lg btn-second text-first">
                <span>
                  <span className="btn-wrapper--label">RESET</span>
                </span>
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={9}>
            <span>
              <h6>
                <u>Account Manager</u>
              </h6>
            </span>

            <span>
              <FormControl fullWidth variant="standard" className="mb-2">
                <InputLabel shrink className="skGoldSubtext">
                  Manager (optional)
                </InputLabel>
                <Input
                  placeholder="Address"
                  value={manager}
                  onChange={handleManagerChange}
                  label="Address"
                />
              </FormControl>
            </span>
          </Grid>

          <Grid container className="mb-3">
            <Grid item className="pr-1">
              <Button
                //fullWidth={true}
                size="small"
                //disabled={!isApproved}
                onClick={() => handleUpdateManager()}
                className="font-weight-bold shadow-black-lg btn-second text-first">
                <span>
                  <span className="btn-wrapper--label">CONFIRM</span>
                </span>
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="small"
                //fullWidth={true}
                //disabled={!isApproved}
                onClick={() => handleResetManager()}
                className="font-weight-bold shadow-black-lg btn-second text-first">
                <span>
                  <span className="btn-wrapper--label">RESET</span>
                </span>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
