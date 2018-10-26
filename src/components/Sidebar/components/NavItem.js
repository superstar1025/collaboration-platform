import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { NavItem as RsNavItem } from 'reactstrap';
import { noop } from 'lodash';

import Badge from './Badge';

// nav item with nav link
const NavItem = ({ className, handleClick, variant, url, icon, name, badge }) => {
  const linkClassName = classNames('nav-link', variant ? `nav-link-${variant}` : '');
  return (
    <RsNavItem className={className}>
      <NavLink
        to={url}
        className={linkClassName}
        activeClassName="active"
        isActive={params => (!!params && params.isExact)}
        onClick={(e) => {
          if (handleClick !== noop) {
            e.preventDefault();
            handleClick(e);
          }
        }}
      >
        <i className={icon} />
        {name}
        {!!badge && <Badge {...badge} />}
      </NavLink>
    </RsNavItem>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string,
  url: PropTypes.string,
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
  badge: PropTypes.shape({
    className: PropTypes.string,
    variant: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
};

NavItem.defaultProps = {
  className: '',
  variant: '',
  badge: null,
  url: '/',
  handleClick: noop,
};

export default NavItem;
