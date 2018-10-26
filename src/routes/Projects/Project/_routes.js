/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Detail from './Detail';
import Keywords from './Keywords';
import Segments from './Segments';
import Workflows from './Workflows';

const Routes = ({ url }) => (
  <div>
    <Switch>
      <Route exact path={url} component={Detail} />
      <Route path={`${url}/keywords`} component={Keywords} />
      <Route path={`${url}/segments`} component={Segments} />
      <Route path={`${url}/workflows`} component={Workflows} />
    </Switch>
  </div>
);

Routes.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Routes;
