
import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';

import Routes from './_routes';

export const Workflows = ({ formatMessage, match: { params: { projectId } } }) => (
  <div>
    <BreadcrumbItem to={`/projects/${projectId}/workflows`}>
      {formatMessage('Workflows')}
    </BreadcrumbItem>
    <Routes url="/projects/:projectId/workflows" />
  </div>
);

Workflows.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectId: PropTypes.string,
    }),
  }).isRequired,
};

export default injectIntl(Workflows);
