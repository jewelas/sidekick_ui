import React, { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';

export default function NameServiceComponent(props) {
  const [user, setUser] = useState(props.address);
  const [userAddress, setUserAddress] = useState(props.address);
  const { nameServiceMappings, selectedNameService } = useStoreState((state) => state.Dapp)
  

  useEffect(() => {
    async function getName() {
      if (userAddress !== null && userAddress !== undefined && userAddress.startsWith('0x') === true) {
        let nameMappingList = nameServiceMappings[selectedNameService];

        if (nameMappingList !== undefined && nameMappingList.length > 0) {
          let foundMapping = nameMappingList.filter(x => x.address.toLowerCase() === userAddress.toLowerCase());

          if (foundMapping !== undefined && foundMapping.length > 0) {
            let name = foundMapping[foundMapping.length - 1].name;
            if (name !== '0x0000000000000000000000000000000000000000' && name !== '') {
              setUser(name);
            } 
          } else {
            setUser(userAddress);
          }
        }
      }
    }

    getName();
  }, [selectedNameService, props.address])

  return (
    <>
        <span>{user}</span>
    </>
  );
}
