import React, {useEffect} from 'react';
import { useStoreState } from 'easy-peasy';
import { PageTitle } from '../../layout-components';

import StakingCard from '../../dapp-components/Staking/StakingCard'
import { Container } from '@material-ui/core';
import { ConnectionRejectedError, useWallet, UseWalletProvider } from 'use-wallet';

import sideKickGif from '../../assets/images/sidekick/animation/Sidekick_transparent_large.gif';

export default function Transactions() {
  const { firebase } = useStoreState((state) => state.Dapp);
  useEffect(() => {
    if (firebase !== null && firebase !== undefined) {
      firebase.analytics.logEvent('page_view');
    }
  }, [firebase]);

  return (
    <>
      <Container className="genContent">
        <StakingCard/>
        <div className="body-content">
          <div className="content">
            <img src={sideKickGif} alt="SideKick Mascot" className="skMascotStaking" />
          </div>
        </div>
      </Container>

      {/* <TransactionsHistory /> */}
    </>
  );
}