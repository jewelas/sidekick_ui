import React from 'react';
import ProfileCard from 'dapp-components/Profile/ProfileCard';
import sidekickGif from '../../assets/images/sidekick/animation/Sidekick_transparent_large.gif';
import { useLocation } from 'react-router-dom';

export default function Profile() {
  const query = new URLSearchParams(useLocation().search);
  
  const urlAddress = query.get('tab');
  return (
    <>
        <ProfileCard tab={urlAddress}/>
        <div className="body-content">
          <div className="content">
            <img src={sidekickGif} alt="SideKick Mascot" className="skMascotProfile" />
          </div>
        </div>
        {/* <Grid item xs={5}>
          <NameLookUpCard />
        </Grid> */}   
    </>
  );
}
