import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { perPage } from 'constants/page';

import SmartItemGroup from '../index';

const { expect, shallow } = testHelper;
const TestComponent = () => <div className="test-component" />;
const testProps = {
  data: [],
  onPageChange: noop,
  ItemComponent: TestComponent,
  ghost: false,
};

const shallowRenderer = (props = testProps) =>
  shallow(<SmartItemGroup {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a pagination with proper props', () => {
  const total = 103;
  const component = shallowRenderer({
    ...testProps,
    total,
  });
  const pagination = component.find('Pagination');
  expect(pagination).toHaveProps({ pageCount: Math.ceil(total / perPage) });
});

test('Renders ItemComponent having number equal to perPage when ghost is set to true.', () => {
  const component = shallowRenderer({
    ...testProps,
    ghost: true,
  });
  const itemComponents = component.find('TestComponent');
  expect(itemComponents.length).toEqual(perPage);
});

test('Renders ItemComponent having number equal to data length when ghost is set to false.', () => {
  const testDataLength = 3;
  const component = shallowRenderer({
    ...testProps,
    data: new Array(testDataLength).fill({}),
  });
  const itemComponents = component.find('TestComponent');
  expect(itemComponents.length).toEqual(testDataLength);
});
