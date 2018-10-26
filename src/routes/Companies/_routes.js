/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import List from './List';
import Company from './Company';

const Routes = ({ url }) => (
  <div>
    <Switch>
      <Route exact path={url} component={List} />
      <Route path={`${url}/:companyId`} component={Company} />
    </Switch>
  </div>
);

Routes.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Routes;
