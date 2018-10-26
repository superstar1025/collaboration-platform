import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import BreadcrumbItem from 'components/BreadcrumbItem';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import ButtonLink from 'components/ButtonLink';
import HeaderTitle from 'components/HeaderTitle';
import NotificationCard from 'components/NotificationCard';
import SmartTable from 'components/SmartTable';
import SearchBox from 'components/SearchBox';
import { injectIntl } from 'components/Intl';
import { selectState, getRequestingSelector } from 'redux/selectors';
import { listTeamProjects, createTeamProject } from 'redux/teamProjects/actions';
import { listUsers } from 'redux/user/actions';

import AddProjectModal from './components/AddProjectModal';

export class Projects extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        teamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
    team: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    formatMessage: PropTypes.func.isRequired,
    projects: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
    users: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
    listTeamProjects: PropTypes.func.isRequired,
    listUsers: PropTypes.func.isRequired,
    projectsRequesting: PropTypes.bool.isRequired,
    createTeamProject: PropTypes.func.isRequired,
    createTeamProjectRequesting: PropTypes.bool.isRequired,
    projectsMeta: ImmutablePropTypes.mapContains({
      total: PropTypes.number,
    }).isRequired,
  };

  static defaultProps = {
    projects: [
      {
        id: '1',
      },
    ],
    users: [
      {
        id: '1',
      },
    ],
  }

  state = {
    createModal: false,
    addProjects: '',
  };

  componentWillMount() {
    const { match: { params: { companyId, teamId } }, listTeamProjects, listUsers } = this.props;
    listTeamProjects(companyId, teamId);
    listUsers();
  }

  onSearch = () => {
    const { listTeamProjects, match: { params: { companyId, teamId } } } = this.props;
    listTeamProjects(companyId, teamId);
  }

  loadPage = () => {
    const { match: { params: { companyId, teamId } }, listTeamProjects } = this.props;
    listTeamProjects(companyId, teamId);
  }

  toggleCreateModal = () => this.setState({ createModal: !this.state.createModal, addProjects: '' })

  render() {
    const {
      match: { params: { companyId, teamId } },
      team,
      formatMessage,
      projects,
      users,
      projectsRequesting,
      createTeamProject,
      createTeamProjectRequesting,
      projectsMeta,
    } = this.props;
    const {
      createModal,
      addProjects,
    } = this.state;
    const teamName = team.getIn(['attributes', 'name']);
    const ghost = projectsRequesting || createTeamProjectRequesting;
    const projectsCount = formatMessage('{count} {count, plural, one {project} other {projects}}', { count: projectsMeta.get('total') });
    return (
      <div>
        <BreadcrumbItem to={`/companies/${companyId}/teams/${teamId}/projects`}>
          {formatMessage('projects')}
        </BreadcrumbItem>
        <BreadcrumbMenu>
          <ButtonLink className="no-border" handleClick={this.load}>
            {projectsCount}
          </ButtonLink>
        </BreadcrumbMenu>
        <Row>
          <Col md={6} sm={6} xs="12">
            <SearchBox onSearch={this.onSearch} />
          </Col>
          <Col md={6} sm={6} xs="12" className="text-right">
            <ButtonLink className="no-border" handleClick={this.toggleCreateModal} icon="fa fa-plus">
              {formatMessage('Add Project')}
            </ButtonLink>
          </Col>
        </Row>
        <HeaderTitle>
          {formatMessage('Team')} {teamName}
        </HeaderTitle>
        <AddProjectModal
          isOpen={createModal}
          toggle={this.toggleCreateModal}
          className="primary"
          onSave={payload => createTeamProject(companyId, teamId, payload)}
          teams={addProjects}
          key={addProjects}
          teamName={teamName}
          users={users.toJS()}
        />
        {
          !ghost && !projects.size ? (
            <div className="margin-t-20">
              <NotificationCard
                icon="users"
                title={formatMessage('You do not have any projects yet')}
                description={formatMessage('You can add new project.')}
              />
            </div>
          ) : (
            <div className="margin-t-20">
              <SmartTable
                data={projects.toJS()}
                fields={[
                  {
                    label: formatMessage('Role'),
                    name: 'attributes.role',
                    render: (value => (
                      <span>
                        {value}
                      </span>
                    )),
                  },
                  {
                    label: formatMessage('Created'),
                    name: 'attributes.created_at',
                    render: (value => (
                      <span>
                        {moment(value).fromNow()}
                      </span>
                    )),
                  },
                  {
                    label: formatMessage('Updated'),
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
                total={projectsMeta.get('total')}
                checkable
              />
            </div>
          )
        }
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    ...selectState('team', 'team')(state, 'team'),
    ...selectState('project', 'projects')(state, 'projects'),
    ...selectState('user', 'users')(state, 'users'),
    createTeamProjectRequesting: getRequestingSelector('project', 'createProject')(state),
  };
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  listTeamProjects: (companyId, teamId, query) => dispatch(listTeamProjects(companyId, teamId, query)),
  listUsers: query => dispatch(listUsers(query)),
  createTeamProject: (companyId, teamId, payload) => dispatch(createTeamProject(companyId, teamId, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Projects));
