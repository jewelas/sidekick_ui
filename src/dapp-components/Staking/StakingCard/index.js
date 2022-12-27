import React, { useState, useEffect } from 'react';
import { useBnbBalance } from 'hooks/useTokenFunctions';
import {
  Card,
  Badge
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import StakingForm from '../StakingForm';
import { useWallet } from 'use-wallet';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';

export default function LivePreviewExample() {
  const [bnbBalance, setBnbBalance] = useState(null);
  const wallet = useWallet();

  const bnb = useBnbBalance(wallet);  

  useEffect(() => {
    setBnbBalance(bnb);  
  }, [ bnbBalance, bnb ]);
  
  const StyledBadgeActive = withStyles({
    badge: {
      backgroundColor: 'var(--success)',
      color: 'var(--success)',
      boxShadow: '0 0 0 3px #fff',
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '3px solid currentColor',
        content: '""'
      }
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1
      },
      '100%': {
        transform: 'scale(3)',
        opacity: 0
      }
    }
  })(Badge);

  /*   const StyledBadgeInactive = withStyles({
    badge: {
      backgroundColor: 'var(--danger)',
      color: 'var(--danger)',
      boxShadow: '0 0 0 3px #fff',
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '3px solid currentColor',
        content: '""'
      }
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1
      },
      '100%': {
        transform: 'scale(3)',
        opacity: 0
      }
    }
  })(Badge);
 */
  
  return (
    <>
      <div className="d-flex justify-content-center skEventZ">
        <Card className="py-4 px-6 bg-first text-white w-50">
          <div className="display-4 line-height-1 font-weight-bold mr-3 d-flex justify-content-center text-center">
            <StringComponent string={Strings.StakingStrings.stakingString}/>
          </div>            
          {/*<Grid container className="justify-content-center">
            <Grid item className="skEventStatsContainer"></Grid>
          </Grid>*/}
          <div className="my-2 eventMainDivider" />
          <StakingForm />
        </Card>
      </div>
    </>
  );
}
