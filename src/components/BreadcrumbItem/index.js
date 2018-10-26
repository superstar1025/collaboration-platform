import React from 'react';
import PropTypes from 'prop-types';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';

const BreadcrumbItem = ({ children, to }) => (
  <BreadcrumbsItem to={to} className="breadcrumb-item">{children}</BreadcrumbsItem>
);

BreadcrumbItem.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
};

BreadcrumbItem.defaultProps = {
  children: '--',
};

export default BreadcrumbItem;
