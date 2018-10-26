import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';

import Routes from './_routes';

export const Users = ({ formatMessage }) => (
  <div>
    <BreadcrumbItem to="/users">{formatMessage('Users')}</BreadcrumbItem>
    <Routes url="/users" />
  </div>
);

Users.propTypes = {
  formatMessage: PropTypes.func.isRequired,
};

export default injectIntl(Users);
