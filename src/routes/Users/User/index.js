import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';
import SidebarItems from 'components/SidebarItems';
import { readUser } from 'redux/user/actions';
import { selectState } from 'redux/selectors';
import { currentUserSelector } from 'redux/auth/selectors';

import Routes from './_routes';

export class User extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        userId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    user: ImmutablePropTypes.mapContains({
      attributes: ImmutablePropTypes.mapContains({
        name: PropTypes.string,
      }),
    }).isRequired,
    currentUser: ImmutablePropTypes.mapContains({
      name: PropTypes.string,
    }).isRequired,
  };

  render() {
    const {
      formatMessage,
      match: { params: { userId } },
      user,
      currentUser,
    } = this.props;
    const activeUser = userId === 'me' ? currentUser : user.get('attributes');
    const userName = activeUser.get('name') || '--';
    const urlPrefix = `/users/${userId}`;
    return (
      <div>
        <BreadcrumbItem to={`/users/${userId}`}>{userName}</BreadcrumbItem>
        <SidebarItems
          items={[
            { title: true, name: userName },
            {
              name: formatMessage('Projects'),
              url: `${urlPrefix}/projects`,
              icon: 'fa fa-folder',
            },
            {
              name: formatMessage('Companies'),
              url: `${urlPrefix}/companies`,
              icon: 'fa fa-building',
            },
            {
              name: formatMessage('Teams'),
              url: `${urlPrefix}/teams`,
              icon: 'fa fa-slack',
            },
            {
              name: formatMessage('Authorizations'),
              url: `${urlPrefix}/authorizations`,
              icon: 'fa fa-user-secret',
            },
          ]}
        />
        <Routes url="/users/:userId" />
      </div>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('user', 'user')(state, 'user'),
  currentUser: currentUserSelector(state),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  readUser: userId => dispatch(readUser(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(User));
