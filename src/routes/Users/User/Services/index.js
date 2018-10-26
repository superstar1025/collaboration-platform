
import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';

import Routes from './_routes';

export const Services = ({ formatMessage, match: { params: { userId } } }) => (
  <div>
    <BreadcrumbItem to={`/users/${userId}/authorizations`}>
      {formatMessage('Connected Accounts')}
    </BreadcrumbItem>
    <Routes url="/users/:userId/authorizations" />
  </div>
);

Services.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }).isRequired,
};

export default injectIntl(Services);
