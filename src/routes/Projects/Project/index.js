import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';
import SidebarItems from 'components/SidebarItems';
import { readProject } from 'redux/project/actions';
import { selectState } from 'redux/selectors';

import Routes from './_routes';

export class Project extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    readProject: PropTypes.func.isRequired,
    project: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  };

  componentWillMount() {
    const { match: { params: { projectId } }, readProject } = this.props;
    readProject(projectId);
  }

  render() {
    const {
      formatMessage,
      match: { params: { projectId } },
      project,
    } = this.props;
    const projectName = project.getIn(['attributes', 'name']);
    return (
      <div>
        <BreadcrumbItem to={`/projects/${projectId}`}>{projectName}</BreadcrumbItem>
        <SidebarItems
          items={[
            { title: true, name: projectName },
            {
              name: formatMessage('Keywords'),
              url: `/projects/${projectId}/keywords`,
              icon: 'fa fa-key',
            },
            {
              name: formatMessage('Segments'),
              url: `/projects/${projectId}/segments`,
              icon: 'fa fa-pie-chart',
            },
            {
              name: formatMessage('Workflows'),
              url: `/projects/${projectId}/workflows`,
              icon: 'fa fa-paper-plane',
            },
          ]}
        />
        <Routes url="/projects/:projectId" />
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('project', 'project')(state, 'project'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  readProject: projectId => dispatch(readProject(projectId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Project));
