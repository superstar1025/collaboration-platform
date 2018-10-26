/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import List from './List';
import Project from './Project';

const Routes = ({ url }) => (
  <div>
    <Switch>
      <Route exact path={url} component={List} />
      <Route path={`${url}/:projectId`} component={Project} />
    </Switch>
  </div>
);

Routes.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Routes;
