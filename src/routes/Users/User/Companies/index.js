import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';

export const Companies = ({ formatMessage, match: { params: { userId } } }) => (
  <div>
    <BreadcrumbItem to={`/users/${userId}/companies`}>
      {formatMessage('Companies')}
    </BreadcrumbItem>
    <HeaderTitle>{formatMessage('All Companies')}</HeaderTitle>
  </div>
);

Companies.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }).isRequired,
};

export default injectIntl(Companies);
