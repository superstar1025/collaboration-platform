import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import { getSelector } from 'redux/selectors';
import { injectIntl } from 'components/Intl';

export class Notification extends Component {
  static propTypes = {
    notification: ImmutablePropTypes.mapContains({
      kind: PropTypes.string,
    }).isRequired,
  }

  state = { kind: 'default' };

  componentWillReceiveProps({ notification, formatMessage }) {
    if (notification !== this.props.notification) {
      const { kind, data } = notification.toJS();
      const action = kind === 'warning' ? 'warn' : kind;
      this.setState({ kind }, () => {
        const items = data instanceof Array ? data : [data];
        items.forEach(item => toast[action](
          <div>
            <b>{formatMessage(item.title)}</b><br />
            {item.detail && formatMessage(item.detail)}
          </div>,
        ));
      });
    }
  }

  render() {
    const { kind } = this.state;
    return (
      <ToastContainer
        position="top-right"
        type={kind}
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
      />
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  notification: getSelector('ui', 'notification')(state),
});

export default connect(mapStateToProps)(injectIntl(Notification));
