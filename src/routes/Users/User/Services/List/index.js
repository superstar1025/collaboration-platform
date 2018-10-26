import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import {
  DropdownItem,
} from 'reactstrap';

import { injectIntl } from 'components/Intl';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';
import ButtonLink from 'components/ButtonLink';
import SmartTable from 'components/SmartTable';
import NotificationCard from 'components/NotificationCard';
import SearchBox from 'components/SearchBox';
import ButtonDropdown from 'components/ButtonDropdown';
import { listServices, removeService, createService } from 'redux/service/actions';
import { setConfirmMessage } from 'redux/ui/actions';
import { selectState, getRequestingSelector } from 'redux/selectors';
import { currentUserSelector, accessTokenSelector } from 'redux/auth/selectors';

export class ServicesList extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    services: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
    servicesRequesting: PropTypes.bool.isRequired,
    servicesMeta: ImmutablePropTypes.mapContains({
      total: PropTypes.number,
    }).isRequired,
    user: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    currentUser: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    accessToken: PropTypes.string,
    listServices: PropTypes.func.isRequired,
    removeService: PropTypes.func.isRequired,
    removeServiceRequesting: PropTypes.bool.isRequired,
    // createService: PropTypes.func.isRequired,
    createServiceRequesting: PropTypes.bool.isRequired,
    setConfirmMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    accessToken: '',
  };

  state = { pageIndex: 1, search: '' };

  componentWillMount() {
    this.load();
  }

  componentWillReceiveProps({ createServiceRequesting, removeServiceRequesting }) {
    if (!createServiceRequesting && this.props.createServiceRequesting) {
      this.load();
    } else if (!removeServiceRequesting && this.props.removeServiceRequesting) {
      this.load();
    }
  }

  onSearch = (value) => {
    const { listServices, match: { params: { userId } } } = this.props;
    this.setState({ search: value, pageIndex: 1 });
    listServices(userId, { 'page[number]': 1, search: value });
  }

  getUser = () => {
    const { user, currentUser, match: { params: { userId } } } = this.props;
    if (userId === 'me') return currentUser;
    return user.get('attributes');
  }

  /*
  addService = ({ type, provider }) => {
    const { createService } = this.props;
    const user = this.getUser();
    createService(user.get('id'), { type, provider });
  } */

  load = () => {
    const { listServices, match: { params: { userId } } } = this.props;
    const { pageIndex, search } = this.state;
    listServices(userId, { 'page[number]': pageIndex, search });
  }

  loadPage = (index) => {
    const { listServices, match: { params: { userId } } } = this.props;
    const { search } = this.state;
    this.setState({ pageIndex: index });
    listServices(userId, { 'page[number]': index, search });
  }

  render() {
    const {
      formatMessage,
      servicesRequesting,
      removeServiceRequesting,
      servicesMeta,
      services,
      match: { params: { userId } },
      removeService,
      setConfirmMessage,
      accessToken,
    } = this.props;
    const servicesCount = formatMessage('{count} {count, plural, one {account} other {accounts}}', { count: servicesMeta.get('total') });
    const ghost = servicesRequesting || removeServiceRequesting;
    const serviceTypes = [
      { provider: 'twitter', type: 'Service::Twitter', label: formatMessage('Twitter'), icon: 'twitter' },
      { provider: 'facebook', type: 'Service::Facebook', label: formatMessage('Facebook'), icon: 'facebook' },
      { provider: 'google', type: 'Service::Google', label: formatMessage('Google'), icon: 'google' },
    ];
    const user = this.getUser();
    return (
      <div className="animated fadeIn">
        <Helmet
          title={formatMessage('Connected Accounts')}
          meta={[
            { name: 'description', content: formatMessage('This is a page to list all connected accounts.') },
          ]}
        />
        <BreadcrumbMenu>
          {!servicesRequesting && (
            <ButtonLink className="no-border" handleClick={this.load}>
              {servicesCount}
            </ButtonLink>)}
          <ButtonDropdown
            title={formatMessage('Connect a personal account')}
            toggleOptions={{
              color: 'transparent',
              caret: true,
            }}
          >
            {
              serviceTypes.map(serviceType => (
                <DropdownItem
                  key={serviceType.type}
                  className="drop-down-item"
                >
                  <a
                    className="drop-down-item-link"
                    href={`${process.env.API_HOST}/auth/${serviceType.provider}?for=authorization&origin=${window.location.href}&token=${accessToken}`}
                    icon={`fa fa-${serviceType.icon}`}
                  >
                    {serviceType.label}
                  </a>
                </DropdownItem>
              ))
            }
          </ButtonDropdown>
        </BreadcrumbMenu>
        <HeaderTitle>
          {formatMessage(
            'All Services of User {userName}',
            { userName: user.get('name') || '--' },
          )}
        </HeaderTitle>
        <SearchBox onSearch={this.onSearch} />
        {
          !ghost && !services.size ? (
            <NotificationCard
              icon="link"
              title={formatMessage('No Connected Accounts')}
              description={formatMessage('Connected accounts let Audienti connect and automate third party services.')}
            />
          ) : (
            <SmartTable
              data={services.toJS()}
              fields={[
                {
                  label: formatMessage('Service'),
                  name: 'attributes.provider',
                  render: ((value, row) => {
                    const serviceType = serviceTypes.find(({ provider }) => provider === value);
                    return (
                      <ButtonLink
                        className="no-border"
                        to={`/users/${userId}/authorizations/${row.id}`}
                        icon={`fa fa-${serviceType.icon}`}
                      >
                        {serviceType.label}
                      </ButtonLink>
                    );
                  }),
                },
                {
                  label: '',
                  name: 'id',
                  render: ((value, row) => (
                    <i
                      className="fa fa-unlink action"
                      onClick={() => setConfirmMessage({
                        title: formatMessage('Disconnect Account'),
                        message: formatMessage('Are you sure you want to disconnect the account?'),
                        action: () => removeService(userId, row.id),
                      })}
                    />
                  )),
                },
              ]}
              ghost={ghost}
              actions={[]}
              onPageChange={this.loadPage}
              total={servicesMeta.get('total')}
              checkable
            />
          )
        }
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('user', 'user')(state, 'user'),
  ...selectState('service', 'services')(state, 'services'),
  currentUser: currentUserSelector(state),
  accessToken: accessTokenSelector(state),
  createServiceRequesting: getRequestingSelector('service', 'createService')(state),
  removeServiceRequesting: getRequestingSelector('service', 'removeService')(state),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  createService: (userId, payload) => dispatch(createService(userId, payload)),
  listServices: (userId, query) => dispatch(listServices(userId, query)),
  removeService: (userId, serviceId) => dispatch(removeService(userId, serviceId)),
  setConfirmMessage: payload => dispatch(setConfirmMessage(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ServicesList));
