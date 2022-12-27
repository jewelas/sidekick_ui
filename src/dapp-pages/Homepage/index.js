import { useStoreState } from 'easy-peasy';
import React, {useEffect, useRef} from 'react';

import Homepage1 from '../../dapp-components/Homepage/Homepage1';
import Homepage2 from '../../dapp-components/Homepage/Homepage2';
import Homepage3 from '../../dapp-components/Homepage/Homepage3';
import Homepage4 from '../../dapp-components/Homepage/Homepage4';
import Homepage5 from '../../dapp-components/Homepage/Homepage5';
import Homepage6 from '../../dapp-components/Homepage/Homepage6';
import Homepage7 from '../../dapp-components/Homepage/Homepage7';

export default function Marketplace() {
  const scrollDivH2 = useRef();
  const scrollDivH3 = useRef();
  const { sidekickTokenStats, mgeStats } = useStoreState(state => state.Dapp);
  const { firebase } = useStoreState((state) => state.Dapp);
  useEffect(() => {
    if (firebase !== null && firebase !== undefined) {
      firebase.analytics.logEvent('page_view');
    }
  }, [firebase]);
  return (
    <>
      <div className="bg-white">
        <Homepage1 scrollDivH2={scrollDivH2} scrollDivH3={scrollDivH3} tokenStats={sidekickTokenStats} /> {/*Header*/}
        <div ref={scrollDivH3}/>
        <Homepage3 /> {/*Tokenomics*/}
        <Homepage4 /> {/*Core Values*/}
        <Homepage5 mgeStats={mgeStats} /> {/*Liquidity Event?*/}
        <div ref={scrollDivH2}/>
        <Homepage7 /> {/*Pricing*/} 
        <Homepage2 /> {/*Roadmap*/} 
        <Homepage6 scrollDivH2={scrollDivH2} scrollDivH3={scrollDivH3} /> {/*Footer*/}
      </div>
    </>
  );
}
