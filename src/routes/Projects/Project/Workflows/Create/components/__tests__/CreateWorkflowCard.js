import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import { CreateWorkflowCard } from '../CreateWorkflowCard';

const { expect, shallow, createSpy } = testHelper;

const testProjectId = 'testProject';
const testProps = {
  projectId: testProjectId,
  history: {
    push: noop,
  },
  formatMessage: noop,
  addWorkflow: noop,
  createWorkflow: fromJS({ attributes: { name: 'workflow1' } }),
  createWorkflowError: fromJS([]),
  createWorkflowRequesting: false,
};

const shallowRenderer = (props = testProps) =>
  shallow(<CreateWorkflowCard {...props} />);

test('Renders a Card', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Card');
});

test('onCreate, addWorkflow is called.', () => {
  const addWorkflow = createSpy();
  const component = shallowRenderer({
    ...testProps,
    addWorkflow,
  });
  const form = component.find('Form');
  form.simulate('submit', { preventDefault: noop, target: null });
  expect(addWorkflow).toHaveBeenCalled();
});

test('redirected to workflow created after successful creation.', () => {
  const createdWorkflowId = 5;
  const push = createSpy();
  const component = shallowRenderer({
    ...testProps,
    createWorkflowRequesting: true,
  });
  component.setProps({
    createWorkflowRequesting: false,
    createWorkflow: fromJS({ id: createdWorkflowId }),
    history: { push },
  });
  expect(push).toHaveBeenCalledWith(`/projects/${testProjectId}/workflows/${createdWorkflowId}`);
});

test('does not redirect after creation is failed.', () => {
  const push = createSpy();
  const component = shallowRenderer({
    ...testProps,
    createWorkflowRequesting: true,
  });
  component.setProps({
    createWorkflowRequesting: false,
    createWorkflowError: fromJS(['somewhat error']),
    history: { push },
  });
  expect(push).toNotHaveBeenCalled();
});

test('does not redirect before creation is successful.', () => {
  const push = createSpy();
  const component = shallowRenderer({
    ...testProps,
    createWorkflowRequesting: true,
  });
  component.setProps({
    createWorkflowRequesting: true,
    history: { push },
  });
  expect(push).toNotHaveBeenCalled();
});
