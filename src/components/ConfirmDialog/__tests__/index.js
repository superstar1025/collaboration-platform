import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';

import { ConfirmDialog } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  formatMessage: noop,
  confirmMessage: fromJS({}),
  clearConfirmMessage: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<ConfirmDialog {...props} />);

test('Renders a Modal', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Modal');
});

test('calls clearConfirmMessage when cancel button is clicked', () => {
  const clearConfirmMessage = createSpy();
  const component = shallowRenderer({
    ...testProps,
    clearConfirmMessage,
  });
  const cancelButton = component.find('Button[color="secondary"]');
  cancelButton.simulate('click');
  expect(clearConfirmMessage).toHaveBeenCalled();
});

test('calls clearConfirmMessage and action when ok button is clicked', () => {
  const clearConfirmMessage = createSpy();
  const action = createSpy();
  const component = shallowRenderer({
    ...testProps,
    clearConfirmMessage,
    confirmMessage: fromJS({
      action,
    }),
  });
  const okButton = component.find('Button[color="primary"]');
  okButton.simulate('click');
  expect(clearConfirmMessage).toHaveBeenCalled();
  expect(action).toHaveBeenCalled();
});
