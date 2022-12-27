import React, { useState, useEffect } from 'react';

import clsx from 'clsx';
import { useDripBalance } from 'hooks/useTokenFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Card, List, ListItem, TextField, InputAdornment, Divider, IconButton, Button } from '@material-ui/core';
import { useWallet } from 'use-wallet';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { set } from 'date-fns';
import Visibility from '@material-ui/icons/Visibility';
import { faCheckSquare } from '@fortawesome/pro-duotone-svg-icons';
import { setFlowBuddy } from 'utils/callHelpers';
export default function FlowAccountTab() {
  const { flowUserInfo } = useStoreState((state) => state.Dapp);

  const [currentBuddy, setCurrentBuddy] = useState(null);
  const [buddyToSet, setBuddy] = useState('');
  const [dripBalance, setDripBalance] = useState(null);
  const [lastDeposit, setLastDeposit] = useState(null);
  const [timeString, setTimeString] = useState('');
  const [netDeposit, setNetDeposits] = useState(null);
  const [totalAirDrops, setTotalAirdrops] = useState(null);
  const [airdropLastSent, setAirdropLastSent] = useState(null);
  const [toggleBuddyChange, setBuddyToggle] = useState(false);
  const [buddyRowSize, setBuddyRowSize] = useState(5);
  const wallet = useWallet();
  const drip = useDripBalance(wallet);

  useEffect(() => {
    if (drip !== null && drip !== undefined) {
      
      setDripBalance(drip);
    }
  }, [drip]);

  useEffect(() => {
    if (flowUserInfo !== null && flowUserInfo !== undefined) {
      let time = flowUserInfo.deposit_time;
      if (time > 0) {
        const now = Math.floor(Date.now() / 1000);
      time = (now - time) / 60 / 60; //Get how many hours have passed since depositing
          if (time < 1) {
            time = time * 60;
            time = time.toFixed(2);
            setLastDeposit(time);
            setTimeString(` minutes ago`);

            
          } else {
            time = time.toFixed(2);
            setLastDeposit(time);
            setTimeString(` hours ago`)
            
      }
      } else {
        setLastDeposit(0);
        setTimeString(`No Deposit`)
      }
      
      
      setCurrentBuddy(flowUserInfo.buddy);
      if (flowUserInfo.buddy === "0x0000000000000000000000000000000000000000") {
        setBuddyToggle(true);
        setBuddyRowSize(9);
      } else {
        setBuddyToggle(false);
      }
      setNetDeposits(flowUserInfo.netDeposit);
      setTotalAirdrops(flowUserInfo.airdropsTotal);
      setAirdropLastSent(flowUserInfo.airdropLastSent);
    }
  }, [flowUserInfo])

  const handleChange = (e) => {
    setBuddy(e.target.value);
  }

  const handleSetBuddy = async () => {
    try {
      let result = await setFlowBuddy(wallet, buddyToSet);
      setBuddyToggle(false);
      setBuddyRowSize(5)
    } catch (e) {
      console.log(e);
    }
    
  }
  const handleBuddyToggle = async () => {
    setBuddyToggle(true);
    setBuddyRowSize(9);
  }

  return (
    <>
      <div className="">
        <Grid container>
          <Grid item>
            <span>
              <h6>
                <u>Account</u>
              </h6>
            </span>
            <span>
              <p className="truncate">
                {wallet.account ? (
                  <span>{wallet.account}</span>
                ) : (
                  <span>...</span>
                )}
              </p>
            </span>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={buddyRowSize}>
            <span>
              <h6>
                <u>Current Buddy</u>
              </h6>
            </span>
            <span>
              
                
                {currentBuddy !== null && currentBuddy !== '0x0000000000000000000000000000000000000000' && !toggleBuddyChange &&(
                  <p className="truncate">{currentBuddy}</p>
              )}
              
                {currentBuddy === null && 
                <p>...</p>
                }
                {lastDeposit === 0 && toggleBuddyChange &&
                <span ><TextField
                className="mb-2"
                   id="currentBuddy"
       placeholder="Buddy Address"
        fullWidth={true} 
                    value={buddyToSet} 
                    onChange={handleChange} 
                InputProps={{
                  style: { color: 'white' },
                  endAdornment: <InputAdornment position="end">
                    <IconButton color="primary" onClick={handleSetBuddy}>
        <FontAwesomeIcon icon={faCheckSquare} size='1x' className="skIconColor"/>
      </IconButton>
                  </InputAdornment>
                }}></TextField></span>
              }
              
              
              
            </span>
          </Grid>
          {currentBuddy !== null && flowUserInfo.deposits === 0 && (
                  <Grid item className="mt-4"><Button size="small" onClick={()=> handleBuddyToggle()}  className="font-weight-bold shadow-black-lg btn-second text-first"><span className="btn-wrapper--label">Change</span></Button></Grid>
              )}
        </Grid>
        <Grid container>
          <Grid item>
            <span>
              <h6>
                <u>mSK Balance</u>
              </h6>
            </span>
            <span>
              <p>
                {dripBalance !== null ? (
                  <span>{parseFloat(dripBalance).toFixed(3)}</span>
                ) : (
                  <span>...</span>
                )}
              </p>
            </span>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item>
            <span>
              <h6>
                <u>Last Deposit / Roll / Claim</u>
              </h6>
            </span>
            <span>
              <p>
                {lastDeposit !== null && lastDeposit !== 0 && (
                  <span>{lastDeposit + timeString}</span>
                )}
                {lastDeposit === null && (
                  <span>...</span>
                )}
                {lastDeposit === 0 &&
                  <span>{ timeString }</span>
                }
              </p>
            </span>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item>
            <span>
              <h6>
                <u>Net Deposits</u>
              </h6>
            </span>
            <span>
              <p>
                {netDeposit !== null ? (
                  <span>{netDeposit.toFixed(3)}</span>
                ) : (
                  <span>...</span>
                )}
              </p>
            </span>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item>
            <span>
              <h6>
                <u>Total Airdrops Sent / Recieved</u>
              </h6>
            </span>
            <span>
              <p>
                {totalAirDrops !== null ? (
                  <span>{totalAirDrops.toFixed(3)}</span>
                ) : (
                  <span>...</span>
                )}
              </p>
            </span>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item>
            <span>
              <h6>
                <u>Airdrop Last Sent</u>
              </h6>
            </span>
            <span>
              <p>
                {airdropLastSent !== null ? (
                  <span>{airdropLastSent.toFixed(3)}</span>
                ) : (
                  <span>...</span>
                )}
              </p>
            </span>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
