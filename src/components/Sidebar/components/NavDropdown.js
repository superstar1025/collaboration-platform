import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// nav dropdown
const NavDropdown = ({ open, handleClick, name, icon, children }) => (
  <li className={classNames('nav-item nav-dropdown', open ? 'open' : '')}>
    <a className="nav-link nav-dropdown-toggle" href="#" onClick={handleClick}>
      <i className={icon} />{name}
    </a>
    <ul className="nav-dropdown-items">
      {children}
    </ul>
  </li>
);

NavDropdown.propTypes = {
  open: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

NavDropdown.defaultProps = {
  open: false,
};

export default NavDropdown;
