import React from 'react';
import test from 'ava';
import { fromJS } from 'immutable';

import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';

import { CompanyDetail } from '../index';

const { expect, shallow } = testHelper;

const testCompanyId = 'testCompany';
const testProps = {
  formatMessage: () => 'something',
  match: { params: { companyId: testCompanyId } },
  company: fromJS({}),
};

const shallowRenderer = (props = testProps) =>
  shallow(<CompanyDetail {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Row');
});

test('Renders a BreadcrumbMenu', () => {
  const component = shallowRenderer();
  expect(component).toContain(BreadcrumbMenu);
});

test('Renders a HeaderTitle.', () => {
  const component = shallowRenderer();
  expect(component).toContain(HeaderTitle);
});
