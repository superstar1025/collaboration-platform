import React from 'react';
import test from 'ava';
import { fromJS } from 'immutable';
import { noop } from 'lodash';

import { Company } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testCompanyId = 'testCompanyId';
const testCompanyName = 'test Company';
const testProps = {
  formatMessage: () => 'something',
  match: { params: { companyId: testCompanyId } },
  readCompany: noop,
  company: fromJS({ attributes: { name: testCompanyName } }),
};

const shallowRenderer = (props = testProps) =>
  shallow(<Company {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem with a proper prop `to`.', () => {
  const component = shallowRenderer();
  const breadcrumbItem = component.find('BreadcrumbItem');
  expect(breadcrumbItem).toHaveProps({ to: `/companies/${testCompanyId}` });
});

test('Renders a Routes.', () => {
  const component = shallowRenderer();
  expect(component).toContain('Routes');
});

test('readCompany is called with proper param.', () => {
  const readCompany = createSpy();
  shallowRenderer({
    ...testProps,
    readCompany,
  });
  expect(readCompany).toHaveBeenCalled(testCompanyId);
});

test('BreadCrumbItem has company name when there is attributes name', () => {
  const component = shallowRenderer();
  const breadCrumbItem = component.find('BreadcrumbItem');
  expect(breadCrumbItem.props().children).toInclude(testCompanyName);
});

test('BreadCrumbItem does not have a company name when there is not an attributes name', () => {
  const component = shallowRenderer({
    ...testProps,
    company: fromJS({}),
  });
  const breadCrumbItem = component.find('BreadcrumbItem');
  expect(breadCrumbItem.props().children).toNotInclude(testCompanyName);
});
