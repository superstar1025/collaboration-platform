import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { injectIntl } from 'components/Intl';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import ButtonLink from 'components/ButtonLink';
import SearchBox from 'components/SearchBox';
import NotificationCard from 'components/NotificationCard';
import SmartItemGroup from 'components/SmartItemGroup';

import { listCompanies, removeCompany, createCompany } from 'redux/company/actions';
import { setConfirmMessage } from 'redux/ui/actions';
import { selectState, getRequestingSelector } from 'redux/selectors';
import CreateCompanyModal from './components/CreateCompanyModal';
import CompanyCard from './components/CompanyCard';
import CompanyCardGhost from './components/CompanyCardGhost';

export class CompaniesList extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    companies: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
    companiesRequesting: PropTypes.bool.isRequired,
    companiesMeta: ImmutablePropTypes.mapContains({
      total: PropTypes.number,
    }).isRequired,
    listCompanies: PropTypes.func.isRequired,
    removeCompany: PropTypes.func.isRequired,
    removeCompanyRequesting: PropTypes.bool.isRequired,
    createCompany: PropTypes.func.isRequired,
    createCompanyRequesting: PropTypes.bool.isRequired,
    setConfirmMessage: PropTypes.func.isRequired,
  };

  state = { createModal: false };

  componentWillMount() {
    this.load();
  }

  componentWillReceiveProps({ createCompanyRequesting, removeCompanyRequesting }) {
    if (!createCompanyRequesting && this.props.createCompanyRequesting) {
      this.load();
    } else if (!removeCompanyRequesting && this.props.removeCompanyRequesting) {
      this.load();
    }
  }

  onSearch = (value) => {
    const { listCompanies } = this.props;
    listCompanies({ 'page[number]': 1, search: value });
  }

  load = () => {
    const { listCompanies } = this.props;
    listCompanies();
  }

  loadPage = () => {
    const { listCompanies } = this.props;
    listCompanies();
  }

  toggleCreateModal = () => this.setState({ createModal: !this.state.createModal })

  render() {
    const {
      formatMessage,
      companiesRequesting,
      companiesMeta,
      createCompany,
      companies,
      removeCompany,
      removeCompanyRequesting,
      createCompanyRequesting,
      setConfirmMessage,
    } = this.props;
    const { createModal } = this.state;
    const companiesCount = formatMessage('{count} {count, plural, one {company} other {companies}}', { count: companiesMeta.get('total') });
    const ghost = companiesRequesting || createCompanyRequesting || removeCompanyRequesting;
    const ItemComponent = ghost ? CompanyCardGhost : CompanyCard;
    return (
      <div className="animated fadeIn">
        <BreadcrumbMenu>
          <SearchBox onSearch={this.onSearch} />
          <ButtonLink className="no-border" handleClick={this.load}>
            {companiesCount}
          </ButtonLink>
          <ButtonLink className="no-border" handleClick={this.toggleCreateModal} icon="fa fa-plus">
            {formatMessage('Add Company')}
          </ButtonLink>
        </BreadcrumbMenu>
        <CreateCompanyModal
          isOpen={createModal}
          toggle={this.toggleCreateModal}
          className="primary"
          onSave={createCompany}
        />
        {
          !ghost && !companies.size ? (
            <NotificationCard
              icon="building"
              title={formatMessage('There are no companies')}
              description={formatMessage('You should create company now')}
            />
          ) : (
            <SmartItemGroup
              data={companies.toJS()}
              ItemComponent={ItemComponent}
              total={companiesMeta.get('total')}
              onPageChange={this.loadPage}
              ghost={ghost}
              checkable
              companyPagination
              remove={companyId => setConfirmMessage({
                title: formatMessage('Remove Company'),
                message: formatMessage('Are you sure you want to remove the company?'),
                action: () => removeCompany(companyId),
              })}
            />
          )
        }
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('company', 'companies')(state, 'companies'),
  ...selectState('company', 'createCompany')(state, 'createCompany'),
  removeCompanyRequesting: getRequestingSelector('company', 'removeCompany')(state),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  listCompanies: payload => dispatch(listCompanies(payload)),
  createCompany: payload => dispatch(createCompany(payload)),
  removeCompany: companyId => dispatch(removeCompany(companyId)),
  setConfirmMessage: payload => dispatch(setConfirmMessage(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CompaniesList));
