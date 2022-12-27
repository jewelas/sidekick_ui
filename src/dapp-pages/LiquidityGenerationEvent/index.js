import React from 'react';
import EventCard from '../../dapp-components/LiquidityGeneration/EventCard'
import { Container } from '@material-ui/core';

import sidekickGif from '../../assets/images/sidekick/animation/Sidekick_transparent_large.gif';

export default function Transactions() {
  return (
    <>
      <Container className="genContent">
        <EventCard/>
        <div className="body-content">
          <div className="content">
            <img src={sidekickGif} alt="SideKick Mascot" className="skMascotGen" />
          </div>
        </div>
      </Container>

      {/* <TransactionsHistory /> */}
    </>
  );
}