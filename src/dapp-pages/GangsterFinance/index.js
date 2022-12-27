import React from 'react';

import EventCard from '../../dapp-components/GFI/EventCard'


export default function GangsterFinanceTeamUp() {
  return (
    <>
      {/* <Grid container className="d-flex">
        <Grid item>
          <EventCard />
        </Grid>
      </Grid> */}
      <div className="d-flex justify-content-center">
        <EventCard />
      </div>

      {/* <TransactionsHistory /> */}
    </>
  );
}