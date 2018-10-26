
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import BreadcrumbItem from 'components/BreadcrumbItem';
import { selectState } from 'redux/selectors';
import { readService } from 'redux/service/actions';

export class Service extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        keywordId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
    service: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    readService: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { match: { params: { userId, serviceId } }, readService } = this.props;
    readService(userId, serviceId);
  }

  render() {
    const { match: { params: { userId, serviceId } }, service } = this.props;
    return (
      <div>
        <BreadcrumbItem to={`/users/${userId}/authorizations/${serviceId}`}>
          {service.getIn(['attributes', 'name'])}
        </BreadcrumbItem>
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('service', 'service')(state, 'service'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  readKeyword: (userId, serviceId) => dispatch(readService(userId, serviceId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Service);
