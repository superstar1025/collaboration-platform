import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';

import { WorkflowsList } from '../index';
import WorkflowCard from '../components/WorkflowCard';

const { expect, shallow, createSpy } = testHelper;

const testProjectId = 'testProject';
const testProps = {
  formatMessage: () => 'something',
  workflows: fromJS([{}]),
  match: { params: { projectId: testProjectId } },
  workflowsRequesting: false,
  workflowsMeta: fromJS({ total: 12 }),
  project: fromJS({
    id: testProjectId,
    attributes: {
      id: testProjectId,
      name: 'testName',
    },
  }),
  listWorkflows: noop,
  removeWorkflow: noop,
  removeWorkflowRequesting: false,
  workflowRequesting: false,
  setConfirmMessage: noop,
  updateWorkflow: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<WorkflowsList {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbMenu', () => {
  const component = shallowRenderer();
  expect(component).toContain(BreadcrumbMenu);
});

test('Renders a HeaderTitle', () => {
  const component = shallowRenderer({
    ...testProps,
    project: fromJS({ attributes: { name: 'name' } }),
  });
  expect(component).toContain(HeaderTitle);
});

test('Renders a SearchBox', () => {
  const component = shallowRenderer();
  expect(component).toContain('SearchBox');
});

test('Renders a SmartItemGroup', () => {
  const component = shallowRenderer();
  expect(component).toContain('SmartItemGroup');
});

test('Renders a NotificationCard when there is no workflows', () => {
  const component = shallowRenderer({
    ...testProps,
    workflows: fromJS([]),
  });
  expect(component).toContain('NotificationCard');
});

test('listWorkflows is called.', () => {
  const listWorkflows = createSpy();
  shallowRenderer({
    ...testProps,
    listWorkflows,
  });
  expect(listWorkflows).toHaveBeenCalledWith(testProjectId, { 'page[number]': 1, search: '' });
});

test('listWorkflows is called when onPageChange of SmartItemGroup is called.', () => {
  const listWorkflows = createSpy();
  const pageIndex = 5;
  const search = 'testSearch';
  const component = shallowRenderer({
    ...testProps,
    listWorkflows,
  });
  component.setState({ search });
  const smartItemGroup = component.find('SmartItemGroup');
  smartItemGroup.props().onPageChange(pageIndex);
  expect(listWorkflows).toHaveBeenCalledWith(testProjectId, { 'page[number]': pageIndex, search });
});

test('ItemComponent should be a WorkflowCard.', () => {
  const component = shallowRenderer({
    ...testProps,
    project: fromJS({ // This is to test if it is fine when there is no name of project.
      id: testProjectId,
      attributes: {
        id: testProjectId,
      },
    }),
  });
  component.setState({ updatingWorkflowId: 'whatever' });
  const smartItemGroup = component.find('SmartItemGroup');
  const { ItemComponent } = smartItemGroup.props();
  const itemComponent = shallow(<ItemComponent data={{ attributes: { id: 'whatever' } }} />);
  expect(itemComponent).toBeA(WorkflowCard);
});

test('calls setConfirmMessage when trash icon is clicked and when action is called removeKeyword is triggered.', () => {
  const testId = 'testId';
  const setConfirmMessage = createSpy();
  const removeWorkflow = createSpy();
  const component = shallowRenderer({
    ...testProps,
    workflowsRequesting: true,
    workflows: fromJS([{ id: testId }]),
    setConfirmMessage,
    removeWorkflow,
  });
  const smartItemGroup = component.find('SmartItemGroup');
  const { remove } = smartItemGroup.props();
  remove(testId);
  expect(setConfirmMessage).toHaveBeenCalled();
  const { action } = setConfirmMessage.calls[0].arguments[0];
  action();
  expect(removeWorkflow).toHaveBeenCalledWith(testProjectId, testId);
});

test('listWorkflows is called when removeWorkflow request is successful.', () => {
  const listWorkflows = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listWorkflows,
    removeWorkflowRequesting: true,
  });
  component.setProps({ removeWorkflowRequesting: false });
  expect(listWorkflows).toHaveBeenCalled();
});

test('listWorkflows is not called when removeWorkflowRequesting was not true.', () => {
  const component = shallowRenderer({
    ...testProps,
    removeWorkflowRequesting: false,
  });
  const listWorkflows = createSpy();
  component.setProps({ listWorkflows });
  expect(listWorkflows).toNotHaveBeenCalled();
});

test('listWorkflows is called when onSearch is triggered.', () => {
  const listWorkflows = createSpy();
  const search = 'testValue';
  const component = shallowRenderer({
    ...testProps,
    listWorkflows,
  });
  const searchBox = component.find('SearchBox');
  searchBox.props().onSearch(search);
  expect(component).toHaveState({ search });
  expect(listWorkflows).toHaveBeenCalledWith(testProjectId, { 'page[number]': 1, search });
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
