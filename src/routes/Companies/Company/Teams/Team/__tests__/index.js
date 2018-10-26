import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';
import SidebarItems from 'components/SidebarItems';

import { Team } from '../index';

const { expect, shallow } = testHelper;

const testCompanyId = 'testCompany';
const testTeamId = 'testTeam';
const testProps = {
  match: {
    params: {
      companyId: testCompanyId,
      teamId: testTeamId,
    },
  },
  team: fromJS({
    attributes: {
      id: testTeamId,
      name: 'testName',
      query_type: 'queryType',
      selected_values: [],
    },
  }),
  filterType: fromJS({
    attributes: {},
  }),
  filterTypeRequesting: false,
  teamRequesting: false,
  readTeam: noop,
  updateTeam: noop,
  formatMessage: noop,
  readFilterType: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<Team {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find(BreadcrumbItem);
  expect(breadcrumb).toHaveProps({ to: `/companies/${testCompanyId}/teams/${testTeamId}` });
});

test('Renders a HeaderTitle', () => {
  const component = shallowRenderer();
  expect(component).toContain(HeaderTitle);
});

test('Renders a SidebarItems.', () => {
  const component = shallowRenderer();
  expect(component).toContain(SidebarItems);
});

test('Renders a Routes.', () => {
  const component = shallowRenderer();
  expect(component).toContain('Routes');
});
