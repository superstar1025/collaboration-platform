import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import { SearchBox } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  onSearch: noop,
  formatMessage: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<SearchBox {...props} />);

test('Renders a InputGroup', () => {
  const component = shallowRenderer();
  expect(component).toBeA('InputGroup');
});

test('onSearch is called when pressing enter key.', () => {
  const onSearch = createSpy();
  const searchValue = 'testValue';
  const component = shallowRenderer({
    ...testProps,
    onSearch,
  });
  component.setState({ value: searchValue });
  const searchInput = component.find('Input');
  searchInput.simulate('keyup', { preventDefault: noop, keyCode: 13 });
  expect(onSearch).toHaveBeenCalledWith(searchValue);
});

test('onSearch is not called when pressing another key.', () => {
  const onSearch = createSpy();
  const component = shallowRenderer({
    ...testProps,
    onSearch,
  });
  const searchInput = component.find('Input');
  searchInput.simulate('keyup', { preventDefault: noop, keyCode: 65 });
  expect(onSearch).toNotHaveBeenCalled();
});

test('onSearch is called when button is clicked.', () => {
  const onSearch = createSpy();
  const searchValue = 'testValue';
  const component = shallowRenderer({
    ...testProps,
    onSearch,
  });
  component.setState({ value: searchValue });
  const button = component.find('Button');
  button.simulate('click');
  expect(onSearch).toHaveBeenCalledWith(searchValue);
});

test('state `value` is changed when input value is changed.', () => {
  const component = shallowRenderer();
  const newValue = 'testValue';
  component.setState({ value: 'whatever' });
  const input = component.find('Input');
  input.simulate('change', { target: { value: newValue } });
});
