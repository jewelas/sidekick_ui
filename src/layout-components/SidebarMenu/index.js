import React, { useState } from 'react';

import clsx from 'clsx';

import { Collapse } from '@material-ui/core';

import { connect } from 'react-redux';

import { NavLink } from 'react-router-dom';
import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChevronRightTwoToneIcon from '@material-ui/icons/ChevronRightTwoTone';
import VerifiedUserTwoToneIcon from '@material-ui/icons/VerifiedUserTwoTone';
import TrackChangesRoundedIcon from '@material-ui/icons/TrackChangesRounded';
import AccountBalanceTwoToneIcon from '@material-ui/icons/AccountBalanceTwoTone';
import CommentTwoToneIcon from '@material-ui/icons/CommentTwoTone';
import WebTwoToneIcon from '@material-ui/icons/WebTwoTone';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import pancakeLogo from '../../assets/images/stock-logos/pancakeswap-logo.svg';
import dripLogo from '../../assets/images/stock-logos/dropLogo.png';
import gfiLogo from 'assets/images/GFI/gfilogo.png';
import { SidebarWidget } from '../../layout-components';
import StringComponent from '../../dapp-components/StringComponent/index';
import Strings from '../../config/localization/translations';

const SidebarMenu = (props) => {
  const { setSidebarToggleMobile } = props;
  const [teamupsOpen, setTeamupsOpen] = useState(false)

  const toggleSidebarMobile = () => setSidebarToggleMobile(false);
  const toggleDashboard = (event) => {
    setTeamupsOpen(!teamupsOpen);
    event.preventDefault();
  };

  const [pagesOpen, setPagesOpen] = useState(false);  
  const barStrings = Strings.Sidebar;
  return (
    <>
      <PerfectScrollbar>
        <div className="sidebar-navigation">
          <SidebarWidget />
          <div className="sidebar-header">
            <span><StringComponent string={barStrings.string11} /></span>
          </div>
          <ul>
            <li>
              <NavLink
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                className="nav-link-simple"
                to="/Headquarters">
                <span className="sidebar-icon">
                  <WebTwoToneIcon />
                </span>
                <StringComponent string={barStrings.string4} /> <div className="badge badge-second ml-2 badge-inner live"><StringComponent string={barStrings.string8} /></div>
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/DefiWatcher">
                <span className="sidebar-icon">
                  <TrackChangesRoundedIcon />
                </span>
                <StringComponent string={barStrings.string3} />             
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </NavLink>
            </li>
            <li>
              <a
                href="#/"
                onClick={toggleDashboard}
                className={clsx({ active: teamupsOpen })}>
                <span className="sidebar-icon">
                  <VerifiedUserTwoToneIcon />
                </span>
                <span className="sidebar-item-label"><StringComponent string={barStrings.string6} /></span>
                <span className="sidebar-icon-indicator">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
              <Collapse in={teamupsOpen}>
                <ul >
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/GFI">
                      <span className="sidebar-icon">
                        <img
                          alt="GFI Logo"
                          src={gfiLogo}
                        />
                      </span>
                        <span><StringComponent string={barStrings.string14} /></span>
                      <div className="badge badge-warning ml-2 badge-inner"><span className="ml-1">NEW 🔥</span></div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/DripWatcher">
                      <span className="sidebar-icon">
                        <img
                          alt="Drip Logo"
                          src={dripLogo}
                        />
                      </span>
                      <StringComponent string={barStrings.string7} />
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/DashboardCommerce">
                      Commerce
                    </NavLink>
                  </li> */}
                </ul>
              </Collapse>
            </li>
            <div className="sidebar-header">
              <span><StringComponent string={barStrings.string12} /></span>
            </div>
            {/* <li>
              <NavLink
                onClick={toggleSidebarMobile}
                
                className="nav-link-simple"
                to="/MGE">
                <span className="sidebar-icon">
                  <EvStationRoundedIcon />
                </span>
                Market Generation
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </NavLink>
            </li> */}
            <li>
              <NavLink
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/Staking">
                <span className="sidebar-icon">
                  <AccountBalanceTwoToneIcon />
                </span>
                <StringComponent string={barStrings.string2} />
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </NavLink>
            </li>
            <li>
              <a
                href='https://pancakeswap.finance/swap?outputCurrency=0x5755E18D86c8a6d7a6E25296782cb84661E6c106'
                target='_blank'
                className="nav-link-simple"
              >
                <span className="sidebar-icon grayscale">
                  <img
                    alt="Pancakeswap Logo"
                    src={pancakeLogo}
                  />
                </span>
                <StringComponent string={barStrings.string1} />
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
            </li>
            <div className="sidebar-header">
              <span><StringComponent string={barStrings.string13} /></span>
            </div>
            <li>
              <NavLink
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/Profile/?tab=1">
                <span className="sidebar-icon">
                  <AccountCircleTwoToneIcon />
                </span>
                <StringComponent string={barStrings.string10} />
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/Feedback">
                <span className="sidebar-icon">
                  <CommentTwoToneIcon />
                </span>
                <StringComponent string={barStrings.string5} />
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </PerfectScrollbar>
    </>
  );
};

const mapStateToProps = (state) => ({
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarMenu);
