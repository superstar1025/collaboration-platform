import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import moment from 'moment';

import { injectIntl } from 'components/Intl';
import { selectState, getRequestingSelector } from 'redux/selectors';
import { listTeams, createTeam } from 'redux/team/actions';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import ButtonLink from 'components/ButtonLink';
import HeaderTitle from 'components/HeaderTitle';
import SmartTable from 'components/SmartTable';
import NotificationCard from 'components/NotificationCard';
import SearchBox from 'components/SearchBox';

import AddTeamModal from './components/AddTeamModal';

export class TeamsList extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
    teamsMeta: ImmutablePropTypes.mapContains({
      total: PropTypes.number,
    }).isRequired,
    company: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    teams: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
    listTeams: PropTypes.func.isRequired,
    createTeam: PropTypes.func.isRequired,
    createTeamRequesting: PropTypes.bool.isRequired,
    teamsRequesting: PropTypes.bool.isRequired,
  };

  state = {
    createModal: false,
    addTeams: '',
    createRequesting: 'createTeamRequesting',
  };

  componentWillMount() {
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    const { createRequesting } = this.state;
    if (!nextProps[createRequesting] && this.props[createRequesting]) {
      this.load();
    }
  }

  onSearch = (value) => {
    const { match: { params: { companyId } }, listTeams } = this.props;
    listTeams(companyId, { 'page[number]': 1, search: value });
  }

  load = () => {
    const { match: { params: { companyId } }, listTeams } = this.props;
    listTeams(companyId);
  }

  toggleCreateModal = () => this.setState({ createModal: !this.state.createModal, addTeams: '' })

  loadPage = () => {
    const { match: { params: { companyId } }, listTeams } = this.props;
    listTeams(companyId);
  }

  render() {
    const {
      formatMessage,
      teamsMeta,
      company,
      teams,
      createTeam,
      match: { params: { companyId } },
      createTeamRequesting,
      teamsRequesting,
    } = this.props;
    const {
      createModal,
      addTeams,
    } = this.state;
    const teamsCount = formatMessage('{count} {count, plural, one {team} other {teams}}', { count: teamsMeta.get('total') });
    const ghost = teamsRequesting || createTeamRequesting;
    return (
      <div className="animated fadeIn">
        <Helmet
          title={formatMessage('Teams')}
          meta={[
            { name: 'description', content: formatMessage('This is a page to list all teams.') },
          ]}
        />
        <BreadcrumbMenu>
          <SearchBox onSearch={this.onSearch} />
          <ButtonLink className="no-border" handleClick={this.load}>
            {teamsCount}
          </ButtonLink>
          <ButtonLink className="no-border" handleClick={this.toggleCreateModal} icon="fa fa-plus">
            {formatMessage('Add Team')}
          </ButtonLink>
        </BreadcrumbMenu>
        <HeaderTitle>
          {formatMessage(
            'All Teams of {companyName}',
            { companyName: company.getIn(['attributes', 'name']) || '--' },
          )}
        </HeaderTitle>
        <AddTeamModal
          isOpen={createModal}
          toggle={this.toggleCreateModal}
          className="primary"
          onSave={payload => createTeam(companyId, payload)}
          teams={addTeams}
          key={addTeams}
        />
        {
          !ghost && !teams.size ? (
            <NotificationCard
              icon="users"
              title={formatMessage('You have not added any teams yet')}
              description={formatMessage('You can create a new team.')}
            />
          ) : (
            <SmartTable
              data={teams.toJS()}
              fields={[
                {
                  label: formatMessage('Team'),
                  name: 'attributes.name',
                  render: ((value, row) => (
                    <ButtonLink
                      className="no-border"
                      to={`/companies/${companyId}/teams/${row.id}`}
                    >
                      {value}
                    </ButtonLink>
                  )),
                },
                {
                  label: 'Members',
                  name: 'id',
                  render: (() => (
                    <span>
                      {formatMessage('{count} {count, plural, one {member} other {members}}', { count: 0 })}
                    </span>
                  )),
                },
                {
                  label: 'Visibility',
                  name: 'attributes.visibility',
                  render: (value => (
                    <span>
                      {value}
                    </span>
                  )),
                },
                {
                  label: 'Created',
                  name: 'attributes.created_at',
                  render: (value => (
                    <span>
                      {moment(value).fromNow()}
                    </span>
                  )),
                },
                {
                  label: 'Updated',
                  name: 'attributes.updated_at',
                  render: (value => (
                    <span>
                      {moment(value).fromNow()}
                    </span>
                  )),
                },
              ]}
              ghost={ghost}
              actions={[]}
              onPageChange={this.loadPage}
              total={teamsMeta.get('total')}
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
  ...selectState('company', 'company')(state, 'company'),
  ...selectState('team', 'teams')(state, 'teams'),
  createTeamRequesting: getRequestingSelector('team', 'createTeam')(state),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  listTeams: (companyId, query) => dispatch(listTeams(companyId, query)),
  createTeam: (companyId, payload) => dispatch(createTeam(companyId, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TeamsList));
