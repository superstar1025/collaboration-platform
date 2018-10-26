import React from 'react';
import PropTypes from 'prop-types';
import { Badge as RsBadge } from 'reactstrap';

// badge addon to NavItem
const Badge = ({ className, variant, text }) => (
  <RsBadge className={className} color={variant}>
    {text}
  </RsBadge>
);

Badge.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

Badge.defaultProps = {
  className: '',
};

export default Badge;
