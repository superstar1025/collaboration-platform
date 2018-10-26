import React from 'react';
import test from 'ava';

import { Teams } from '../index';

const { expect, shallow } = testHelper;

const testCompanyId = 'testCompany';

const testProps = {
  formatMessage: () => 'something',
  match: { params: { companyId: testCompanyId } },
};

const shallowRenderer = (props = testProps) =>
  shallow(<Teams {...props} />);

test('Renders a div.', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem with a proper prop `to`.', () => {
  const component = shallowRenderer();
  const breadcrumbItem = component.find('BreadcrumbItem');
  expect(breadcrumbItem).toHaveProps({ to: `/companies/${testCompanyId}/teams` });
});

test('Renders a Routes.', () => {
  const component = shallowRenderer();
  expect(component).toContain('Routes');
});
