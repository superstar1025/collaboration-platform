import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';
import base64 from 'base-64';

import { setAuthToken } from 'redux/auth/actions';
import { getSelector } from 'redux/selectors';

export class Callback extends Component {

  static propTypes = {
    tokenInfo: PropTypes.shape({
      expires: PropTypes.number,
      id_token: PropTypes.string,
    }).isRequired,
    setAuthToken: PropTypes.func.isRequired,
    location: PropTypes.shape({
      hash: PropTypes.string.isRequired,
    }).isRequired,
  }

  state = { redirectUrl: null }

  componentWillMount() {
    const { location: { hash }, setAuthToken } = this.props;
    // set token info from hash params (info is then stored in memoryDB)
    const tokenInfo = queryString.parse(hash);
    if (!tokenInfo.id_token) {
      return;
    }
    tokenInfo.undecodedToken = tokenInfo.id_token;
    const tokens = tokenInfo.id_token.split('.');
    tokenInfo.currentUser = JSON.parse(base64.decode(tokens[1]));
    tokenInfo.expires = tokenInfo.currentUser.exp;
    setAuthToken({
      ...tokenInfo,
      tokenPayload: tokens[1],
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location: { search, hash }, tokenInfo } = nextProps;
    const hashParams = queryString.parse(hash);
    const queryParams = queryString.parse(search);
    // if tokenInfo is set correctly
    if (tokenInfo.get('id_token') === hashParams.id_token) {
      this.setState({ redirectUrl: queryParams.redirect_url || '/' });
    }
  }

  render() {
    const { redirectUrl } = this.state;
    if (redirectUrl) return <Redirect to={redirectUrl} />;
    return null;
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  tokenInfo: getSelector('auth', 'tokenInfo')(state),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  setAuthToken: tokenInfo => dispatch(setAuthToken(tokenInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Callback);
