import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';
import Routes from './_routes';

export const Companies = ({ formatMessage }) => (
  <div>
    <BreadcrumbItem to="/companies">
      {formatMessage('Companies')}
    </BreadcrumbItem>
    <Routes url="/companies" />
  </div>
);

Companies.propTypes = {
  formatMessage: PropTypes.func.isRequired,
};

export default injectIntl(Companies);
