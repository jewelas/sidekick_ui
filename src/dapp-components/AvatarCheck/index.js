import React, { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';
import {  getNFTInfo } from 'utils/callHelpers';
import { useWallet } from 'use-wallet';

export default function AvatarCheck(props) {
  const wallet = useWallet();
  const [user, setUser] = useState(props.address);
  const [nftImage, setNFTImage] = useState(null);
  const { nameServiceMappings, selectedNameService } = useStoreState((state) => state.Dapp)  

  const { size } = props;

  const getNFTAvatar = async () => {
    if (
      user &&
      user.startsWith('0x') === true &&
      user !== '0x0000000000000000000000000000000000000000'
    ) {
      //find if user has registered sidekick name, if not return address
      let nameMappingList = nameServiceMappings[selectedNameService];

      if (nameMappingList !== undefined && nameMappingList.length > 0) {
        let foundMapping = nameMappingList.filter(x => x.address.toLowerCase() === user.toLowerCase());
        if (foundMapping !== undefined && foundMapping.length > 0) {
          const nft = await getNFTInfo(wallet, user);
          if (
            nft !== '0x0000000000000000000000000000000000000000' &&
            nft !== '' &&
            nft !== undefined
          ) {
            //Use nft address to get the image URL -- logic will be in call helper function
            setNFTImage(nft.image);
            return nft;
          } else {
            return undefined;
          }
        }
      }      
    }
  };
  getNFTAvatar();
  return (
    <>
      <span className={`avatar-icon-${size}`}>
        {nftImage !== null ? (
          <div className="avatar-icon">
            <img alt="..." className="img-fluid" src={nftImage} />
          </div>
        ) : (
          <span></span>
        )}
      </span>
    </>
  );
}
