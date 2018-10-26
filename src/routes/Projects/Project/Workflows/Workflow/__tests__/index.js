import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import { Workflow } from '../index';
import * as libMain from '../lib/main.js';
import * as libThemePicker from '../lib/theme-picker.js';
import * as libShapes from '../lib/joint.shapes.app.js';

// pre configuration for rappidInit
class MainView {
  graph = {
    fromJSON: noop,
  }
}
libMain.default = noop;
libThemePicker.default = noop;
libShapes.default = noop;
window.joint = { setTheme: noop };
window.App = { MainView, config: { sampleGraphs: { emergencyProcedure: '{}' } } };

const { expect, shallow, createSpy } = testHelper;

const testProjectId = 'testProject';
const testWorkflowId = 'testWorkflow';
const testWorkflow = fromJS({
  attributes: { options: {}, id: testWorkflowId, status: false }, id: testWorkflowId,
});
const testProps = {
  match: {
    params: {
      projectId: testProjectId,
      workflowId: testWorkflowId,
    },
  },
  readWorkflow: noop,
  listAgentTypes: noop,
  agentTypes: fromJS({
    agents: [
      { name: 'whatever', config: {} },
    ],
    schedules: ['schedule_1', 'schedule_2'],
  }),
  workflow: testWorkflow,
  workflowMeta: fromJS({ errors: ['testError'] }),
  isScriptLoadSucceed: false,
  updateWorkflow: noop,
  formatMessage: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<Workflow {...props} />);

test('runs readWorkflow and listAgentTypes initially', () => {
  const readWorkflow = createSpy();
  const listAgentTypes = createSpy();
  shallowRenderer({
    ...testProps,
    readWorkflow,
    listAgentTypes,
  });
  expect(readWorkflow).toHaveBeenCalledWith(testProjectId, testWorkflowId);
  expect(listAgentTypes).toHaveBeenCalledWith(testProjectId);
});

test('ConfigDialog is open when configClicked is called and closed when configDialogClose is called', () => {
  const component = shallowRenderer();
  const instance = component.instance();
  instance.configClicked();
  expect(component).toContain('ConfigDialog[isOpen=true]');
  instance.configDialogClose();
  expect(component).toContain('ConfigDialog[isOpen=false]');
});

test('saveWorkflow triggers updateWorkflow', () => {
  const updateWorkflow = createSpy();
  const testWorkflowDraft = { whatever: 'It does not matter what data it is.' };
  const component = shallowRenderer({
    ...testProps,
    updateWorkflow,
  });
  component.instance().saveWorkflow(testWorkflowDraft);
  expect(updateWorkflow).toHaveBeenCalledWith(
    testProjectId, testWorkflowId, { options: testWorkflowDraft },
  );
});

test('rappidInit is called when script is loaded and workflow is not empty', () => {
  const component = shallowRenderer();
  const rappidInit = createSpy();
  component.instance().rappidInit = rappidInit;
  component.setProps({ isScriptLoadSucceed: true, workflow: testWorkflow });
  expect(rappidInit).toHaveBeenCalled();
});

test('setTheme is not called when loaded is true', () => {
  const component = shallowRenderer();
  const setTheme = createSpy();
  window.joint = { setTheme };
  component.instance().loaded = true;
  component.setProps({ isScriptLoadSucceed: true, workflow: testWorkflow });
  expect(setTheme).toNotHaveBeenCalled();
});

test('this.showErrors is not called when workflow is changed', () => {
  const component = shallowRenderer();
  const showErrors = createSpy();
  component.instance().showErrors = showErrors;
  component.instance().loaded = false;
  component.setProps({
    isScriptLoadSucceed: true,
    workflow: fromJS({ attributes: { options: {} } }),
  });
  expect(showErrors).toHaveBeenCalled();
});

test('this.showErrors triggers this.workflowFunctions.showErrors', () => {
  const component = shallowRenderer();
  const testError = ['whatever'];
  const workflowMeta = fromJS({ errors: testError });
  const showErrors = createSpy();
  const instance = component.instance();
  instance.workflowFunctions = { showErrors };
  instance.showErrors({ workflowMeta });
  expect(showErrors).toHaveBeenCalledWith(testError);
});

test('this.showErrors does not trigger this.workflowFunctions.showErrors when this.workflowFunctions is empty', () => {
  const component = shallowRenderer();
  const testError = ['whatever'];
  const workflowMeta = fromJS({ errors: testError });
  const showErrors = createSpy();
  const instance = component.instance();
  instance.showErrors({ workflowMeta });
  expect(showErrors).toNotHaveBeenCalled();
});

test('loaded is set true when it is false and this.showErrors is called', () => {
  const component = shallowRenderer();
  const instance = component.instance();
  const showErrors = createSpy();
  const workflowMeta = fromJS({ errors: ['whatever'] });
  instance.showErrors = showErrors;
  instance.loaded = false;
  instance.rappidInit({
    agentTypes: fromJS({}),
    workflow: testWorkflow,
    workflowMeta,
  });
  expect(instance.loaded).toBe(true);
  expect(showErrors).toHaveBeenCalledWith({ workflowMeta });
});

test('this.showErrors is not alled when workflowMeta has no error', () => {
  const component = shallowRenderer();
  const instance = component.instance();
  const showErrors = createSpy();
  instance.showErrors = showErrors;
  instance.loaded = false;
  instance.rappidInit({
    agentTypes: fromJS({}),
    workflow: testWorkflow,
    workflowMeta: fromJS({}),
  });
  expect(showErrors).toNotHaveBeenCalled();
});

test('Renders a BreadcrumbItem', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find('BreadcrumbItem');
  expect(breadcrumb).toHaveProps({ to: `/projects/${testProjectId}/workflows/${testWorkflowId}` });
});

test('Renders a HeaderTitle', () => {
  const component = shallowRenderer();
  expect(component).toContain('HeaderTitle');
});

test('toggleStatus calls updateWorkflow to make status draft when it is active', () => {
  const updateWorkflow = createSpy();
  const testWorkflowId = 'testWorkflow';
  const component = shallowRenderer({
    ...testProps,
    workflows: fromJS([{ id: testWorkflowId }]),
    updateWorkflow,
  });
  const instance = component.instance();
  instance.toggleStatus(testWorkflowId, 'active');
  expect(updateWorkflow).toHaveBeenCalledWith(testProjectId, testWorkflowId, { status: 'draft' });
});

test('toggleStatus calls updateWorkflow to make status active when it is not active', () => {
  const updateWorkflow = createSpy();
  const testWorkflowId = 'testWorkflow';
  const component = shallowRenderer({
    ...testProps,
    workflows: fromJS([{ id: testWorkflowId }]),
    updateWorkflow,
  });
  const instance = component.instance();
  instance.toggleStatus(testWorkflowId, 'whatever');
  expect(updateWorkflow).toHaveBeenCalledWith(testProjectId, testWorkflowId, { status: 'active' });
});

test('this.openAsPNG triggers this.workflowFunctions.openAsPNG', () => {
  const component = shallowRenderer();
  const openAsPNG = createSpy();
  const instance = component.instance();
  instance.workflowFunctions = { openAsPNG };
  instance.openAsPNG();
  expect(openAsPNG).toHaveBeenCalled();
});

test('this.openAsPNG does not trigger this.workflowFunctions.openAsPNG when this.workflowFunctions is empty', () => {
  const component = shallowRenderer();
  const openAsPNG = createSpy();
  const instance = component.instance();
  instance.openAsPNG();
  expect(openAsPNG).toNotHaveBeenCalled();
});

test('input change triggers this.toggleStatus', () => {
  const component = shallowRenderer();
  const toggleStatus = createSpy();
  component.instance().toggleStatus = toggleStatus;
  const input = component.find('BreadcrumbMenu Input');
  input.simulate('change');
  expect(toggleStatus).toHaveBeenCalledWith(testWorkflowId, false);
});

test('renders loading indicator when toggleInProgress is true', () => {
  const component = shallowRenderer();
  component.setState({ toggleInProgress: true });
  expect(component).toContain('LoadingIndicator');
});

test('if workflow is not loaded, Label is not rendered', () => {
  const workflow = fromJS({});
  const component = shallowRenderer({
    ...testProps,
    workflow,
  });
  expect(component).toNotContain('Label');
});
