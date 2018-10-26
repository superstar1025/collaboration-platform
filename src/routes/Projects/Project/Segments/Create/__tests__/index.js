import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';

import { SegmentCreate } from '../index';
import CreateSegmentCard from '../components/CreateSegmentCard';

const { expect, shallow, createSpy } = testHelper;

const testProjectId = 'testProject';
const testProps = {
  formatMessage: () => 'something',
  match: { params: { projectId: testProjectId } },
  history: { push: noop },
  listFilterTypes: noop,
  filterTypes: fromJS([]),
};

const shallowRenderer = (props = testProps) =>
  shallow(<SegmentCreate {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find(BreadcrumbItem);
  expect(breadcrumb).toHaveProps({ to: `/projects/${testProjectId}/segments/new` });
});

test('Renders a HeaderTitle', () => {
  const component = shallowRenderer();
  expect(component).toContain(HeaderTitle);
});

test('Renders a CreateSegmentCard', () => {
  const component = shallowRenderer();
  expect(component).toContain(CreateSegmentCard);
});

test('listFilterTypes is called', () => {
  const listFilterTypes = createSpy();
  shallowRenderer({
    ...testProps,
    listFilterTypes,
  });
  expect(listFilterTypes).toHaveBeenCalledWith(testProjectId);
});
