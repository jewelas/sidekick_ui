import React from 'react';
import { useWallet } from 'use-wallet';




export default function LivePreviewExample() {
    const wallet = useWallet();


  return (
    <>
      {wallet.status === 'connected' && wallet.chainId === 97 && 
      <div className="badge badge-pill badge-warning" >BSC Testnet</div>
      }
      {wallet.status === 'connected' && wallet.chainId === 56 && 
      <div className="badge badge-pill badge-warning" >BSC</div>
          }
          {wallet.status === 'connected' && wallet.chainId === 80001 && 
      <div className="badge badge-pill badge-matic"  >Matic Testnet</div>
          }
          {wallet.status === 'connected' && wallet.chainId === 137 && 
      <div className="badge badge-pill badge-matic"  >Matic</div>
      }
    </>
  );
}
