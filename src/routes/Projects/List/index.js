import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { injectIntl } from 'components/Intl';
import { selectState, getRequestingSelector } from 'redux/selectors';
import { listProjects, createProject, removeProject } from 'redux/project/actions';
import { setConfirmMessage } from 'redux/ui/actions';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import ButtonLink from 'components/ButtonLink';
import HeaderTitle from 'components/HeaderTitle';
import NotificationCard from 'components/NotificationCard';
import SearchBox from 'components/SearchBox';
import SmartItemGroup from 'components/SmartItemGroup';

import ProjectCard from './components/ProjectCard';
import ProjectCardGhost from './components/ProjectCardGhost';
import CreateProjectModal from './components/CreateProjectModal';

export class ProjectsList extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    projects: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
    listProjects: PropTypes.func.isRequired,
    projectsRequesting: PropTypes.bool.isRequired,
    projectsMeta: ImmutablePropTypes.mapContains({
      total: PropTypes.number,
    }).isRequired,
    createProject: PropTypes.func.isRequired,
    createProjectRequesting: PropTypes.bool.isRequired,
    removeProject: PropTypes.func.isRequired,
    removeProjectRequesting: PropTypes.bool.isRequired,
    setConfirmMessage: PropTypes.func.isRequired,
  };

  state = { createModal: false, search: '', pageIndex: 1 };

  componentWillMount() {
    this.load();
  }

  componentWillReceiveProps({ createProjectRequesting, removeProjectRequesting }) {
    if (!createProjectRequesting && this.props.createProjectRequesting) {
      this.load();
    }
    if (!removeProjectRequesting && this.props.removeProjectRequesting) {
      this.load();
    }
  }

  onSearch = (value) => {
    const { listProjects } = this.props;
    this.setState({ search: value, pageIndex: 1 });
    listProjects({ 'page[number]': 1, search: value });
  }

  load = () => {
    const { listProjects } = this.props;
    const { pageIndex, search } = this.state;
    listProjects({ 'page[number]': pageIndex, search });
  }

  loadPage = (index) => {
    const { listProjects } = this.props;
    const { search } = this.state;
    this.setState({ pageIndex: index });
    listProjects({ 'page[number]': index, search });
  }

  toggleCreateModal = () => this.setState({ createModal: !this.state.createModal })

  render() {
    const {
      formatMessage, projects, projectsRequesting, projectsMeta, createProject,
      createProjectRequesting, removeProject, removeProjectRequesting, setConfirmMessage,
    } = this.props;
    const { createModal } = this.state;
    const projectsCount = formatMessage('{count} {count, plural, one {project} other {projects}}', { count: projectsRequesting ? '--' : projectsMeta.get('total') });
    const ghost = projectsRequesting || createProjectRequesting || removeProjectRequesting;
    const ItemComponent = ghost ? ProjectCardGhost : ProjectCard;
    return (
      <div className="animated fadeIn">
        <Helmet
          title={formatMessage('Projects')}
          meta={[
            { name: 'description', content: formatMessage('This is a page to list all projects.') },
          ]}
        />
        <BreadcrumbMenu>
          <SearchBox onSearch={this.onSearch} />
          <ButtonLink className="no-border" handleClick={this.load}>
            {projectsCount}
          </ButtonLink>
          <ButtonLink className="no-border" handleClick={this.toggleCreateModal} icon="fa fa-plus">
            {formatMessage('Add Project')}
          </ButtonLink>
        </BreadcrumbMenu>
        <HeaderTitle>{formatMessage('Active Projects')}</HeaderTitle>
        <CreateProjectModal
          isOpen={createModal}
          toggle={this.toggleCreateModal}
          className="primary"
          onSave={createProject}
        />
        {
          !ghost && !projects.size ? (
            <NotificationCard
              icon="folder"
              title={formatMessage('You do not have any projects')}
              description={formatMessage('Projects are containers of work. You should create a owner project now.')}
            />
          ) : (
            <SmartItemGroup
              data={projects.toJS()}
              ItemComponent={ItemComponent}
              total={projectsMeta.get('total')}
              onPageChange={this.loadPage}
              ghost={ghost}
              checkable
              remove={projectId => setConfirmMessage({
                title: formatMessage('Remove Project'),
                message: formatMessage('Are you sure you want to remove the project?'),
                action: () => removeProject(projectId),
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
  ...selectState('project', 'projects')(state, 'projects'),
  ...selectState('project', 'createProject')(state, 'createProject'),
  removeProjectRequesting: getRequestingSelector('project', 'removeProject')(state),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  listProjects: payload => dispatch(listProjects(payload)),
  createProject: payload => dispatch(createProject(payload)),
  removeProject: projectId => dispatch(removeProject(projectId)),
  setConfirmMessage: payload => dispatch(setConfirmMessage(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ProjectsList));
