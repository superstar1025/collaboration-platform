import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ButtonLink = ({ to, handleClick, icon, children, className }) => (
  <Link
    to={to}
    className={`btn ${` ${className}`.split(' ').join(' btn-')}`}
    onClick={(e) => {
      if (handleClick) {
        e.preventDefault();
        handleClick(e);
      }
    }}
  >
    {!!icon && <i className={icon} style={{ marginRight: 5 }} />}
    {children}
  </Link>
);

ButtonLink.propTypes = {
  to: PropTypes.string,
  handleClick: PropTypes.func,
  icon: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

ButtonLink.defaultProps = {
  to: '/',
  handleClick: null,
  icon: null,
  className: '',
  children: null,
};

export default ButtonLink;
