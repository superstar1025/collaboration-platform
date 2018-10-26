import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import { CompanyCard } from '../CompanyCard';

const { expect, shallow, createSpy } = testHelper;

const testProjectId = '1';
const testProps = {
  data: { attributes: { id: testProjectId, name: 'testName' } },
  formatMessage: noop,
  remove: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<CompanyCard {...props} />);

test('Renders a Card', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Card');
});

test('Renders a CardHeader', () => {
  const component = shallowRenderer();
  expect(component).toContain('CardHeader');
});

test('Renders a CardBody', () => {
  const component = shallowRenderer();
  expect(component).toContain('CardBody');
});

test('remove is called when trash icon is clicked.', () => {
  const remove = createSpy();
  const component = shallowRenderer({
    ...testProps,
    remove,
  });
  const iconTrash = component.find('i.fa-trash');
  iconTrash.simulate('click');
  expect(remove).toHaveBeenCalledWith(testProjectId);
});
