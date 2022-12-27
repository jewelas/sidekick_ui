import React from 'react';
import {
  Card
} from '@material-ui/core';
import GFICardBody from '../GFICardBody';
import { useWallet } from 'use-wallet';

export default function XSKStaking() {
  //TODO ADD STRINGS TO TRANSLATIONS
  
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="p-4 p-lg-4 bg-first text-white w-70">
          <div>
            <div className="display-4 line-height-1 font-weight-bold mr-3 d-flex justify-content-center text-center">
             GFI xSK Staking
            </div>            
          </div>
          <div></div>
         
          <GFICardBody />
        </Card>
      </div>
    </>
  );
}
