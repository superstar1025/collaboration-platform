import React from 'react';
import test from 'ava';
import { fromJS } from 'immutable';
import { noop } from 'lodash';

import BreadcrumbItem from 'components/BreadcrumbItem';

import { Service } from '../Service';

const { expect, shallow, createSpy } = testHelper;

const testUserId = 'testUser';
const testServiceId = 'testService';
const testName = 'testServiceName';
const testProps = {
  match: { params: { userId: testUserId, serviceId: testServiceId } },
  service: fromJS({ attributes: { name: testName } }),
  readService: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<Service {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find(BreadcrumbItem);
  expect(breadcrumb).toHaveProps({ to: `/users/${testUserId}/authorizations/${testServiceId}` });
});

test('readService is called.', () => {
  const readService = createSpy();
  shallowRenderer({
    ...testProps,
    readService,
  });
  expect(readService).toHaveBeenCalledWith(testUserId, testServiceId);
});

test('Renders a the name of service', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find(BreadcrumbItem);
  expect(breadcrumb.props().children).toInclude(testName);
});
