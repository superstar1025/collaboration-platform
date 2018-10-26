import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Nav,
  NavbarBrand,
  NavbarToggler,
} from 'reactstrap';

import { getSelector } from 'redux/selectors';

export class Header extends Component {
  static propTypes = {
    headerTitle: PropTypes.node,
  }
  static defaultProps = {
    headerTitle: '',
  }
  sidebarToggle = (e) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
    document.body.classList.toggle('brand-minimized');
  }

  mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  render() {
    const { headerTitle } = this.props;
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        <NavbarBrand href="#" />
        <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        <Nav className="d-md-down-none" navbar>
          <strong>{headerTitle}</strong>
        </Nav>
        <Nav className="ml-auto" navbar />
      </header>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  headerTitle: getSelector('ui', 'headerTitle')(state),
});

export default connect(mapStateToProps)(Header);
