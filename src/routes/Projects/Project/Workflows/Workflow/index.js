import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import scriptLoader from 'react-async-script-loader';
import { get } from 'lodash';
import { connect } from 'react-redux';
import {
  Label,
  Input,
} from 'reactstrap';

import { injectIntl } from 'components/Intl';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import BreadcrumbItem from 'components/BreadcrumbItem';
import LoadingIndicator from 'components/LoadingIndicator';
import HeaderTitle from 'components/HeaderTitle';
import ButtonLink from 'components/ButtonLink';
import { readWorkflow, updateWorkflow } from 'redux/workflow/actions';
import { selectState } from 'redux/selectors';
import { listAgentTypes } from 'redux/agent_type/actions';

import './lib/halo.js';
import './lib/selection.js';
import './lib/inspector.js';
import './lib/stencil.js';
import './lib/toolbar.js';
import './lib/sample-graphs.js';

import initialize from './lib/main.js';
import pickTheme from './lib/theme-picker.js';
import initShape from './lib/joint.shapes.app.js';

import ConfigDialog from './components/ConfigDialog';

export class Workflow extends Component {

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string,
        workflowId: PropTypes.string,
      }),
    }).isRequired,
    readWorkflow: PropTypes.func.isRequired,
    workflow: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    listAgentTypes: PropTypes.func.isRequired,
    agentTypes: ImmutablePropTypes.mapContains({
      agents: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
        name: PropTypes.string,
      })),
      schedules: ImmutablePropTypes.listOf(PropTypes.string),
    }).isRequired,
    formatMessage: PropTypes.func.isRequired,
    // workflowRequesting: PropTypes.bool.isRequired,
    isScriptLoadSucceed: PropTypes.bool.isRequired,
    updateWorkflow: PropTypes.func.isRequired,
  };

  static defaultProps = {
  }

  static defaultConfigDialog = { agentType: { config: { fields: [] } } };

  state = { configDialog: Workflow.defaultConfigDialog, toggleInProgress: false };

  componentWillMount() {
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    /* istanbul ignore else */
    if (nextProps.isScriptLoadSucceed
        && get(nextProps.agentTypes.toJS(), 'agents.length')
        && nextProps.workflow.get('id')
    ) {
      this.rappidInit(nextProps);
    }
    if (this.props.workflow !== nextProps.workflow) {
      this.showErrors(nextProps);
      this.setState({ toggleInProgress: false });
    }
  }

  toggleStatus = (workflowId, currentWorkflowStatus) => {
    const { updateWorkflow, match: { params: { projectId } } } = this.props;
    let status = 'active';
    if (currentWorkflowStatus === 'active') status = 'draft';
    this.setState({ toggleInProgress: true });
    updateWorkflow(projectId, workflowId, { status });
  }

  rappidInit = ({ agentTypes, workflow, workflowMeta }) => {
    if (this.loaded) return;
    this.workflowFunctions = {};
    const params = {
      agentTypes: agentTypes.toJS().agents,
      configClicked: this.configClicked,
      saveWorkflow: this.saveWorkflow,
      workflowFunctions: this.workflowFunctions,
    };
    initialize(window._, window.joint, params);
    pickTheme(window._, window.joint);
    initShape(window.joint);
    window.joint.setTheme('modern');
    const app = new window.App.MainView({ el: '#rappid-container' });
    const options = workflow.getIn(['attributes', 'options']).toJS();
    options.cells = options.cells || [];
    app.graph.fromJSON(options);
    if (workflowMeta.get('errors')) {
      this.showErrors({ workflowMeta });
    }
    this.loaded = true;
  }

  showErrors = ({ workflowMeta }) => {
    if (!this.workflowFunctions) return;
    this.workflowFunctions.showErrors(workflowMeta.get('errors').toJS());
  }

  load = () => {
    const {
      readWorkflow,
      listAgentTypes,
      match: { params: { projectId, workflowId } },
    } = this.props;
    readWorkflow(projectId, workflowId);
    listAgentTypes(projectId);
  }

  configClicked = (agentName, config, callback) => {
    const { agentTypes } = this.props;
    const agentType = agentTypes.toJS().agents.find(({ config: { type } }) => type === agentName);
    this.setState({ configDialog: { open: true, callback, defaultConfig: config, agentType } });
  }

  configDialogClose = () => {
    this.setState({ configDialog: Workflow.defaultConfigDialog });
  }

  saveWorkflow = (workflowDraft) => {
    const { match: { params: { projectId, workflowId } }, updateWorkflow } = this.props;
    updateWorkflow(projectId, workflowId, { options: workflowDraft });
  }

  openAsPNG = () => {
    if (!this.workflowFunctions) return;
    this.workflowFunctions.openAsPNG();
  }

  render() {
    const { configDialog, toggleInProgress } = this.state;
    const {
      agentTypes,
      workflow,
      match: { params: { projectId, workflowId } },
      formatMessage,
    } = this.props;
    const workflowName = workflow.getIn(['attributes', 'name']) || '--';
    const workflowAttr = workflow.getIn(['attributes']);
    return (
      <div id="rappid-container">
        <BreadcrumbItem to={`/projects/${projectId}/workflows/${workflowId}`}>
          {workflowName}
        </BreadcrumbItem>
        <HeaderTitle>
          {formatMessage('Workflow')} {workflowName}
        </HeaderTitle>
        <BreadcrumbMenu>
          {workflowAttr ? (
            toggleInProgress ? <LoadingIndicator /> : (
              <Label className="switch switch-sm switch-default switch-text switch-pill switch-primary float-right">
                <Input
                  type="checkbox"
                  className="switch-input"
                  checked={workflowAttr.get('status') === 'active'}
                  onChange={() => this.toggleStatus(workflowAttr.get('id'), workflowAttr.get('status'))}
                />
                <span className="switch-label" data-on="On" data-off="Off" />
                <span className="switch-handle" />
              </Label>
            )
          ) : ''}
          {workflowAttr && (
            <ButtonLink className="no-border" handleClick={this.openAsPNG}>
              <i className="fa fa-download fa-lg mt-4" />
            </ButtonLink>
          )}
        </BreadcrumbMenu>
        <div className="rappid-body">
          <div className="stencil-container" />
          <div className="paper-container" />
          <div className="navigator-container" />
        </div>
        <ConfigDialog
          isOpen={!!configDialog.open}
          agentType={configDialog.agentType}
          schedules={agentTypes.toJS().schedules}
          defaultConfig={configDialog.defaultConfig}
          onUpdate={configDialog.callback}
          toggle={this.configDialogClose}
        />
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('workflow', 'workflow')(state, 'workflow'),
  ...selectState('filterType', 'filterType')(state, 'filterType'),
  ...selectState('agentType', 'agentTypes')(state, 'agentTypes'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  readWorkflow: (projectId, workflowId) => dispatch(readWorkflow(projectId, workflowId)),
  updateWorkflow: (projectId, workflowId, payload) =>
    dispatch(updateWorkflow(projectId, workflowId, payload)),
  listAgentTypes: projectId => dispatch(listAgentTypes(projectId)),
});

const scriptLoadedComponent = scriptLoader(
  [
    '/lib/jquery.js',
    '/lib/lodash.js',
    '/lib/backbone.js',
    '/lib/graphlib.core.js',
    '/lib/dagre.core.js',
  ],
  '/lib/rappid.min.js',
)(Workflow);

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(scriptLoadedComponent));
