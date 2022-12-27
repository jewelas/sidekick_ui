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
import { playerLookup } from 'utils/callHelpers';
export default function FlowAccountTab() {
  const { flowUserInfo } = useStoreState((state) => state.Dapp);

  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [lastDeposit, setLastDeposit] = useState(null);
  const [netDeposit, setNetDeposits] = useState(null);
  const [totalAirDrops, setTotalAirdrops] = useState(null);
  const [airdropLastSent, setAirdropLastSent] = useState(null);
  
  
  const wallet = useWallet();
 

 

  useEffect(() => {
    if (flowUserInfo !== null && flowUserInfo !== undefined) {
      setNetDeposits(flowUserInfo.netDeposit);
      setTotalAirdrops(flowUserInfo.airdropsTotal);
      setAirdropLastSent(flowUserInfo.airdropLastSent);
    }
  }, [flowUserInfo])

  const handleChange = (e) => {
    setCurrentPlayer(e.target.value);
  }

  const handlePlayerLookup = async () => {
    try {
      const player = await playerLookup(wallet, currentPlayer); 
      setPlayerStats(player);
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <>
      <div className="">
        <Grid container>
          <Grid item xs={9}>
            <span>
              <h6>
                <u>Player</u>
              </h6>
            </span>
            <span>
            <span ><TextField
                className="mb-2"
                   
       placeholder="Address"
        fullWidth={true} 
                    value={currentPlayer} 
                    onChange={handleChange} 
                InputProps={{
                  style: { color: 'white' },
                  endAdornment: <InputAdornment position="end">
                    <IconButton color="primary"  onClick={handlePlayerLookup} >
        <FontAwesomeIcon icon={faCheckSquare} size='1x' className="skIconColor"/>
      </IconButton>
                  </InputAdornment>
                }}></TextField></span>
            </span>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item>
            <span>
              <h6>
                <u>Directs</u>
              </h6>
            </span>
            <span>
              <p className="truncate">
                {playerStats !== null ? (
                  <span>{playerStats.referrals}</span>
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
                <u>Total Sidekicks</u>
              </h6>
            </span>
            <span>
              <p className="truncate">
                {playerStats ? (
                  <span>{playerStats.total_structure}</span>
                ) : (
                  <span>...</span>
                )}
              </p>
            </span>
          </Grid>
        </Grid>
        
       {/* 
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
        </Grid> */}
        <Grid container>
          <Grid item>
            <span>
              <h6>
                <u>Net Deposits</u>
              </h6>
            </span>
            <span>
              <p>
                {playerStats !== null ? (
                  <span>{playerStats.net_deposits.toFixed(3)}</span>
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
                {playerStats !== null ? (
                  <span>{playerStats.airdrops_sent.toFixed(3)} / {playerStats.airdrops_received.toFixed(3) }</span>
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
                {playerStats !== null ? (
                  <span>{playerStats.last_airdrop.toFixed(3)}</span>
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
