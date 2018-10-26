import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';

import { TeamsList } from '../index';
import AddTeamModal from '../components/AddTeamModal';

const { expect, shallow, createSpy } = testHelper;
const testCompanyId = 'testCompany';
const testProps = {
  formatMessage: () => 'something',
  match: { params: { companyId: testCompanyId } },
  teamsMeta: fromJS({}),
  company: fromJS({}),
  teams: fromJS([]),
  listTeams: noop,
  createTeam: noop,
  setConfirmMessage: noop,
  removeTeam: noop,
  createTeamRequesting: false,
  removeTeamRequesting: false,
  teamsRequesting: false,
};

const shallowRenderer = (props = testProps) =>
  shallow(<TeamsList {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbMenu.', () => {
  const component = shallowRenderer();
  expect(component).toContain(BreadcrumbMenu);
});

test('Renders a HeaderTitle.', () => {
  const component = shallowRenderer();
  expect(component).toContain(HeaderTitle);
});

test('Renders a AddTeamModal.', () => {
  const component = shallowRenderer();
  expect(component).toContain(AddTeamModal);
});

test('Renders a SmartTable when prop teams is not empty.', () => {
  const component = shallowRenderer({
    ...testProps,
    teams: fromJS([{}]),
  });
  expect(component).toContain('SmartTable');
});

test('Renders a NotificationCard when prop teams is empty.', () => {
  const component = shallowRenderer();
  expect(component).toContain('NotificationCard');
});

test('onAddTeams of AddTeamModal triggers createTeam with proper params.', () => {
  const createTeam = createSpy();
  const component = shallowRenderer({
    ...testProps,
    createTeam,
  });
  const testTeams = ['whatever', 'I do not know.'];
  const modal = component.find(AddTeamModal);
  modal.props().onSave(testTeams);
  expect(createTeam).toHaveBeenCalledWith(testCompanyId, testTeams);
});

test('listTeams is called.', () => {
  const listTeams = createSpy();
  shallowRenderer({
    ...testProps,
    listTeams,
  });
  expect(listTeams).toHaveBeenCalled();
});

test('listTeams is called when createTeam request is successful.', () => {
  const listTeams = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listTeams,
    createTeamRequesting: true,
  });
  component.setProps({ createTeamRequesting: false });
  expect(listTeams).toHaveBeenCalled();
});

test('listTeams is not called when createTeamReqesting was not true.', () => {
  let listTeams = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listTeams,
    createTeamRequesting: false,
  });
  listTeams = createSpy();
  component.setProps({ listTeams });
  expect(listTeams).toNotHaveBeenCalled();
});

test('listTeams is called when removeTeam request is successful.', () => {
  const listTeams = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listTeams,
    removeTeamRequesting: true,
  });
  component.setProps({ removeTeamRequesting: false });
  expect(listTeams).toHaveBeenCalled();
});

test('listTeams is not called when removeTeamRequesting was not true.', () => {
  const component = shallowRenderer({
    ...testProps,
    removeTeamRequesting: false,
  });
  const listTeams = createSpy();
  component.setProps({ listTeams });
  expect(listTeams).toNotHaveBeenCalled();
});

test('AddTeamModal is open when second buttonLink of breadcrumbmenu is clicked.', () => {
  const component = shallowRenderer();
  const secondButtonLink = component.find(BreadcrumbMenu).find('ButtonLink').at(1);
  secondButtonLink.props().handleClick();
  const addTeamModal = component.find(AddTeamModal);
  expect(addTeamModal).toHaveProps({ isOpen: true });
});

test('onSearch triggers a list state function with current companyId as a param.', () => {
  const listTeams = createSpy();
  const search = 'testValue';
  const component = shallowRenderer({
    ...testProps,
    listTeams,
  });
  const searchBox = component.find('SearchBox');
  searchBox.props().onSearch(search);
  expect(listTeams).toHaveBeenCalledWith(testCompanyId, { 'page[number]': 1, search });
});

test('listTeams is called when loadPage is triggered.', () => {
  const listTeams = createSpy();
  const pageIndex = 5;
  const search = 'testSearch';
  const component = shallowRenderer({
    ...testProps,
    listTeams,
    createTeamRequesting: true,
    teamsRequesting: true,
  });
  component.setState({ search });
  const smartTable = component.find('SmartTable');
  smartTable.props().onPageChange(pageIndex);
  expect(listTeams).toHaveBeenCalled(testCompanyId);
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
