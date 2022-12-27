import React from 'react';

import PropTypes from 'prop-types';

const MinimalLayout = (props) => {
  const { children } = props;

  return <>{children}</>;
};

MinimalLayout.propTypes = {
  children: PropTypes.node
};

export default MinimalLayout;
