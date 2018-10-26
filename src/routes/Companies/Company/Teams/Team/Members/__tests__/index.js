import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';

import { Members } from '../index';

const { expect, shallow, createSpy } = testHelper;

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
    },
  }),
  teamRequesting: false,
  updateTeam: noop,
  formatMessage: noop,
  members: fromJS([]),
  users: fromJS([]),
  listMembers: noop,
  listUsers: noop,
  createMember: noop,
  membersRequesting: false,
  createMemberRequesting: false,
  membersMeta: fromJS({}),
};

const shallowRenderer = (props = testProps) =>
  shallow(<Members {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find(BreadcrumbItem);
  expect(breadcrumb).toHaveProps({ to: `/companies/${testCompanyId}/teams/${testTeamId}/members` });
});

test('Renders a HeaderTitle', () => {
  const component = shallowRenderer();
  expect(component).toContain(HeaderTitle);
});

test('listMembers is called.', () => {
  const listMembers = createSpy();
  shallowRenderer({
    ...testProps,
    listMembers,
  });
  expect(listMembers).toHaveBeenCalled();
});

test('listMembers is not called when createMemberReqesting was not true.', () => {
  let listMembers = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listMembers,
    createTeamRequesting: false,
  });
  listMembers = createSpy();
  component.setProps({ listMembers });
  expect(listMembers).toNotHaveBeenCalled();
});

test('Renders a SmartTable when prop member is not empty.', () => {
  const component = shallowRenderer({
    ...testProps,
    members: fromJS([{}]),
  });
  expect(component).toContain('SmartTable');
});

// values vary from one render to another.
const testValues = [
  'whatever',
  ['whatever'],
];

test('Renders fields without problem', () => {
  const component = shallowRenderer({
    ...testProps,
    teams: fromJS([{}]),
    membersRequesting: true,
    createMemberRequesting: true,
  });
  const smartTable = component.find('SmartTable');
  const { fields } = smartTable.props();
  fields.forEach((field, index) => {
    if (!field.render) return;
    const renderedComponent = shallow(
      <div>
        {field.render(testValues[index], { id: 'rowId' })}
      </div>,
    );
    expect(renderedComponent).toBeA('div');
  });
});

test('listMembers is called when loadPage is triggered.', () => {
  const listMembers = createSpy();
  const pageIndex = 5;
  const search = 'testSearch';
  const component = shallowRenderer({
    ...testProps,
    listMembers,
    createMemberRequesting: true,
    membersRequesting: true,
  });
  component.setState({ search });
  const smartTable = component.find('SmartTable');
  smartTable.props().onPageChange(pageIndex);
  expect(listMembers).toHaveBeenCalled(testCompanyId, testTeamId);
});

test('listMembers is called when onSearch is called.', () => {
  const listMembers = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listMembers,
  });
  const searchBox = component.find('SearchBox');
  searchBox.props().onSearch();
  expect(listMembers).toHaveBeenCalled(testCompanyId, testTeamId);
});

test('createMember is called when onSave of dialog is called.', () => {
  const createMember = createSpy();
  const testPayload = { test: 'whatever' };
  const component = shallowRenderer({
    ...testProps,
    createMember,
  });
  const searchBox = component.find('AddMembershipModal');
  searchBox.props().onSave(testPayload);
  expect(createMember).toHaveBeenCalled(testCompanyId, testTeamId, testPayload);
});
