/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Detail from './Detail';
import Members from './Members';
import Team from './Team';
import Projects from './Projects';
import Settings from './Settings';

const Routes = ({ url }) => (
  <div>
    <Switch>
      <Route exact path={url} component={Detail} />
      <Route path={`${url}/members`} component={Members} />
      <Route path={`${url}/team`} component={Team} />
      <Route path={`${url}/projects`} component={Projects} />
      <Route path={`${url}/settings`} component={Settings} />
    </Switch>
  </div>
);

Routes.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Routes;
