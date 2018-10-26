
import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';

export const Projects = ({ formatMessage, match: { params: { userId } } }) => (
  <div>
    <BreadcrumbItem to={`/users/${userId}/projects`}>
      {formatMessage('Projects')}
    </BreadcrumbItem>
    <HeaderTitle>{formatMessage('All Projects')}</HeaderTitle>
  </div>
);

Projects.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }).isRequired,
};

export default injectIntl(Projects);
