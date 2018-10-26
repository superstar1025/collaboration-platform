import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { Modal } from 'reactstrap';
import Serializer from 'helpers/form-serialize';

import Tabs from 'components/Tabs';

import { AddKeywordsModal } from '../AddKeywordsModal';

const { expect, shallow, createSpy } = testHelper;
const testProps = {
  isOpen: false,
  toggle: noop,
  onAddKeywords: noop,
  onAddNegativeKeywords: noop,
  formatMessage: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<AddKeywordsModal {...props} />);

test('Renders a Modal', () => {
  const component = shallowRenderer();
  expect(component).toBeA(Modal);
});

test('Renders a Tabs', () => {
  const component = shallowRenderer();
  expect(component).toContain(Tabs);
});

test('onAddKeywords is called when activeTab is set to `0` and keywords exist.', () => {
  Serializer.serialize = () => ({
    activeTab: '0',
    keywords: 'whatever',
  });
  const onAddKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    onAddKeywords,
  });
  const form = component.find('Form');
  form.simulate('submit', { preventDefault: noop });
  expect(onAddKeywords).toHaveBeenCalled();
});

test('onAddNegativeKeywords is called when negativeKeywords exist but not keywords.', () => {
  Serializer.serialize = () => ({
    activeTab: '0',
    negativeKeywords: 'whatever',
  });
  const onAddNegativeKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    onAddNegativeKeywords,
  });
  const form = component.find('Form');
  form.simulate('submit', { preventDefault: noop });
  expect(onAddNegativeKeywords).toHaveBeenCalled();
});

test('onAddNegativeKeywords is not called when negativeKeywords does not exist.', () => {
  Serializer.serialize = () => ({
    activeTab: '0',
  });
  const onAddNegativeKeywords = createSpy();
  const component = shallowRenderer({
    ...testProps,
    onAddNegativeKeywords,
  });
  const form = component.find('Form');
  form.simulate('submit', { preventDefault: noop });
  expect(onAddNegativeKeywords).toNotHaveBeenCalled();
});

test('toggle is called when form is submitted.', () => {
  const toggle = createSpy();
  const component = shallowRenderer({
    ...testProps,
    toggle,
  });
  const form = component.find('Form');
  form.simulate('submit', { preventDefault: noop });
  expect(toggle).toHaveBeenCalled();
});

test('activeTab is set to 1 when negative is true.', () => {
  const component = shallowRenderer({
    ...testProps,
    negative: true,
  });
  const tabs = component.find(Tabs);
  expect(tabs.props().activeTab).toBe(1);
});
