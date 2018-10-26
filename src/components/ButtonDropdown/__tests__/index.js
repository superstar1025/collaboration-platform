import React from 'react';
import test from 'ava';

import { ButtonDropdown } from '../index';

const { expect, shallow } = testHelper;

const testProps = {
  title: 'testButton',
  children: <div className="test-child" />,
};

const shallowRenderer = (props = testProps) =>
  shallow(<ButtonDropdown {...props} />);

test('Renders a ButtonDropdown', () => {
  const component = shallowRenderer();
  expect(component).toBeA('ButtonDropdown');
});

test('Renders a title under DropdownToggle', () => {
  const component = shallowRenderer();
  const dropdownToggle = component.find('DropdownToggle');
  expect(dropdownToggle.props().children).toBe(testProps.title);
});

test('Renders a children', () => {
  const component = shallowRenderer();
  expect(component).toContain('div.test-child');
});

test('DropdownMenu is shown when toggled', () => {
  const component = shallowRenderer();
  component.props().toggle();
  expect(component).toContain('DropdownMenu[className="show"]');
});

