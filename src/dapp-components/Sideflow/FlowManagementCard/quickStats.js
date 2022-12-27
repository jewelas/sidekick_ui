import React, { useState } from 'react';

import clsx from 'clsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Card, List, ListItem } from '@material-ui/core';

export default function QuickStatsTab() {
  

  return (
    <> 
        
        <div className="text-center my-5">
                <div className="d-inline-flex justify-content-center p-0 rounded-circle avatar-icon-wrapper bg-neutral-warning shadow-warning-sm text-warning mb-2 d-90">
                  <FontAwesomeIcon
                    icon={['far', 'user']}
                    className="d-flex align-self-center font-size-xxl"
                  />
                </div>
                <h6 className="font-weight-bold font-size-xxl mb-1 mt-3 text-warning">
                  Tabbed Section
                </h6>
                <p className="text-black-50 font-size-lg mb-0">
                  You have pending actions to take care of.
                </p>
              </div>
            
    </>
  );
}
