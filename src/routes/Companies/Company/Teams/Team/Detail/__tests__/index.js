import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';

import { TeamDetail } from '../index';

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
  updateTeam: noop,
  readTeam: noop,
  formatMessage: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<TeamDetail {...props} />);

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

test('Renders a team description span and edit button when editable state is false', () => {
  const component = shallowRenderer();
  expect(component).toContain('span');
  expect(component).toHaveState({ editable: false });
});

test('editable state is changed when edit button is clicked', () => {
  const component = shallowRenderer();
  const editButton = component.find('Button[color="link"]');
  editButton.simulate('click');
  component.setState({ editable: true });
});

test('editable state is changed when cancel button is clicked', () => {
  const component = shallowRenderer();
  component.setState({ editable: true });
  const cancelButton = component.find('Button[color="secondary"]');
  cancelButton.simulate('click');
  component.setState({ editable: false });
});

test('updateTeam is called when submit button is clicked', () => {
  const updateTeam = createSpy();
  const component = shallowRenderer({
    ...testProps,
    updateTeam,
  });
  component.setState({ editable: true });
  const submitButton = component.find('Button[color="primary"]');
  const form = component.find('Form');
  form.simulate('submit', { preventDefault: noop, target: null });
  submitButton.simulate('click');
  expect(updateTeam).toHaveBeenCalled();
  component.setState({ editable: false });
});

test('description value is set when component is rendered', () => {
  const testDescription = 'testDescription';
  const component = shallowRenderer();
  component.setProps({ description: testDescription });
});

test('description value is set when component is rendered', () => {
  const testDescription = 'testDescription';
  const component = shallowRenderer();
  component.setProps({ description: testDescription });
});

test('BreadCrumbItem does not have a team name when there is not an attributes name', () => {
  const component = shallowRenderer({
    ...testProps,
    team: fromJS({}),
  });
  const breadCrumbItem = component.find('BreadcrumbItem');
  expect(breadCrumbItem.props().children).toNotInclude(testTeamName);
});
