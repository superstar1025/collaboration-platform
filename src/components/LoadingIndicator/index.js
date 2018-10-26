import React from 'react';
import PropTypes from 'prop-types';

export const styles = {
  small: {
    margin: '0 auto',
  },
  default: {
    margin: 'auto',
  },
};

const LoadingIndicator = ({ size }) => (
  <div className="sk-three-bounce" style={styles[size]}>
    <div className="sk-child sk-bounce1" />
    <div className="sk-child sk-bounce2" />
    <div className="sk-child sk-bounce3" />
  </div>
);

LoadingIndicator.propTypes = {
  size: PropTypes.oneOf(['default', 'small']),
};

LoadingIndicator.defaultProps = {
  size: 'default',
};

export default LoadingIndicator;
