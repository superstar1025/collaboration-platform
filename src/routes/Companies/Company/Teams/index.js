
import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';

import Routes from './_routes';

export const Teams = ({
  formatMessage,
  match: { params: { companyId } },
}) => (
  <div>
    <BreadcrumbItem to={`/companies/${companyId}/teams`}>
      {formatMessage('Teams')}
    </BreadcrumbItem>
    <Routes url="/companies/:companyId/teams" />
  </div>
);

Teams.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      companyId: PropTypes.string,
    }),
  }).isRequired,
};

export default injectIntl(Teams);
