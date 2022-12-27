import React, { useState } from 'react';

import clsx from 'clsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Card, List, ListItem } from '@material-ui/core';
import FlowAccountTab from './flowAccount';
import FlowTeamTab from './flowTeam';
import QuickStatsTab from './quickStats';

export default function FlowManagementCard() {
  const [activeTab, setActiveTab] = useState('0');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <> 
        
          <Card className="p-3 bg-first text-white ml-2" >
            <List component="div" className="nav-line d-flex nav-tabs-success">
              <ListItem
                button
                disableRipple
                selected={activeTab === '0'}
                onClick={() => {
                  toggle('0');
                }}>
                <span className="font-weight-bold font-size-sm text-uppercase">
                  Account
                </span>
                <div className="divider" />
              </ListItem>
              <ListItem
                button
                disableRipple
                selected={activeTab === '1'}
                onClick={() => {
                  toggle('1');
                }}>
                <span className="font-weight-bold font-size-sm text-uppercase">
                  Team
                </span>
                <div className="divider" />
              </ListItem>
              
            </List>

            <div
              className={clsx('tab-item-wrapper', {
                active: activeTab === '0'
              })}
              index={0}>
              
          <FlowAccountTab/>


            </div>
            <div
              className={clsx('tab-item-wrapper', {
                active: activeTab === '1'
              })}
              index={1}>
              
          <FlowTeamTab />



            </div>
            
          </Card>
        
        
     
    </>
  );
}
