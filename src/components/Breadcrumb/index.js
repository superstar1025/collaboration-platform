import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Breadcrumbs } from 'react-breadcrumbs-dynamic';

import { getSelector } from 'redux/selectors';

export const Breadcrumb = ({ breadcrumbMenu }) => (
  <div className="breadcrumb">
    <Breadcrumbs
      item={NavLink}
      finalItem="b"
    />
    <div className="breadcrumb-menu">
      {breadcrumbMenu}
    </div>
  </div>
);

Breadcrumb.propTypes = {
  breadcrumbMenu: PropTypes.node,
};

Breadcrumb.defaultProps = {
  breadcrumbMenu: null,
};

/* istanbul ignore next */
const mapStateToProps = state => ({
  breadcrumbMenu: getSelector('ui', 'breadcrumbMenu')(state),
});

export default connect(mapStateToProps)(Breadcrumb);
