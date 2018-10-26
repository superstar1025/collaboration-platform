import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbMenu from 'components/BreadcrumbMenu';

import { CompaniesList } from '../index';
import CreateCompanyModal from '../components/CreateCompanyModal';
import CompanyCard from '../components/CompanyCard';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  formatMessage: () => 'something',
  listCompanies: noop,
  companies: fromJS([{}]),
  companiesRequesting: false,
  companiesMeta: fromJS({ total: 12 }),
  createCompany: noop,
  createCompanyRequesting: false,
  removeCompany: noop,
  removeCompanyRequesting: false,
  setConfirmMessage: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<CompaniesList {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbMenu.', () => {
  const component = shallowRenderer();
  expect(component).toContain(BreadcrumbMenu);
});

test('Renders a SearchBox', () => {
  const component = shallowRenderer();
  expect(component).toContain('SearchBox');
});

test('Renders a SmartItemGroup', () => {
  const component = shallowRenderer();
  expect(component).toContain('SmartItemGroup');
});

test('Renders NotificationCard when there is no companies', () => {
  const component = shallowRenderer({
    ...testProps,
    companies: fromJS([]),
  });
  expect(component).toContain('NotificationCard');
});

test('listCompanies is called.', () => {
  const listCompanies = createSpy();
  shallowRenderer({
    ...testProps,
    listCompanies,
  });
  expect(listCompanies).toHaveBeenCalledWith();
});

test('listCompanies is called when onPageChange of SmartItemGroup is called.', () => {
  const listCompanies = createSpy();
  const pageIndex = 5;
  const search = 'testSearch';
  const component = shallowRenderer({
    ...testProps,
    listCompanies,
  });
  component.setState({ search });
  const smartItemGroup = component.find('SmartItemGroup');
  smartItemGroup.props().onPageChange(pageIndex);
  expect(listCompanies).toHaveBeenCalledWith();
});

test('ItemComponent should be a CompanyCard.', () => {
  const component = shallowRenderer();
  const smartItemGroup = component.find('SmartItemGroup');
  const { ItemComponent } = smartItemGroup.props();
  expect(ItemComponent).toBe(CompanyCard);
});

test('calls setConfirmMessage when trash icon is clicked and when action is called removeCompany is triggered.', () => {
  const testId = 'testId';
  const setConfirmMessage = createSpy();
  const removeCompany = createSpy();
  const component = shallowRenderer({
    ...testProps,
    companiesRequesting: false,
    companies: fromJS([{ id: testId }]),
    setConfirmMessage,
    removeCompany,
  });
  const smartItemGroup = component.find('SmartItemGroup');
  const { remove } = smartItemGroup.props();
  remove(testId);
  expect(setConfirmMessage).toHaveBeenCalled();
  const { action } = setConfirmMessage.calls[0].arguments[0];
  action();
  expect(removeCompany).toHaveBeenCalledWith(testId);
});

test('listCompanies is called when removeCompany request is successful.', () => {
  const listCompanies = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listCompanies,
    removeCompanyRequesting: true,
  });
  component.setProps({ removeCompanyRequesting: false });
  expect(listCompanies).toHaveBeenCalled();
});

test('listCompanies is called when createCompany request is successful.', () => {
  const listCompanies = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listCompanies,
    createCompanyRequesting: true,
  });
  component.setProps({ createCompanyRequesting: false });
  expect(listCompanies).toHaveBeenCalled();
});

test('listCompanies is not called when createCompanyRequesting/removeCompanyRequesting was not true.', () => {
  const component = shallowRenderer({
    ...testProps,
    createCompanyRequesting: false,
    removeCompanyRequesting: false,
  });
  const listCompanies = createSpy();
  component.setProps({ listCompanies });
  expect(listCompanies).toNotHaveBeenCalled();
});

test('Renders a CreateCompanyModal when toggleCreateModal is called.', () => {
  const component = shallowRenderer();
  component.instance().toggleCreateModal();
  expect(component).toContain(CreateCompanyModal);
});

test('Calls createCompany when onSave is called.', () => {
  const createCompany = createSpy();
  const component = shallowRenderer({
    ...testProps,
    createCompany,
  });
  component.instance().toggleCreateModal();
  const createCompanyModal = component.find(CreateCompanyModal);
  const company = { id: 'whatever' };
  createCompanyModal.props().onSave(company);
  expect(createCompany).toHaveBeenCalledWith(company);
});

test('onSearch triggers a list state function with search value.', () => {
  const listCompanies = createSpy();
  const search = 'testValue';
  const component = shallowRenderer({
    ...testProps,
    listCompanies,
  });
  const searchBox = component.find('SearchBox');
  searchBox.props().onSearch(search);
  expect(listCompanies).toHaveBeenCalledWith({ 'page[number]': 1, search });
});
