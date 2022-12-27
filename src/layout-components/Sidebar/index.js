import React from 'react';
import clsx from 'clsx';

import { connect } from 'react-redux';

import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';
import { setSidebarToggle } from '../../reducers/ThemeOptions';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarFooter
} from '../../layout-components';

const Sidebar = (props) => {
  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };

  const toggleSidebar = () => {
    setSidebarToggle(!setSidebarToggle);
  };

  const {
    sidebarStyle,
    sidebarShadow,
    sidebarFooter,
    sidebarToggle,
    sidebarToggleMobile,
    setSidebarToggle,
    setSidebarToggleMobile
  } = props;
  return (
    <>
      <div
        className={clsx('app-sidebar', sidebarStyle, {
          'app-sidebar--shadow': sidebarShadow
        })} style={{minHeight: "20rem"}}>
        {/* <SidebarHeader /> */}
        <div className="app-sidebar--content">
          <SidebarMenu />
        </div>
        {sidebarFooter && <SidebarFooter />}
      </div>
      <div
        onClick={toggleSidebar}
        className={clsx('app-sidebar-overlay', {
          'is-active': sidebarToggle
        })}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  sidebarShadow: state.ThemeOptions.sidebarShadow,
  sidebarFooter: state.ThemeOptions.sidebarFooter,
  sidebarStyle: state.ThemeOptions.sidebarStyle,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
