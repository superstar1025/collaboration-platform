import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';

import { SegmentsList } from '../index';
import SegmentCard from '../components/SegmentCard';

const { expect, shallow, createSpy } = testHelper;

const testProjectId = 'testProject';
const testProps = {
  formatMessage: () => 'something',
  segments: fromJS([{}]),
  match: { params: { projectId: testProjectId } },
  segmentsRequesting: false,
  segmentsMeta: fromJS({ total: 12 }),
  project: fromJS({
    id: testProjectId,
    attributes: {
      id: testProjectId,
      name: 'testName',
    },
  }),
  listSegments: noop,
  removeSegment: noop,
  removeSegmentRequesting: false,
  setConfirmMessage: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<SegmentsList {...props} />);

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
    project: fromJS({ attributes: { name: 'name' } }),
  });
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

test('Renders a NotificationCard when there is no segments', () => {
  const component = shallowRenderer({
    ...testProps,
    segments: fromJS([]),
  });
  expect(component).toContain('NotificationCard');
});

test('listSegments is called.', () => {
  const listSegments = createSpy();
  shallowRenderer({
    ...testProps,
    listSegments,
  });
  expect(listSegments).toHaveBeenCalledWith(testProjectId, { 'page[number]': 1, search: '' });
});

test('listSegments is called when onPageChange of SmartItemGroup is called.', () => {
  const listSegments = createSpy();
  const pageIndex = 5;
  const search = 'testSearch';
  const component = shallowRenderer({
    ...testProps,
    listSegments,
  });
  component.setState({ search });
  const smartItemGroup = component.find('SmartItemGroup');
  smartItemGroup.props().onPageChange(pageIndex);
  expect(listSegments).toHaveBeenCalledWith(testProjectId, { 'page[number]': pageIndex, search });
});

test('ItemComponent should be a SegmentCard.', () => {
  const component = shallowRenderer({
    ...testProps,
    project: fromJS({ // This is to test if it is fine when there is no name of project.
      id: testProjectId,
      attributes: {
        id: testProjectId,
      },
    }),
  });
  const smartItemGroup = component.find('SmartItemGroup');
  const { ItemComponent } = smartItemGroup.props();
  const itemComponent = shallow(<ItemComponent />);
  expect(itemComponent).toBeA(SegmentCard);
});

test('calls setConfirmMessage when trash icon is clicked and when action is called removeSegment is triggered.', () => {
  const testId = 'testId';
  const setConfirmMessage = createSpy();
  const removeSegment = createSpy();
  const component = shallowRenderer({
    ...testProps,
    segmentsRequesting: true,
    segments: fromJS([{ id: testId }]),
    setConfirmMessage,
    removeSegment,
  });
  const smartItemGroup = component.find('SmartItemGroup');
  const { remove } = smartItemGroup.props();
  remove(testId);
  expect(setConfirmMessage).toHaveBeenCalled();
  const { action } = setConfirmMessage.calls[0].arguments[0];
  action();
  expect(removeSegment).toHaveBeenCalledWith(testProjectId, testId);
});

test('listSegments is called when removeSegment request is successful.', () => {
  const listSegments = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listSegments,
    removeSegmentRequesting: true,
  });
  component.setProps({ removeSegmentRequesting: false });
  expect(listSegments).toHaveBeenCalled();
});

test('listSegments is not called when removeSegmentRequesting was not true.', () => {
  const component = shallowRenderer({
    ...testProps,
    removeSegmentRequesting: false,
  });
  const listSegments = createSpy();
  component.setProps({ listSegments });
  expect(listSegments).toNotHaveBeenCalled();
});

test('listSegments is called when onSearch is triggered.', () => {
  const listSegments = createSpy();
  const search = 'testValue';
  const component = shallowRenderer({
    ...testProps,
    listSegments,
  });
  const searchBox = component.find('SearchBox');
  searchBox.props().onSearch(search);
  expect(component).toHaveState({ search });
  expect(listSegments).toHaveBeenCalledWith(testProjectId, { 'page[number]': 1, search });
});
