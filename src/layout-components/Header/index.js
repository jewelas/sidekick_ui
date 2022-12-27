import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';

import clsx from 'clsx';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import projectLogoCircle from '../../assets/images/sidekick/logo/PNG Medium/Logo_mark_green.png';
import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';
import { ConnectionRejectedError, useWallet, UseWalletProvider } from 'use-wallet';
import HeaderUserbox from '../../layout-components/HeaderUserbox';
import HeaderSearch from '../../layout-components/HeaderSearch';
import HeaderWidget from '../../layout-components/HeaderWidget';

const Header = (props) => {
  const {
    headerShadow,
    headerBgTransparent,
    sidebarToggleMobile,
    setSidebarToggleMobile
  } = props;
  const { web3 } = useWallet();


  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
    console.log("toggleSideBarMobile");
  };

  return (
    <>
      <div
        className={clsx('app-header skHeaderShadow', {
          'app-header--shadow': headerShadow,
          // 'app-header--opacity-bg': headerBgTransparent
        })}>
        <div className="app-header--pane">
          <Button
            className={clsx(
              'navbar-toggler hamburger hamburger--elastic', /*Here is how to reveal the menu icon*/
              { 'is-active': sidebarToggleMobile }
            )}
            onClick={toggleSidebarMobile}>
            <span className="hamburger-box">
              <span className="hamburger-inner bg-white" />
            </span>
          </Button>          
        </div>
        {/* <div className="app-sidebar-logo pt-2"> */}
        <div className="app-header-logo">
          <NavLink
            to="/"
            title="SideKick Finance"
            className="app-sidebar-logo d-flex">
            <div className="app-sidebar-logo--icon">
              <img
                alt="SideKick Finance"
                src={projectLogoCircle}
              />
            </div>
            <div className="app-sidebar-logo--text text-white">
              <h3>SIDEKICK</h3>
            </div>
          </NavLink>
        </div>

        <div className="app-header--pane">
          <HeaderUserbox />
        </div>

      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  headerShadow: state.ThemeOptions.headerShadow,
  headerBgTransparent: state.ThemeOptions.headerBgTransparent,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
