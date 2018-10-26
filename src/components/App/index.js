import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { clearAuthToken } from 'redux/auth/actions';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Breadcrumb from 'components/Breadcrumb';
import SidebarItems from 'components/SidebarItems';
import Notification from 'components/Notification';
import ConfirmDialog from 'components/ConfirmDialog';

export class App extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    clearAuthToken: PropTypes.func.isRequired,
  };

  render() {
    const { children, clearAuthToken, ...props } = this.props;
    return (
      <div className="app">
        <Header />
        <SidebarItems
          items={[
            { title: true, name: 'Global' },
            {
              name: 'Projects',
              url: '/projects',
              icon: 'icon-folder',
            },
            {
              name: 'Logout',
              icon: 'fa fa-sign-out',
              url: '/logout',
              handleClick: clearAuthToken,
            },
          ]}
        />
        <Notification />
        <ConfirmDialog />
        <div className="app-body">
          <Sidebar {...props} />
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              {children}
            </Container>
          </main>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  clearAuthToken: () => dispatch(clearAuthToken()),
});

export default connect(undefined, mapDispatchToProps)(App);
