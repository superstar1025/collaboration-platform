import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { injectIntl } from 'components/Intl';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';
import ButtonLink from 'components/ButtonLink';
import SmartItemGroup from 'components/SmartItemGroup';
import NotificationCard from 'components/NotificationCard';
import SearchBox from 'components/SearchBox';
import { listWorkflows, removeWorkflow, updateWorkflow } from 'redux/workflow/actions';
import { setConfirmMessage } from 'redux/ui/actions';
import { selectState, getRequestingSelector } from 'redux/selectors';

import WorkflowCard from './components/WorkflowCard';

export class WorkflowsList extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    workflows: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
    workflowsRequesting: PropTypes.bool.isRequired,
    workflowsMeta: ImmutablePropTypes.mapContains({
      total: PropTypes.number,
    }).isRequired,
    project: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    listWorkflows: PropTypes.func.isRequired,
    removeWorkflow: PropTypes.func.isRequired,
    removeWorkflowRequesting: PropTypes.bool.isRequired,
    workflowRequesting: PropTypes.bool.isRequired,
    updateWorkflow: PropTypes.func.isRequired,
    setConfirmMessage: PropTypes.func.isRequired,
  };

  state = { pageIndex: 1, search: '' };

  componentWillMount() {
    this.load();
  }

  componentWillReceiveProps({ removeWorkflowRequesting }) {
    /* istanbul ignore else */
    if (!removeWorkflowRequesting && this.props.removeWorkflowRequesting) {
      this.load();
    }
  }

  onSearch = (value) => {
    const { listWorkflows, match: { params: { projectId } } } = this.props;
    this.setState({ search: value, pageIndex: 1 });
    listWorkflows(projectId, { 'page[number]': 1, search: value });
  }

  load = () => {
    const { listWorkflows, match: { params: { projectId } } } = this.props;
    const { pageIndex, search } = this.state;
    listWorkflows(projectId, { 'page[number]': pageIndex, search });
  }

  loadPage = (index) => {
    const { listWorkflows, match: { params: { projectId } } } = this.props;
    const { search } = this.state;
    this.setState({ pageIndex: index });
    listWorkflows(projectId, { 'page[number]': index, search });
  }

  toggleStatus = (workflowId, currentWorkflowStatus) => {
    const { updateWorkflow, match: { params: { projectId } } } = this.props;
    let status = 'active';
    if (currentWorkflowStatus === 'active') status = 'draft';
    this.setState({ updatingWorkflowId: workflowId });
    updateWorkflow(projectId, workflowId, { status });
  }

  render() {
    const {
      formatMessage,
      project,
      workflowsRequesting,
      removeWorkflowRequesting,
      workflowsMeta,
      workflows,
      match: { params: { projectId } },
      removeWorkflow,
      workflowRequesting,
      setConfirmMessage,
    } = this.props;
    const { updatingWorkflowId } = this.state;
    const workflowsCount = formatMessage('{count} {count, plural, one {workflow} other {workflows}}', { count: workflowsRequesting ? '--' : workflowsMeta.get('total') });
    const ghost = workflowsRequesting || removeWorkflowRequesting;
    const ItemComponent = props => (
      <WorkflowCard
        {...props}
        projectId={projectId}
        ghost={ghost || (props.data.attributes.id === updatingWorkflowId && workflowRequesting)}
        toggleStatus={this.toggleStatus}
      />
    );
    return (
      <div className="animated fadeIn">
        <Helmet
          title={formatMessage('workflows')}
          meta={[
            { name: 'description', content: formatMessage('This is a page to list all workflows.') },
          ]}
        />
        <BreadcrumbMenu>
          <SearchBox onSearch={this.onSearch} />
          <ButtonLink className="no-border" handleClick={this.load}>
            {workflowsCount}
          </ButtonLink>
          <ButtonLink className="no-border" to={`/projects/${projectId}/workflows/new`} icon="fa fa-plus">
            {formatMessage('Add workflows(s)')}
          </ButtonLink>
        </BreadcrumbMenu>
        <HeaderTitle>
          {formatMessage(
            'All workflows of Project {projectName}',
            { projectName: project.getIn(['attributes', 'name']) || '--' },
          )}
        </HeaderTitle>
        {
          !ghost && !workflows.size ? (
            <NotificationCard
              icon="list"
              title={formatMessage('There are no workflows')}
              description={formatMessage('Please, add a workflow to get started.')}
            />
          ) : (
            <SmartItemGroup
              data={workflows.toJS()}
              ItemComponent={ItemComponent}
              total={workflowsMeta.get('total')}
              onPageChange={this.loadPage}
              ghost={ghost}
              checkable
              remove={workflowId => setConfirmMessage({
                title: formatMessage('Remove Workflow'),
                message: formatMessage('Are you sure you want to remove the workflow?'),
                action: () => removeWorkflow(projectId, workflowId),
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
  ...selectState('project', 'project')(state, 'project'),
  ...selectState('workflow', 'workflows')(state, 'workflows'),
  removeWorkflowRequesting: getRequestingSelector('workflow', 'removeWorkflow')(state),
  workflowRequesting: getRequestingSelector('workflow', 'workflow')(state),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  listWorkflows: (projectId, query) => dispatch(listWorkflows(projectId, query)),
  removeWorkflow: (projectId, workflowId) => dispatch(removeWorkflow(projectId, workflowId)),
  updateWorkflow: (projectId, workflowId, payload) =>
    dispatch(updateWorkflow(projectId, workflowId, payload)),
  setConfirmMessage: payload => dispatch(setConfirmMessage(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(WorkflowsList));
