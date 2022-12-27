import React from 'react';

import PropTypes from 'prop-types';

const PresentationLayout = (props) => {
  const { children } = props;

  return <>{children}</>;
};

PresentationLayout.propTypes = {
  children: PropTypes.node
};

export default PresentationLayout;
