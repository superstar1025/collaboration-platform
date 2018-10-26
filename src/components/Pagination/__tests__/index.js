import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import Pagination from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {};

const shallowRenderer = (props = testProps) =>
  shallow(<Pagination {...props} />);

test('Renders a Pagination', () => {
  const component = shallowRenderer({
    pageIndex: 8,
    pageCount: 100,
  });
  expect(component).toBeA('Pagination');
});

test('Renders null when pageCount < 2', () => {
  const component = shallowRenderer({
    pageIndex: 0,
    pageCount: 1,
  });
  expect(component.type()).toBe(null);
});

test('Renders correct number of pagination items', () => {
  const component = shallowRenderer({
    pageIndex: 8,
    pageCount: 100,
  });
  // page items will be 1, 3, 6, 7, 8, 9, 10, 55, 100: total 9
  expect(component.find('PaginationItem').length).toBe(9);
});

test('Renders correct number of pagination items', () => {
  const component = shallowRenderer({
    pageIndex: 3,
    pageCount: 100,
  });

  // page items will be 1, 2, 3, 4, 5, 53, 100: total 7
  expect(component.find('PaginationLink').length).toBe(7);
});

test('when page item is clicked, changes the state and calls onChange.', () => {
  const onChange = createSpy();
  const component = shallowRenderer({
    pageIndex: 8,
    pageCount: 100,
    onChange,
  });
  const pageItem9 = component.find('PaginationLink').at(5);
  pageItem9.simulate('click', { preventDefault: noop });
  expect(component).toHaveState({ pageIndex: 9 });
  expect(onChange).toHaveBeenCalledWith(9);
});
