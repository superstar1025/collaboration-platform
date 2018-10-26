import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';

import { Settings } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testCompanyId = 'testCompany';
const testTeamId = 'testTeam';
const testTeamName = 'testTeamName';
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
  history: { push: noop },
  teamRequesting: false,
  updateTeam: noop,
  removeTeam: noop,
  readTeam: noop,
  formatMessage: noop,
  setConfirmMessage: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<Settings {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('readTeam is called when component is rendered', () => {
  const readTeam = createSpy();
  shallowRenderer({
    ...testProps,
    readTeam,
  });
  expect(readTeam).toHaveBeenCalled(testCompanyId, testTeamId);
});

test('set team name and description when component is rendered', () => {
  const component = shallowRenderer();
  const teamName = 'testTeamName';
  const teamDescription = 'testTeamDescription' || '';
  component.setProps({ teamName, teamDescription });
});

test('Renders a BreadcrumbItem', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find(BreadcrumbItem);
  expect(breadcrumb).toHaveProps({ to: `/companies/${testCompanyId}/teams/${testTeamId}/settings` });
});

test('Renders a HeaderTitle', () => {
  const component = shallowRenderer();
  expect(component).toContain(HeaderTitle);
});

test('Renders a Select with proper values', () => {
  const component = shallowRenderer();
  expect(component).toContain('Select[name="visibility"]');
});

test('Update Team is called when form is submitted.', () => {
  const updateTeam = createSpy();
  const component = shallowRenderer({
    ...testProps,
    updateTeam,
  });
  const form = component.find('Form');
  form.simulate('submit', { preventDefault: noop, target: null });
  expect(updateTeam).toHaveBeenCalled();
});

test('change state teamName when Input with `name` is changed.', () => {
  const teamName = 'testName';
  const component = shallowRenderer({
    ...testProps,
    teamRequesting: true,
    team: fromJS({}),
  });
  const input = component.find('Input[name="name"]');
  input.simulate('change', { target: { value: teamName } });
  component.setState({ teamName });
  expect(component).toHaveState({ teamName });
});

test('change state teamDescription when Input with `description` is changed.', () => {
  const teamDescription = 'testTeamDescription';
  const component = shallowRenderer({
    ...testProps,
    teamRequesting: true,
    team: fromJS({}),
  });
  const input = component.find('Input[name="description"]');
  input.simulate('change', { target: { value: teamDescription } });
  component.setState({ teamDescription });
  expect(component).toHaveState({ teamDescription });
});

test('HeaderTitle does not have a team name when there is not an attributes name', () => {
  const component = shallowRenderer({
    ...testProps,
    team: fromJS({}),
  });
  const headerTitle = component.find('HeaderTitle');
  expect(headerTitle.props().children).toNotInclude(testTeamName);
});

test('removeTeam is called when delete button is clicked', () => {
  const setConfirmMessage = createSpy();
  const removeTeam = createSpy();
  const component = shallowRenderer({
    ...testProps,
    setConfirmMessage,
    removeTeam,
  });
  const deleteButton = component.find('Button[color="danger"]');
  deleteButton.simulate('click');
  expect(setConfirmMessage).toHaveBeenCalled();
  const { action } = setConfirmMessage.calls[0].arguments[0];
  action();
  expect(removeTeam).toHaveBeenCalledWith(testCompanyId, testTeamId);
});

test('Input does not have a team name when there is not an attributes name', () => {
  const component = shallowRenderer();
  const inputName = component.find('Input');
  expect(inputName.node.props.value).toNotInclude(testTeamName);
});
