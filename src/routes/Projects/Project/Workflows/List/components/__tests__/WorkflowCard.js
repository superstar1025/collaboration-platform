import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import { WorkflowCard } from '../WorkflowCard';

const { expect, shallow, createSpy } = testHelper;

const testProjectId = 'testProject';
const testWorkflowId = 'testProject';
const testWorkflowStatus = 'draft';
const testProps = {
  data: { attributes: { id: testWorkflowId, name: 'testName', status: testWorkflowStatus } },
  projectId: testProjectId,
  formatMessage: noop,
  remove: noop,
  ghost: false,
  toggleStatus: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<WorkflowCard {...props} />);

test('Renders a Card', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Card');
});

test('Renders two CardTexts', () => {
  const component = shallowRenderer();
  const cardTexts = component.find('CardText');
  expect(cardTexts.length).toBe(2);
});

test('Renders a LoadingIndicator when ghost is true and status is active.', () => {
  const component = shallowRenderer({
    ...testProps,
    ghost: true,
    data: { attributes: { id: testWorkflowId, name: 'testName', status: 'active' } },
  });
  expect(component).toContain('LoadingIndicator');
});

test('remove is called when trash icon is clicked.', () => {
  const remove = createSpy();
  const component = shallowRenderer({
    ...testProps,
    remove,
  });
  const iconTrash = component.find('i.fa-trash');
  iconTrash.simulate('click');
  expect(remove).toHaveBeenCalledWith(testWorkflowId);
});

test('toggleStatus is called when switch is clicked.', () => {
  const toggleStatus = createSpy();
  const component = shallowRenderer({
    ...testProps,
    toggleStatus,
  });
  const switchInput = component.find('.switch-input');
  switchInput.simulate('change');
  expect(toggleStatus).toHaveBeenCalledWith(testWorkflowId, testWorkflowStatus);
});
