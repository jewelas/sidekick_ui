import React, {useEffect} from 'react';
import { useStoreState } from 'easy-peasy';

import SideflowCard from '../../dapp-components/Sideflow/SideflowCard';
import FlowManagementCard from '../../dapp-components/Sideflow/FlowManagementCard'
import PlayerLookupCard from '../../dapp-components/Sideflow/PlayerLookupCard'
import { Grid } from '@material-ui/core';

export default function SideFlow() {
  const { firebase } = useStoreState((state) => state.Dapp);
  useEffect(() => {
    if (firebase !== null && firebase !== undefined) {
      firebase.analytics.logEvent('page_view');
    }
  }, [firebase]);
  return (
    <>
      <span className="">
        <Grid container>
          <Grid container item className="d-flex">
          <Grid item xs={2}>
            
            </Grid>
            <Grid item xs={5}>
            <SideflowCard />
            </Grid>
            <Grid item xs={4}>
              <FlowManagementCard />
              <PlayerLookupCard />
            </Grid>
          </Grid>
        </Grid>
        
        
        
        <div className="body-content">
          {/* TODO Look into putting the mascot back in UI */}
          {/* <div className="content">
            <img src={sidekickGif} alt="SideKick Mascot" className="skMascotStaking" />
          </div> */}
        </div>

      </span>
        
     

      {/* <TransactionsHistory /> */}
    </>
  );
}