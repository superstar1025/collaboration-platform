
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { injectIntl } from 'components/Intl';
import HeaderTitle from 'components/HeaderTitle';
import { selectState } from 'redux/selectors';
import { currentUserSelector } from 'redux/auth/selectors';

export const UserDetail = ({ formatMessage, match: { params: { userId } }, user, currentUser }) => {
  const activeUser = userId === 'me' ? currentUser : user.get('attributes');
  const userName = activeUser.get('name') || '--';
  return (
    <div className="animated fadeIn">
      <HeaderTitle>{formatMessage('{userName} profile', { userName })}</HeaderTitle>
      <div className="username">{userName}</div>
    </div>
  );
};

UserDetail.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
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

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('user', 'user')(state, 'user'),
  currentUser: currentUserSelector(state),
});

export default connect(mapStateToProps)(injectIntl(UserDetail));
