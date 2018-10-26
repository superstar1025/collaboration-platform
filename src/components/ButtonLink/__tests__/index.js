import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import ButtonLink from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  to: 'somewhere',
  children: <div />,
};

const shallowRenderer = (props = testProps) =>
  shallow(<ButtonLink {...props} />);

test('Renders a Link', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Link');
});

test('Renders an icon when prop icon is passed.', () => {
  const icon = 'whatever';
  const component = shallowRenderer({
    ...testProps,
    icon,
  });
  expect(component).toContain(`i.${icon}`);
});

// when you click
test('calls handleClick when it is set.', () => {
  const handleClick = createSpy();
  const component = shallowRenderer({
    ...testProps,
    handleClick,
  });
  const event = { preventDefault: noop };
  component.simulate('click', event);
  expect(handleClick).toHaveBeenCalledWith(event);
});

test('does not preventDefault when handleClick is not set.', () => {
  const component = shallowRenderer();
  const event = { preventDefault: createSpy() };
  component.simulate('click', event);
  expect(event.preventDefault).toNotHaveBeenCalled();
});
