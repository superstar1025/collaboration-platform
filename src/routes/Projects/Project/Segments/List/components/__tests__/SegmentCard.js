import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import { SegmentCard } from '../SegmentCard';

const { expect, shallow, createSpy } = testHelper;

const testProjectId = 'testProject';
const testSegmentId = 'testProject';
const testProps = {
  data: { attributes: { id: testSegmentId, name: 'testName' } },
  projectId: testProjectId,
  formatMessage: noop,
  remove: noop,
  ghost: false,
};

const shallowRenderer = (props = testProps) =>
  shallow(<SegmentCard {...props} />);

test('Renders a Card', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Card');
});

test('Renders two CardTexts', () => {
  const component = shallowRenderer();
  const cardTexts = component.find('CardText');
  expect(cardTexts.length).toBe(2);
});

test('Renders a LoadingIndicator when ghost is true.', () => {
  const component = shallowRenderer({
    ...testProps,
    ghost: true,
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
  expect(remove).toHaveBeenCalledWith(testSegmentId);
});
