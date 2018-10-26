/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Detail from './Detail';
import Teams from './Teams';
import Companies from './Companies';
import Projects from './Projects';
import Services from './Services';

const Routes = ({ url }) => (
  <div>
    <Switch>
      <Route exact path={url} component={Detail} />
      <Route path={`${url}/teams`} component={Teams} />
      <Route path={`${url}/companies`} component={Companies} />
      <Route path={`${url}/projects`} component={Projects} />
      <Route path={`${url}/authorizations`} component={Services} />
    </Switch>
  </div>
);

Routes.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Routes;
