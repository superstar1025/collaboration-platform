/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import List from './List';
import Create from './Create';
import Workflow from './Workflow';

const Routes = ({ url }) => (
  <div>
    <Switch>
      <Route exact path={url} component={List} />
      <Route path={`${url}/new`} component={Create} />
      <Route path={`${url}/:workflowId`} component={Workflow} />
    </Switch>
  </div>
);

Routes.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Routes;
