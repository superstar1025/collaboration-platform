import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Nav } from 'reactstrap';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { getSelector } from 'redux/selectors';
import { currentUserSelector } from 'redux/auth/selectors';
import Auth0 from 'auth0-js';

import Title from './components/Title';
import Divider from './components/Divider';
import NavDropdown from './components/NavDropdown';
import NavItem from './components/NavItem';
import SidebarHeader from './components/SidebarHeader';
import SidebarMinimizer from './components/SidebarMinimizer';

export class Sidebar extends Component {

  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequire,
    }).isRequired,
    sidebarItems: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        name: PropTypes.string,
      }),
    ).isRequired,
    currentUser: ImmutablePropTypes.mapContains({
      picture: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      nickname: PropTypes.string.isRequired,
    }),
  }

  static defaultProps = {
    currentUser: fromJS({
      picture: '',
      name: '',
      nickname: '',
    }),
  }

  handleClick = (e) => {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute = (routeName) => {
    const { location: { pathname } } = this.props;
    return pathname.indexOf(routeName) > -1;
  }

  // nav link
  navLink = (item, idx) => {
    if (item.title) return <Title {...item} key={idx} />;
    if (item.divider) return <Divider {...item} key={idx} />;
    if (item.children) {
      return (
        <NavDropdown
          handleClick={this.handleClick}
          open={this.activeRoute(item.url)}
          {...item}
          key={idx}
        >
          {this.navList(item.children)}
        </NavDropdown>
      );
    }
    return <NavItem {...item} key={idx} />;
  }

  // nav list
  navList = items => items.map((item, index) => this.navLink({ ...item, name: item.name || '--' }, index))

  render() {
    const { sidebarItems, currentUser } = this.props;
    // sidebar-nav root
    return (
      <div className="sidebar">
        <SidebarHeader {...currentUser.toJS()} />
        <nav className="sidebar-nav">
          <Nav>
            {this.navList(sidebarItems.toJS())}
          </Nav>
        </nav>
        <SidebarMinimizer />
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  sidebarItems: getSelector('ui', 'sidebarItems')(state),
  currentUser: currentUserSelector(state),
});

export default connect(mapStateToProps)(Sidebar);
