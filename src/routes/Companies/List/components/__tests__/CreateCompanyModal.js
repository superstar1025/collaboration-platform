import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import { CreateCompanyModal } from '../CreateCompanyModal';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  formatMessage: noop,
  isOpen: false,
  toggle: noop,
  onSave: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<CreateCompanyModal {...props} />);

test('Renders a Modal', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Modal');
});

test('toggle is called when cancel Button is clicked.', () => {
  const toggle = createSpy();
  const component = shallowRenderer({
    ...testProps,
    toggle,
  });
  const cancelButton = component.find('Button').first();
  cancelButton.simulate('click');
  expect(toggle).toHaveBeenCalled();
});

test('onSave, toggle is called when form is submitted.', () => {
  const toggle = createSpy();
  const onSave = createSpy();
  const component = shallowRenderer({
    ...testProps,
    toggle,
    onSave,
  });
  const form = component.find('Form');
  form.simulate('submit', { preventDefault: noop, target: null });
  expect(toggle).toHaveBeenCalled();
  expect(onSave).toHaveBeenCalled();
});
