import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import { CreateSegmentCard } from '../CreateSegmentCard';

const { expect, shallow, createSpy } = testHelper;

const testProjectId = 'testProject';
const testProps = {
  projectId: testProjectId,
  history: {
    push: noop,
  },
  formatMessage: noop,
  filterTypes: fromJS([
    { attributes: { name: 'filter1' } },
    { attributes: { name: 'filter2' } },
    { attributes: { name: 'filter3' } },
  ]),
  addSegment: noop,
  createSegment: fromJS({ attributes: { name: 'segment1' } }),
  createSegmentError: fromJS([]),
  createSegmentRequesting: false,
};

const shallowRenderer = (props = testProps) =>
  shallow(<CreateSegmentCard {...props} />);

test('Renders a Card', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Card');
});

test('onCreate, addSegment is called.', () => {
  const addSegment = createSpy();
  const component = shallowRenderer({
    ...testProps,
    addSegment,
  });
  const form = component.find('Form');
  form.simulate('submit', { preventDefault: noop, target: null });
  expect(addSegment).toHaveBeenCalled();
});

test('redirected to segment created after successful creation.', () => {
  const createdSegmentId = 3;
  const push = createSpy();
  const component = shallowRenderer({
    ...testProps,
    createSegmentRequesting: true,
  });
  component.setProps({
    createSegmentRequesting: false,
    createSegment: fromJS({ id: createdSegmentId }),
    history: { push },
  });
  expect(push).toHaveBeenCalledWith(`/projects/${testProjectId}/segments/${createdSegmentId}`);
});

test('does not redirect after creation is failed.', () => {
  const push = createSpy();
  const component = shallowRenderer({
    ...testProps,
    createSegmentRequesting: true,
  });
  component.setProps({
    createSegmentRequesting: false,
    createSegmentError: fromJS(['somewhat error']),
    history: { push },
  });
  expect(push).toNotHaveBeenCalled();
});

test('does not redirect before creation is successful.', () => {
  const push = createSpy();
  const component = shallowRenderer({
    ...testProps,
    createSegmentRequesting: true,
  });
  component.setProps({
    createSegmentRequesting: true,
    history: { push },
  });
  expect(push).toNotHaveBeenCalled();
});
