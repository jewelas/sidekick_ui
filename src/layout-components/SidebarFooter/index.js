import React from 'react';

import { Button, Tooltip } from '@material-ui/core';

import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone';
import { NavLink } from 'react-router-dom';

import ChevronRightTwoToneIcon from '@material-ui/icons/ChevronRightTwoTone';
import ListAltTwoToneIcon from '@material-ui/icons/ListAltTwoTone';
import BusinessCenterTwoToneIcon from '@material-ui/icons/BusinessCenterTwoTone';

const SidebarFooter = () => {
  return (
    <>
      <div className="sidebar-navigation skMainMenuFooter">
        <ul>
          <li>
            <a
              href="https://docs.sidekick.finance/sidekick-finance/"
              target="_blank"
              className="nav-link-simple">
              <span className="sidebar-icon">
                <BusinessCenterTwoToneIcon />
              </span>
                SideKick Docs
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                <ChevronRightTwoToneIcon />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SidebarFooter;
