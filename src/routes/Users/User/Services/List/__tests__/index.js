import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';

import { ServicesList } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testUserId = 'testUser';
const testUserMeId = 'testUserMe';
const testProps = {
  formatMessage: () => 'something',
  services: fromJS([{}]),
  match: { params: { userId: testUserId } },
  servicesRequesting: false,
  servicesMeta: fromJS({ total: 12 }),
  user: fromJS({
    id: testUserId,
    attributes: {
      id: testUserId,
    },
  }),
  currentUser: fromJS({
    id: testUserMeId,
    name: 'testUserMe',
  }),
  listServices: noop,
  removeService: noop,
  removeServiceRequesting: false,
  createService: noop,
  createServiceRequesting: false,
  setConfirmMessage: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<ServicesList {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbMenu', () => {
  const component = shallowRenderer();
  expect(component).toContain(BreadcrumbMenu);
});

test('Renders a HeaderTitle', () => {
  const component = shallowRenderer({
    ...testProps,
    user: fromJS({ attributes: { name: 'name' } }),
  });
  expect(component).toContain(HeaderTitle);
});

test('Renders a SearchBox', () => {
  const component = shallowRenderer();
  expect(component).toContain('SearchBox');
});

test('Renders a SmartTable', () => {
  const component = shallowRenderer();
  expect(component).toContain('SmartTable');
});

test('Renders a NotificationCard when there is no services', () => {
  const component = shallowRenderer({
    ...testProps,
    services: fromJS([]),
  });
  expect(component).toContain('NotificationCard');
});

test('listServices is called.', () => {
  const listServices = createSpy();
  shallowRenderer({
    ...testProps,
    listServices,
  });
  expect(listServices).toHaveBeenCalledWith(testUserId, { 'page[number]': 1, search: '' });
});

test('listServices is called when onPageChange of SmartTable is called.', () => {
  const listServices = createSpy();
  const pageIndex = 5;
  const search = 'testSearch';
  const component = shallowRenderer({
    ...testProps,
    listServices,
  });
  component.setState({ search });
  const smartTable = component.find('SmartTable');
  const { onPageChange } = smartTable.props();
  onPageChange(pageIndex);
  expect(listServices).toHaveBeenCalledWith(testUserId, { 'page[number]': pageIndex, search });
});

test('calls setConfirmMessage when trash icon is clicked and when action is called removeService is triggered.', () => {
  const testId = 'testId';
  const setConfirmMessage = createSpy();
  const removeService = createSpy();
  const component = shallowRenderer({
    ...testProps,
    servicesRequesting: false,
    services: fromJS([{ id: testId }]),
    setConfirmMessage,
    removeService,
  });
  const smartTable = component.find('SmartTable');
  const { fields } = smartTable.props();
  const actionField = fields[fields.length - 1];
  const trashIcon = shallow(actionField.render(testId, { id: testId }));
  trashIcon.simulate('click');
  expect(setConfirmMessage).toHaveBeenCalled();
  const { action } = setConfirmMessage.calls[0].arguments[0];
  action();
  expect(removeService).toHaveBeenCalledWith(testUserId, testId);
});

test('listServices is called when createService request is successful.', () => {
  const listServices = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listServices,
    createServiceRequesting: true,
  });
  component.setProps({ createServiceRequesting: false });
  expect(listServices).toHaveBeenCalled();
});

test('listServices is not called when createServiceRequesting was not true.', () => {
  let listServices = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listServices,
    createServiceRequesting: false,
  });
  listServices = createSpy();
  component.setProps({ listServices });
  expect(listServices).toNotHaveBeenCalled();
});

test('listServices is called when removeService request is successful.', () => {
  const listServices = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listServices,
    removeServiceRequesting: true,
  });
  component.setProps({ removeServiceRequesting: false });
  expect(listServices).toHaveBeenCalled();
});

test('listServices is not called when removeServiceRequesting was not true.', () => {
  const component = shallowRenderer({
    ...testProps,
    removeServiceRequesting: false,
  });
  const listServices = createSpy();
  component.setProps({ listServices });
  expect(listServices).toNotHaveBeenCalled();
});

test('listServices is called when onSearch is triggered.', () => {
  const listServices = createSpy();
  const search = 'testValue';
  const component = shallowRenderer({
    ...testProps,
    listServices,
  });
  const searchBox = component.find('SearchBox');
  searchBox.props().onSearch(search);
  expect(component).toHaveState({ search });
  expect(listServices).toHaveBeenCalledWith(testUserId, { 'page[number]': 1, search });
});

test('listServices is called with proper userId, if userId is me.', () => {
  const listServices = createSpy();
  shallowRenderer({
    ...testProps,
    listServices,
    match: { params: { userId: 'me' } },
  });
  expect(listServices).toHaveBeenCalledWith('me', { 'page[number]': 1, search: '' });
});

// values vary from one render to another.
const testValues = [
  'google',
];

test('Renders fields without problem', () => {
  const component = shallowRenderer();
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
