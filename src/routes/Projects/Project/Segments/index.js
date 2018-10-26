import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';

import Routes from './_routes';

export const Segments = ({ formatMessage, match: { params: { projectId } } }) => (
  <div>
    <BreadcrumbItem to={`/projects/${projectId}/segments`}>
      {formatMessage('Segments')}
    </BreadcrumbItem>
    <Routes url="/projects/:projectId/segments" />
  </div>
);

Segments.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectId: PropTypes.string,
    }),
  }).isRequired,
};

export default injectIntl(Segments);
