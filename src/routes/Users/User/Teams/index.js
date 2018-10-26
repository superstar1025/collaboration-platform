
import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';

export const Teams = ({ formatMessage, match: { params: { userId } } }) => (
  <div>
    <BreadcrumbItem to={`/users/${userId}/teams`}>
      {formatMessage('Teams')}
    </BreadcrumbItem>
    <HeaderTitle>{formatMessage('All Teams')}</HeaderTitle>
  </div>
);

Teams.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }).isRequired,
};

export default injectIntl(Teams);
