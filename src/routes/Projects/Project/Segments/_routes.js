/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import List from './List';
import Create from './Create';
import Segment from './Segment';

const Routes = ({ url }) => (
  <div>
    <Switch>
      <Route exact path={url} component={List} />
      <Route path={`${url}/new`} component={Create} />
      <Route path={`${url}/:segmentId`} component={Segment} />
    </Switch>
  </div>
);

Routes.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Routes;
