import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';

import { ProjectsList } from '../index';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectCard from '../components/ProjectCard';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  formatMessage: () => 'something',
  listProjects: noop,
  projects: fromJS([{}]),
  projectsRequesting: false,
  projectsMeta: fromJS({ total: 12 }),
  createProject: noop,
  createProjectRequesting: false,
  removeProject: noop,
  removeProjectRequesting: false,
  setConfirmMessage: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<ProjectsList {...props} />);

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

test('Renders a SearchBox', () => {
  const component = shallowRenderer();
  expect(component).toContain('SearchBox');
});

test('Renders a SmartItemGroup', () => {
  const component = shallowRenderer();
  expect(component).toContain('SmartItemGroup');
});

test('Renders NotificationCard when there is no projects', () => {
  const component = shallowRenderer({
    ...testProps,
    projects: fromJS([]),
  });
  expect(component).toContain('NotificationCard');
});

test('listProjects is called.', () => {
  const listProjects = createSpy();
  shallowRenderer({
    ...testProps,
    listProjects,
  });
  expect(listProjects).toHaveBeenCalledWith({ 'page[number]': 1, search: '' });
});

test('listProjects is called when onPageChange of SmartItemGroup is called.', () => {
  const listProjects = createSpy();
  const pageIndex = 5;
  const search = 'testSearch';
  const component = shallowRenderer({
    ...testProps,
    listProjects,
  });
  component.setState({ search });
  const smartItemGroup = component.find('SmartItemGroup');
  smartItemGroup.props().onPageChange(pageIndex);
  expect(listProjects).toHaveBeenCalledWith({ 'page[number]': pageIndex, search });
});

test('ItemComponent should be a ProjectCard.', () => {
  const component = shallowRenderer();
  const smartItemGroup = component.find('SmartItemGroup');
  const { ItemComponent } = smartItemGroup.props();
  expect(ItemComponent).toBe(ProjectCard);
});

test('calls setConfirmMessage when trash icon is clicked and when action is called removeProject is triggered.', () => {
  const testId = 'testId';
  const setConfirmMessage = createSpy();
  const removeProject = createSpy();
  const component = shallowRenderer({
    ...testProps,
    projectsRequesting: true,
    projects: fromJS([{ id: testId }]),
    setConfirmMessage,
    removeProject,
  });
  const smartItemGroup = component.find('SmartItemGroup');
  const { remove } = smartItemGroup.props();
  remove(testId);
  expect(setConfirmMessage).toHaveBeenCalled();
  const { action } = setConfirmMessage.calls[0].arguments[0];
  action();
  expect(removeProject).toHaveBeenCalledWith(testId);
});

test('listProjects is called when removeProject request is successful.', () => {
  const listProjects = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listProjects,
    removeProjectRequesting: true,
  });
  component.setProps({ removeProjectRequesting: false });
  expect(listProjects).toHaveBeenCalled();
});

test('listProjects is called when createProject request is successful.', () => {
  const listProjects = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listProjects,
    createProjectRequesting: true,
  });
  component.setProps({ createProjectRequesting: false });
  expect(listProjects).toHaveBeenCalled();
});

test('listProjects is not called when createProjectRequesting/removeProjectRequesting was not true.', () => {
  const component = shallowRenderer({
    ...testProps,
    createProjectRequesting: false,
    removeProjectRequesting: false,
  });
  const listProjects = createSpy();
  component.setProps({ listProjects });
  expect(listProjects).toNotHaveBeenCalled();
});

test('listProjects is called when onSearch is triggered.', () => {
  const listProjects = createSpy();
  const search = 'testValue';
  const component = shallowRenderer({
    ...testProps,
    listProjects,
  });
  const searchBox = component.find('SearchBox');
  searchBox.props().onSearch(search);
  expect(component).toHaveState({ search });
  expect(listProjects).toHaveBeenCalledWith({ 'page[number]': 1, search });
});

test('Renders a CreateProjectModal when toggleCreateModal is called.', () => {
  const component = shallowRenderer();
  component.instance().toggleCreateModal();
  expect(component).toContain(CreateProjectModal);
});

test('Calls createProject when onSave is called.', () => {
  const createProject = createSpy();
  const component = shallowRenderer({
    ...testProps,
    createProject,
  });
  component.instance().toggleCreateModal();
  const createProjectModal = component.find(CreateProjectModal);
  const project = { id: 'whatever' };
  createProjectModal.props().onSave(project);
  expect(createProject).toHaveBeenCalledWith(project);
});
