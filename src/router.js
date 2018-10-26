import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthorizationHandler from 'components/AuthorizationHandler';
import App from 'components/App';
import Callback from 'routes/Callback';
import Dashboard from 'routes/Dashboard';
import Projects from 'routes/Projects';
import Users from 'routes/Users';
import Companies from 'routes/Companies';
import Page404 from 'routes/Page404';

const AuthorizedRoutes = props => (
  <AuthorizationHandler {...props}>
    <App {...props} >
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/projects" component={Projects} />
        <Route path="/users" component={Users} />
        <Route path="/companies" component={Companies} />
        <Redirect exact path="/" to="/dashboard" />
        <Route path="*" component={Page404} />
      </Switch>
    </App>
  </AuthorizationHandler>
);

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/callback" component={Callback} />
      <Route path="/" component={AuthorizedRoutes} />
    </Switch>
  </BrowserRouter>
);

export default Router;
