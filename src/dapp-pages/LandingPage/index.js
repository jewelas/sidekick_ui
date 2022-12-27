import React, { useRef, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';

import sidekickGif from '../../assets/images/sidekick/animation/Sidekick_transparent_large.gif';
import miniLogo from '../../assets/images/sidekick/logo/PNG Large/Logo_horizontal_color for green BG@3x.png';

export default function Marketplace() {
  const { firebase } = useStoreState((state) => state.Dapp);
  useEffect(() => {
    if (firebase !== null && firebase !== undefined) {
      firebase.analytics.logEvent('page_view');
    }
  }, [firebase]);
  return (
      <div className="body-content">
        <div className="content">
          <img src={sidekickGif} alt="SideKick Mascot" className="skMascot" />
          <img src={miniLogo} alt="SideKick" className="skLogoType" />           
        </div>
      </div>    
  );
}
