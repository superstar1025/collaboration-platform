import React from 'react';
import test from 'ava';
import Select, { Creatable } from 'react-select';

import Tags from '../index';

const { expect, shallow } = testHelper;

const testProps = {
  name: 'tags',
};

const shallowRenderer = (props = testProps) =>
  shallow(<Tags {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a Select by default.', () => {
  const component = shallowRenderer();
  expect(component).toContain(Select);
});

test('Renders a Creatable when creatable prop is set to true.', () => {
  const component = shallowRenderer({
    ...testProps,
    creatable: true,
  });
  expect(component).toContain(Creatable);
});

test('Renders a hidden Input', () => {
  const component = shallowRenderer();
  expect(component).toContain('Input[type="hidden"]');
});

test('saveChanges changes the tags.', () => {
  const component = shallowRenderer();
  const select = component.find(Select);
  const testTags = [
    { value: '1' },
    { value: '2' },
  ];
  select.props().onChange(testTags);
  const inputHidden = component.find('Input[type="hidden"]');
  expect(inputHidden).toHaveProp('value', '1,2');
});
