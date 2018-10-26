import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'components/Intl';

export const Page404 = ({ formatMessage }) => (
  <div>
    <h1>{formatMessage('Not Found')}</h1>
    <h2>{formatMessage('This page is not built. Please check your url again.')}</h2>
  </div>
);

Page404.propTypes = {
  formatMessage: PropTypes.func.isRequired,
};

export default injectIntl(Page404);
