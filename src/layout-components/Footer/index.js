import React from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { List, ListItem } from '@material-ui/core';

import { connect } from 'react-redux';

const Footer = (props) => {
  const { footerShadow, footerBgTransparent } = props;

  return (
    <>
    </>
  );
};

const mapStateToProps = (state) => ({
  footerFixed: state.ThemeOptions.footerFixed,
  footerShadow: state.ThemeOptions.footerShadow,
  footerBgTransparent: state.ThemeOptions.footerBgTransparent
});

export default connect(mapStateToProps)(Footer);
