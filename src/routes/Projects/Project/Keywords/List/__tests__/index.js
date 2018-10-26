import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';

import { KeywordsList } from '../index';
import AddKeywordsModal from '../components/AddKeywordsModal';

const { expect, shallow, createSpy } = testHelper;
const testProjectId = 'testProject';
const testProps = {
  formatMessage: () => 'something',
  listKeywords: noop,
  listNegativeKeywords: noop,
  keywords: fromJS([]),
  negativeKeywords: fromJS([]),
  keywordsRequesting: false,
  negativeKeywordsRequesting: false,
  keywordsMeta: fromJS({}),
  negativeKeywordsMeta: fromJS({}),
  match: { params: { projectId: testProjectId } },
  project: fromJS({}),
  createKeywords: noop,
  createNegativeKeywords: noop,
  createKeywordsRequesting: false,
  createNegativeKeywordsRequesting: false,
  setConfirmMessage: noop,
  removeKeywordRequesting: false,
  removeNegativeKeywordRequesting: false,
  removeKeyword: noop,
  removeNegativeKeyword: noop,
  removeMultipleKeywords: noop,
  removeMultipleNegativeKeywords: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<KeywordsList {...props} />);

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

test('Renders a AddKeywordsModal.', () => {
  const component = shallowRenderer();
  expect(component).toContain(AddKeywordsModal);
});

test('Renders a SmartTable when prop keywords is not empty.', () => {
  const component = shallowRenderer({
    ...testProps,
    keywords: fromJS([{}]),
  });
  expect(component).toContain('SmartTable');
});

test('Renders a NotificationCard when prop keywords is empty.', () => {
  const component = shallowRenderer();
  expect(component).toContain('NotificationCard');
});

test('Renders a NotificationCard when prop negativeKeywords is empty and state negative is true.', () => {
  const component = shallowRenderer();
  component.setState({ negative: true });
  expect(component).toContain('NotificationCard');
});

// values vary from one render to another.
const testValues = [
  'whatever',
  ['whatever'],
];

test('onAddKeywords of AddKeywordsModal triggers createKeywords with proper params.', () => {
  const createKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    createKeywords,
  });
  const testKeywords = ['whatever', 'I do not know.'];
  const modal = component.find(AddKeywordsModal);
  modal.props().onAddKeywords(testKeywords);
  expect(createKeywords).toHaveBeenCalledWith(testProjectId, testKeywords);
});

test('onAddNegativeKeywords of AddKeywordsModal triggers createNegativeKeywords with proper params.', () => {
  const createNegativeKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    createNegativeKeywords,
  });
  const testKeywords = ['whatever', 'I do not know.'];
  const modal = component.find(AddKeywordsModal);
  modal.props().onAddNegativeKeywords(testKeywords);
  expect(createNegativeKeywords).toHaveBeenCalledWith(testProjectId, testKeywords);
});

test('listKeywords is called.', () => {
  const listKeywords = createSpy();
  shallowRenderer({
    ...testProps,
    listKeywords,
  });
  expect(listKeywords).toHaveBeenCalled();
});

test('listKeywords is called when createKeywords request is successful.', () => {
  const listKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listKeywords,
    createKeywordsRequesting: true,
  });
  component.setProps({ createKeywordsRequesting: false });
  expect(listKeywords).toHaveBeenCalled();
});

test('listKeywords is not called when createKeywordsReqesting was not true.', () => {
  let listKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listKeywords,
    createKeywordsRequesting: false,
  });
  listKeywords = createSpy();
  component.setProps({ listKeywords });
  expect(listKeywords).toNotHaveBeenCalled();
});

test('listKeywords is called when removeKeyword request is successful.', () => {
  const listKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listKeywords,
    removeKeywordRequesting: true,
  });
  component.setProps({ removeKeywordRequesting: false });
  expect(listKeywords).toHaveBeenCalled();
});

test('listKeywords is not called when removeKeywordRequesting was not true.', () => {
  const component = shallowRenderer({
    ...testProps,
    removeKeywordRequesting: false,
  });
  const listKeywords = createSpy();
  component.setProps({ listKeywords });
  expect(listKeywords).toNotHaveBeenCalled();
});

test('onAddTags is called when onClick is called on first action.', () => {
  const component = shallowRenderer({
    ...testProps,
    keywords: fromJS([{}]),
  });
  const smartTable = component.find('SmartTable');
  const { actions } = smartTable.props();
  const addTagAction = actions[0];
  const checks = [
    {},
    { attributes: { name: 'first' } },
    { attributes: { name: 'second' } },
  ];
  addTagAction.onClick(checks);
  expect(component).toHaveState({ createModal: true, addKeywords: '***\nfirst\nsecond' });
});

test('setConfirmMessage for keywords is called when onClick is called on second action.', () => {
  const setConfirmMessage = createSpy();
  const removeMultipleKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    keywords: fromJS([{}]),
    setConfirmMessage,
    removeMultipleKeywords,
  });
  const smartTable = component.find('SmartTable');
  const { actions } = smartTable.props();
  const removeMultipleAction = actions[1];
  const checks = [
    {},
    { attributes: { id: 'first' } },
    { attributes: { id: 'second' } },
  ];
  removeMultipleAction.onClick(checks);
  expect(setConfirmMessage).toHaveBeenCalled();
  const { action } = setConfirmMessage.calls[0].arguments[0];
  action();
  expect(removeMultipleKeywords).toHaveBeenCalledWith(testProjectId, { selected_ids: ['all', 'first', 'second'] });
});

test('setConfirmMessage for negative keywords is called when onClick is called on second action.', () => {
  const setConfirmMessage = createSpy();
  const removeMultipleNegativeKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    negativeKeywords: fromJS([{}]),
    setConfirmMessage,
    removeMultipleNegativeKeywords,
  });
  component.instance().toggleNegative();
  const smartTable = component.find('SmartTable');
  const { actions } = smartTable.props();
  const removeMultipleAction = actions[1];
  const checks = [
    {},
    { attributes: { id: 'first' } },
    { attributes: { id: 'second' } },
  ];
  removeMultipleAction.onClick(checks);
  expect(setConfirmMessage).toHaveBeenCalled();
  const { action } = setConfirmMessage.calls[0].arguments[0];
  action();
  expect(removeMultipleNegativeKeywords).toHaveBeenCalledWith(testProjectId, { selected_ids: ['all', 'first', 'second'] });
});

test('sets state tags and calls listKeywords when one of tags is clicked.', () => {
  const listKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listKeywords,
    keywordsRequesting: true,
    keywords: fromJS([{}]),
  });
  const smartTable = component.find('SmartTable');
  const { fields } = smartTable.props();
  const tagsField = fields[1];
  const renderedComponent = shallow(tagsField.render(testValues[1], { id: 'rowId' })[0]);
  const tagsButton = renderedComponent.find('Button').first();
  tagsButton.simulate('click');
  expect(component.instance().state.tags).toEqual([testValues[1][0]]);
  expect(listKeywords).toHaveBeenCalled();
});

test('listKeywords is called and tag filter is removed when tag button is clicked on the right header .', () => {
  const listKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listKeywords,
    keywordsRequesting: true,
    keywords: fromJS([{}]),
  });
  component.setState({ tags: ['tag1', 'tag2'] });
  const smartTable = component.find('SmartTable');
  const { headerRight } = smartTable.props();
  const firstTag = shallow(headerRight[0]);
  firstTag.simulate('click');
  expect(component).toHaveState({ tags: ['tag2'] });
  expect(listKeywords).toHaveBeenCalled();
});

test('sets state pageIndex and calls listKeywords when onPageChange is called.', () => {
  const listKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    listKeywords,
    keywordsRequesting: false,
    keywords: fromJS([{}]),
  });
  const smartTable = component.find('SmartTable');
  const { onPageChange } = smartTable.props();
  const pageIndex = 3;
  onPageChange(pageIndex);
  expect(component).toHaveState({ pageIndex });
  expect(listKeywords).toHaveBeenCalled();
});

test('AddKeywordsModal is open when second buttonLink of breadcrumbmenu is clicked.', () => {
  const component = shallowRenderer();
  const secondButtonLink = component.find(BreadcrumbMenu).find('ButtonLink').at(1);
  secondButtonLink.props().handleClick();
  const addKeywordsModal = component.find(AddKeywordsModal);
  expect(addKeywordsModal).toHaveProps({ isOpen: true });
});

test('state negative is set to true/false when third buttonLink is clicked.', () => {
  const component = shallowRenderer();
  const secondButtonLink = component.find(BreadcrumbMenu).find('ButtonLink').at(2);
  secondButtonLink.props().handleClick();
  expect(component).toHaveState({ negative: true });
  secondButtonLink.props().handleClick();
  expect(component).toHaveState({ negative: false });
});

test('calls setConfirmMessage when trash icon is clicked and when action is called removeKeyword is triggered.', () => {
  const testId = 'testId';
  const setConfirmMessage = createSpy();
  const removeKeyword = createSpy();
  const component = shallowRenderer({
    ...testProps,
    keywordsRequesting: false,
    keywords: fromJS([{ id: testId }]),
    setConfirmMessage,
    removeKeyword,
  });
  const smartTable = component.find('SmartTable');
  const { fields } = smartTable.props();
  const actionField = fields[fields.length - 1];
  const trashIcon = shallow(actionField.render(testId, { id: testId }));
  trashIcon.simulate('click');
  expect(setConfirmMessage).toHaveBeenCalled();
  const { action } = setConfirmMessage.calls[0].arguments[0];
  action();
  expect(removeKeyword).toHaveBeenCalledWith(testProjectId, testId);
});

test('calls setConfirmMessage when trash icon is clicked and when action is called removeNegativeKeyword is triggered.', () => {
  const testId = 'testId';
  const setConfirmMessage = createSpy();
  const removeNegativeKeyword = createSpy();
  const component = shallowRenderer({
    ...testProps,
    negativeKeywordsRequesting: false,
    negativeKeywords: fromJS([{ id: testId }]),
    setConfirmMessage,
    removeNegativeKeyword,
  });
  component.instance().toggleNegative();
  const smartTable = component.find('SmartTable');
  const { fields } = smartTable.props();
  const actionField = fields[fields.length - 1];
  const trashIcon = shallow(actionField.render(testId, { id: testId }));
  trashIcon.simulate('click');
  expect(setConfirmMessage).toHaveBeenCalled();
  const { action } = setConfirmMessage.calls[0].arguments[0];
  action();
  expect(removeNegativeKeyword).toHaveBeenCalledWith(testProjectId, testId);
});

test('listKeywords is called when onSearch is triggered.', () => {
  const listKeywords = createSpy();
  const search = 'testValue';
  const component = shallowRenderer({
    ...testProps,
    listKeywords,
  });
  const searchBox = component.find('SearchBox');
  searchBox.props().onSearch(search);
  expect(component).toHaveState({ search });
  expect(listKeywords).toHaveBeenCalled();
});

test('Renders fields without problem', () => {
  const component = shallowRenderer({
    ...testProps,
    keywordsRequesting: true,
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
