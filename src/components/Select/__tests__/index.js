import React from 'react';
import test from 'ava';
import RsSelect from 'react-select';

import Select from '../index';

const { expect, shallow } = testHelper;

const testProps = {
  defaultValue: 'whatever',
};

const shallowRenderer = (props = testProps) =>
  shallow(<Select {...props} />);

test('Renders a react-select', () => {
  const component = shallowRenderer();
  expect(component).toBeA(RsSelect);
});

test('state value is changed when onChange is called.', () => {
  const component = shallowRenderer();
  const testValue = 'testValue';
  component.props().onChange(testValue);
  expect(component).toHaveState({ value: testValue });
});
