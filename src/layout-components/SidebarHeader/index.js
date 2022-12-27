import React from 'react';
import { connect } from 'react-redux';
import {
  setSidebarToggle,
  setSidebarToggleMobile
} from '../../reducers/ThemeOptions';
const SidebarHeader = (props) => {
  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };
  const {
    sidebarToggleMobile,
    setSidebarToggleMobile,

    sidebarToggle,
    setSidebarToggle
  } = props;

  return (
    <>
      <div className="app-sidebar--header">
        {/* <div className="app-sidebar-logo pt-2">
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
              <h2>SIDEKICK</h2>
            </div>
          </NavLink>
        </div> */}
        {/* <Button
          className={clsx(
            'navbar-toggler hamburger hamburger--elastic ',
            { 'is-active': sidebarToggle }
          )}
          onClick={toggleSidebarMobile}
          style={{ position: "absolute", right: "1rem" }}>
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </Button> */}
        {/*<Tooltip title="Expand sidebar" placement="right" arrow>
          <Button
            onClick={toggleSidebar}
            className="expand-sidebar-btn btn btn-sm">
            <FontAwesomeIcon icon={['fas', 'arrows-alt-h']} />
          </Button>
          </Tooltip>*/}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  sidebarToggle: state.ThemeOptions.sidebarToggle,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarToggle: (enable) => dispatch(setSidebarToggle(enable)),
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader);
