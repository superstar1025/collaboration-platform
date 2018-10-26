/**
 * This wraps all routes, and is mounted anytime a user is viewing the application.
 * It verifies that a user is authroized to view the application and spawns a token refresh process.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Auth0 from 'auth0-js';

import { getSelector } from 'redux/selectors';

export class AuthorizationHandler extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    tokenInfo: PropTypes.shape({
      token: PropTypes.string,
      expired: PropTypes.number,
    }).isRequired,
    location: PropTypes.shape().isRequired,
  };

  static defaultProps = {

  };

  authRequired = ({ id_token: idToken, expires }) => !idToken || expires < moment().unix();

  authorize = ({ pathname, search, hash }) => {
    const redirectUrl = encodeURIComponent(`${pathname}${search}${hash}`);
    const auth0 = new Auth0.WebAuth({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      redirectUri: `${process.env.AUTH0_CALLBACK_URL}?redirect_url=${redirectUrl}`,
      audience: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid profile email',
    });
    auth0.authorize();
  }

  render() {
    const { children, tokenInfo, location } = this.props;
    if (this.authRequired(tokenInfo.toJS())) {
      this.authorize(location);
      // null can be replaced with loading indicator for better UX
      return null;
    }
    return children;
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  tokenInfo: getSelector('auth', 'tokenInfo')(state),
});

export default connect(mapStateToProps)(AuthorizationHandler);
