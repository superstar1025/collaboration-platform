import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { perPage } from 'constants/page';

import SmartTable from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  fields: [
    { label: 'Field1', name: 'field1', render: value => `render-${value}` },
    { label: 'Field2', name: 'field2' },
  ],
  data: [],
  onPageChange: noop,
  ghost: false,
};

const shallowRenderer = (props = testProps) =>
  shallow(<SmartTable {...props} />);

test('Renders a Card', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Card');
});

test('Doesn not render a CardHeader when there is no actions and no headerRight', () => {
  const component = shallowRenderer();
  // actions is [] by default so there is no CardHeader rendered.
  expect(component).toNotContain('CardHeader');
  component.setProps({ actions: null });
  expect(component).toNotContain('CardHeader');
});

test('Renders a CardHeader and number of Links when there are actions.', () => {
  const component = shallowRenderer({
    ...testProps,
    actions: [
      { label: 'Action1', onClick: noop },
      { label: 'Action2', onClick: noop },
    ],
  });
  expect(component).toContain('CardHeader');
  const links = component.find('CardHeader').find('Link');
  expect(links.length).toBe(2);
});

test('Renders a CardHeader and number of there is a headerRight.', () => {
  const component = shallowRenderer({
    ...testProps,
    headerRight: <div className="test-header-right" />,
  });
  expect(component).toContain('CardHeader');
  expect(component).toContain('div.float-right div.test-header-right');
});

test('Renders number of icons when there are actions with icons', () => {
  const component = shallowRenderer({
    ...testProps,
    actions: [
      { label: 'Action1', icon: 'icon1', onClick: noop },
      { label: 'Action2', onClick: noop },
      { label: 'Action3', icon: 'icon3', onClick: noop },
    ],
  });
  const icons = component.find('CardHeader').find('i');
  expect(icons.length).toBe(2);
});

test('onClick is called with current state `checks` when action link is clicked ', () => {
  const onClick = createSpy();
  const component = shallowRenderer({
    ...testProps,
    actions: [
      { label: 'Action1', icon: 'icon1', onClick },
    ],
  });
  const checkRows = 'whatever';
  component.setState({ checkRows });
  const link = component.find('CardHeader').find('Link');
  link.simulate('click', { preventDefault: noop });
  expect(onClick).toHaveBeenCalledWith(checkRows);
});

test('renders exact number of header cells.', () => {
  const component = shallowRenderer();
  const headerCells = component.find('Table').find('thead').find('th');
  expect(headerCells.length).toBe(testProps.fields.length);
});

test('renders one more header cell when checkable is set to true.', () => {
  const component = shallowRenderer({
    ...testProps,
    checkable: true,
  });
  const headerCells = component.find('Table').find('thead').find('th');
  expect(headerCells.length).toBe(testProps.fields.length + 1);
});

test('halfChecked is enabled when checks includes `all` and there are few exceptions.', () => {
  const component = shallowRenderer({
    ...testProps,
    checkable: true,
  });
  component.setState({ checks: ['all', 'exception1', 'exception2'] });
  const firstHeaderCell = component.find('Table').find('thead').find('th').first();
  const checkLabel = firstHeaderCell.find('Label');
  expect(checkLabel).toHaveClass('switch-info');
});

test('halfChecked is enabled when checks does not include `all` and there are some selections.', () => {
  const component = shallowRenderer({
    ...testProps,
    checkable: true,
  });
  component.setState({ checks: ['selected1', 'selected2'] });
  const firstHeaderCell = component.find('Table').find('thead').find('th').first();
  const checkLabel = firstHeaderCell.find('Label');
  expect(checkLabel).toHaveClass('switch-info');
});

test('checked for tableHeader is set when state checks has one or more elements.', () => {
  const component = shallowRenderer({
    ...testProps,
    checkable: true,
  });
  component.setState({ checks: ['whatever', 'something'] });
  const firstHeaderCell = component.find('Table').find('thead').find('th').first();
  const checkInput = firstHeaderCell.find('Label').find('Input');
  expect(checkInput).toHaveProp('checked', true);
});

test('set state checks to [`all`] when it is not checked to all yet and you click checkAll Input', () => {
  const component = shallowRenderer({
    ...testProps,
    checkable: true,
  });
  component.setState({ checks: ['whatever', 'something'] });
  const firstHeaderCell = component.find('Table').find('thead').find('th').first();
  const checkInput = firstHeaderCell.find('Label').find('Input');
  checkInput.simulate('change', { preventDefault: noop });
  expect(component.instance().state.checks).toEqual(['all']);
});

test('set state checks to [] when it is checked to all and you click checkAll Input', () => {
  const component = shallowRenderer({
    ...testProps,
    checkable: true,
  });
  component.setState({ checks: ['all', 'something', 'whatever'] });
  const firstHeaderCell = component.find('Table').find('thead').find('th').first();
  const checkInput = firstHeaderCell.find('Label').find('Input');
  checkInput.simulate('change', { preventDefault: noop });
  expect(component.instance().state.checks).toEqual([]);
});

test('renders exact number of row cells.', () => {
  const component = shallowRenderer({
    ...testProps,
    data: [{}, {}],
  });
  const rowCells = component.find('Table tbody tr').first().find('td');
  expect(rowCells.length).toBe(testProps.fields.length);
});

test('renders one more header cell when checkable is set to true.', () => {
  const component = shallowRenderer({
    ...testProps,
    data: [{}, {}],
    checkable: true,
  });
  const rowCells = component.find('Table tbody tr').first().find('td');
  expect(rowCells.length).toBe(testProps.fields.length + 1);
});

test('add rowId to checks when it was not in checks already.', () => {
  const rowId = 'testRowId';
  const component = shallowRenderer({
    ...testProps,
    checkable: true,
    data: [{ id: rowId }, {}],
  });
  const rowCells = component.find('Table tbody tr').first().find('td');
  const checkRowCellInput = rowCells.first().find('Input');
  component.setState({ checks: ['whatever', 'something'] });
  checkRowCellInput.simulate('change', { preventDefault: noop });
  expect(component.instance().state.checks).toEqual(['whatever', 'something', rowId]);
});

test('remove rowId from checks when it was already in checks.', () => {
  const rowId = 'testRowId';
  const component = shallowRenderer({
    ...testProps,
    checkable: true,
    data: [{ id: rowId }, {}],
  });
  const rowCells = component.find('Table tbody tr').first().find('td');
  const checkRowCellInput = rowCells.first().find('Input');
  component.setState({ checks: ['whatever', rowId] });
  checkRowCellInput.simulate('change', { preventDefault: noop });
  expect(component.instance().state.checks).toEqual(['whatever']);
});

test('renders Pagination with proper props.', () => {
  const total = 104;
  const component = shallowRenderer({
    ...testProps,
    total,
  });
  const pageCount = Math.ceil(total / perPage);
  expect(component).toContain(`Pagination[pageCount=${pageCount}]`);
});

test('onPageChange is called when onChange of Pagination component is called.', () => {
  const onPageChange = createSpy();
  const page = 19;
  const component = shallowRenderer({
    ...testProps,
    onPageChange,
  });
  const pagination = component.find('Pagination');
  pagination.props().onChange(page);
  expect(onPageChange).toHaveBeenCalledWith(page);
});

test('renders number(perPage) of LoadingIndicator, when ghost is true.', () => {
  const component = shallowRenderer({
    ...testProps,
    ghost: true,
  });
  const loadingIndicators = component.find('LoadingIndicator');
  expect(loadingIndicators.length).toBe(perPage);
});
