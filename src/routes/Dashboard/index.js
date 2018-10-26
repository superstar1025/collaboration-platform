import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';

export const Dashboard = ({ formatMessage }) => (
  <div>
    <BreadcrumbItem to="/dashboard">{formatMessage('Dashboard')}</BreadcrumbItem>
    <h1>{formatMessage('Dashboard')}</h1>
    <Link to="/projects">
      {formatMessage('Projects')}
    </Link>
  </div>
);

Dashboard.propTypes = {
  formatMessage: PropTypes.func.isRequired,
};

export default injectIntl(Dashboard);
