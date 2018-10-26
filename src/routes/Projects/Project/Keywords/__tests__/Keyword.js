import React from 'react';
import test from 'ava';
import { fromJS } from 'immutable';
import { noop } from 'lodash';

import BreadcrumbItem from 'components/BreadcrumbItem';

import { Keyword } from '../Keyword';

const { expect, shallow, createSpy } = testHelper;

const testProjectId = 'testProject';
const testKeywordId = 'testKeyword';
const testName = 'testKeywordName';
const testProps = {
  match: { params: { projectId: testProjectId, keywordId: testKeywordId } },
  keyword: fromJS({ attributes: { name: testName } }),
  readKeyword: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<Keyword {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find(BreadcrumbItem);
  expect(breadcrumb).toHaveProps({ to: `/projects/${testProjectId}/keywords/${testKeywordId}` });
});

test('readKeyword is called.', () => {
  const readKeyword = createSpy();
  shallowRenderer({
    ...testProps,
    readKeyword,
  });
  expect(readKeyword).toHaveBeenCalledWith(testProjectId, testKeywordId);
});

test('Renders a the name of keyword', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find(BreadcrumbItem);
  expect(breadcrumb.props().children).toInclude(testName);
});
