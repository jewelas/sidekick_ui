import React from 'react';
import {
  Card
} from '@material-ui/core';

import FlowCardBody from '../FlowCardBody';
import { useWallet } from 'use-wallet';

export default function LivePreviewExample() {
  //TODO ADD STRINGS TO TRANSLATIONS
  
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="p-4 p-lg-4 bg-first text-white w-70">
          <div>
            <div className="display-4 line-height-1 font-weight-bold mr-3 d-flex justify-content-center text-center">
             Sideflow
            </div>            
          </div>
          <div></div>
         
          <FlowCardBody />
        </Card>
      </div>
    </>
  );
}
