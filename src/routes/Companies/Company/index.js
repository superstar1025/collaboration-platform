import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';
import { readCompany } from 'redux/company/actions';
import { selectState } from 'redux/selectors';

import Routes from './_routes';

export class Company extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        companyId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    readCompany: PropTypes.func.isRequired,
    company: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  };

  componentWillMount() {
    const { match: { params: { companyId } }, readCompany } = this.props;
    readCompany(companyId);
  }

  render() {
    const {
      match: { params: { companyId } },
      company,
    } = this.props;
    const companyName = company.getIn(['attributes', 'name']);
    return (
      <div>
        <BreadcrumbItem to={`/companies/${companyId}`}>{companyName}</BreadcrumbItem>
        <Routes url="/companies/:companyId" />
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('company', 'company')(state, 'company'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  readCompany: companyId => dispatch(readCompany(companyId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Company));
