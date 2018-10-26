import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import Tabs from '../index';

const { expect, shallow } = testHelper;

const testProps = {
  tabs: [
    { title: 'Tab1', content: <div className="tab1" /> },
    { title: 'Tab2', content: <div className="tab2" /> },
  ],
};

const shallowRenderer = (props = testProps) =>
  shallow(<Tabs {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a Nav', () => {
  const component = shallowRenderer();
  expect(component).toContain('Nav');
});

test('Renders 2 NavItems under Nav', () => {
  const component = shallowRenderer();
  const nav = component.find('Nav');
  const navItems = nav.find('NavItem');
  expect(navItems.length).toBe(2);
});

test('Renders a TabContent', () => {
  const component = shallowRenderer();
  expect(component).toContain('TabContent');
});

test('Renders 2 TabPanes under TabContent', () => {
  const component = shallowRenderer();
  const tabContent = component.find('TabContent');
  const tabPanes = tabContent.find('TabPane');
  expect(tabPanes.length).toBe(2);
});

test('first tab is active by default', () => {
  const component = shallowRenderer();
  const tabContent = component.find('TabContent');
  expect(tabContent).toHaveProp('activeTab', 0);
});

test('Renders a hidden Input', () => {
  const component = shallowRenderer();
  expect(component).toContain('Input[type="hidden"]');
});

test('active tab is changed according to the click', () => {
  const component = shallowRenderer();
  const secondNavLink = component.find('NavLink').at(1);
  secondNavLink.simulate('click', { preventDefault: noop });
  const tabContent = component.find('TabContent');
  expect(tabContent).toHaveProp('activeTab', 1);
});
