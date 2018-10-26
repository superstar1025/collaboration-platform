import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';
import { Creatable } from 'react-select';

import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';

import { Segment } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProjectId = 'testProject';
const testSegmentId = 'testSegment';
const testProps = {
  match: {
    params: {
      projectId: testProjectId,
      segmentId: testSegmentId,
    },
  },
  segment: fromJS({
    attributes: {
      id: testSegmentId,
      name: 'testName',
      query_type: 'queryType',
      selected_values: [],
    },
  }),
  filterType: fromJS({
    attributes: {},
  }),
  filterTypeRequesting: false,
  segmentRequesting: false,
  readSegment: noop,
  updateSegment: noop,
  formatMessage: noop,
  readFilterType: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<Segment {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find(BreadcrumbItem);
  expect(breadcrumb).toHaveProps({ to: `/projects/${testProjectId}/segments/${testSegmentId}` });
});

test('Renders a HeaderTitle', () => {
  const component = shallowRenderer();
  expect(component).toContain(HeaderTitle);
});

test('Update Segment is called when form is submitted.', () => {
  const updateSegment = createSpy();
  const component = shallowRenderer({
    ...testProps,
    updateSegment,
  });
  const form = component.find('Form');
  form.simulate('submit', { preventDefault: noop, target: null });
  expect(updateSegment).toHaveBeenCalled();
});

test('change state segmentName when Input with `name` is changed.', () => {
  const segmentName = 'testName';
  const component = shallowRenderer({
    ...testProps,
    segmentRequesting: true, // to check if it renders fine when segmentRequesting is true
    segment: fromJS({}), // to check if it renders fine when segment is not set
  });
  const input = component.find('Input[name="name"]');
  input.simulate('change', { target: { value: segmentName } });
  expect(component).toHaveState({ segmentName });
});

test('check if state `selectedValues` is changed properly when changing filter dropdown.', () => {
  const selectedValues = [{ filter: 'a' }];
  const filters = {
    b: { rules: ['rule-b1', 'rule-b2'], type: 'number' },
    a: { rules: ['rule-a1', 'rule-a2'], type: 'array', values: ['value-a1', 'value-a2', 'value-a3'] },
  };
  const component = shallowRenderer({
    ...testProps,
    filterType: fromJS({
      attributes: { filters },
    }),
  });
  component.setState({ selectedValues });
  const row = component.find('Row').at(0);
  const inputFilter = row.find('Input').at(0);
  inputFilter.simulate('change', { target: { value: 'b' } });
  const currentState = component.instance().state.selectedValues;
  expect(currentState).toEqual([
    { filter: 'b', rule: 'rule-b1', value: 0 },
  ]);
});

test('check if state `selectedValues` is changed properly when changing rule dropdown.', () => {
  const selectedValues = [{ filter: 'a' }];
  const filters = {
    b: { rules: ['rule-b1', 'rule-b2'], type: 'number' },
    a: { rules: ['rule-a1', 'rule-a2'], type: 'array', values: ['value-a1', 'value-a2', 'value-a3'] },
  };
  const component = shallowRenderer({
    ...testProps,
    filterType: fromJS({
      attributes: { filters },
    }),
  });
  component.setState({ selectedValues });
  const row = component.find('Row').at(0);
  const inputFilter = row.find('Input').at(1);
  inputFilter.simulate('change', { target: { value: 'rule-a2' } });
  const currentState = component.instance().state.selectedValues;
  expect(currentState).toEqual([
    { filter: 'a', rule: 'rule-a2', value: 'value-a1', meta: { value: 'value-a1' } },
  ]);
});

test('check if state `selectedValues` is changed properly when changing rule dropdown.', () => {
  const selectedValues = [{ filter: 'b' }];
  const filters = {
    b: { rules: ['rule-b1', 'rule-b2'], type: 'string' },
    a: { rules: ['rule-a1', 'rule-a2'], type: 'array', values: ['value-a1', 'value-a2', 'value-a3'] },
  };
  const component = shallowRenderer({
    ...testProps,
    filterType: fromJS({
      attributes: { filters },
    }),
  });
  component.setState({ selectedValues });
  const row = component.find('Row').at(0);
  const inputFilter = row.find('Input').at(1);
  inputFilter.simulate('change', { target: { value: 'rule-b2' } });
  const currentState = component.instance().state.selectedValues;
  expect(currentState).toEqual([
    { filter: 'b', rule: 'rule-b2', value: '' },
  ]);
});

test('check if state `selectedValues` is changed properly when changing rule dropdown.', () => {
  const selectedValues = [{ filter: 'a', rule: 'rule-a1' }];
  const filters = {
    b: { rules: ['rule-b1', 'rule-b2'], type: 'string' },
    a: { rules: ['rule-a1', 'rule-a2'], type: 'array', values: ['value-a1', 'value-a2', 'value-a3'] },
  };
  const component = shallowRenderer({
    ...testProps,
    filterType: fromJS({
      attributes: { filters },
    }),
  });
  component.setState({ selectedValues });
  const row = component.find('Row').at(0);
  const creatable = row.find(Creatable);
  const testValue = { value: 'whatever' };
  creatable.props().onChange(testValue);
  const currentState = component.instance().state.selectedValues;
  expect(currentState).toEqual([
    { filter: 'a', rule: 'rule-a1', value: 'whatever', meta: testValue },
  ]);
});

test('check if state `selectedValues` is changed properly when changing rule dropdown.', () => {
  const selectedValues = [{ filter: 'b', rule: 'rule-b2' }];
  const filters = {
    b: { rules: ['rule-b1', 'rule-b2'], type: 'string' },
    a: { rules: ['rule-a1', 'rule-a2'], type: 'array', values: ['value-a1', 'value-a2', 'value-a3'] },
  };
  const component = shallowRenderer({
    ...testProps,
    filterType: fromJS({
      attributes: { filters },
    }),
  });
  component.setState({ selectedValues });
  const row = component.find('Row').at(0);
  const inputFilter = row.find('Input').at(2);
  const testValue = 'whatever';
  inputFilter.simulate('change', { target: { value: testValue } });
  const currentState = component.instance().state.selectedValues;
  expect(currentState).toEqual([
    { filter: 'b', rule: 'rule-b2', value: testValue },
  ]);
});

test('check if state `selectedValues` is changed properly when add new filter is clicked.', () => {
  const selectedValues = [{ filter: 'b', rule: 'rule-b2' }];
  const filters = {
    b: { rules: ['rule-b1', 'rule-b2'], type: 'string' },
    a: { rules: ['rule-a1', 'rule-a2'], type: 'array', values: ['value-a1', 'value-a2', 'value-a3'] },
  };
  const component = shallowRenderer({
    ...testProps,
    filterType: fromJS({
      attributes: { filters },
    }),
  });
  component.setState({ selectedValues });
  const button = component.find('Button#add-filter');
  button.simulate('click');
  const currentState = component.instance().state.selectedValues;
  expect(currentState).toEqual([
    { filter: 'b', rule: 'rule-b2' },
    { filter: 'a', rule: 'rule-a1', value: 'value-a1', meta: { value: 'value-a1' } },
  ]);
});

test('readFilterType is called when segment is changed and query_type exists.', () => {
  const readFilterType = createSpy();
  const queryType = 'whatever';
  const component = shallowRenderer();
  component.setProps({
    readFilterType,
    segment: fromJS({
      attributes: { query_type: queryType },
    }),
  });
  expect(readFilterType).toHaveBeenCalledWith(testProjectId, queryType);
});

test('state values are changed when prop filterType is changed.', () => {
  const segmentName = 'whatever';
  const filters = {
    b: { rules: ['rule-b1', 'rule-b2'], type: 'string' },
    a: { rules: ['rule-a1', 'rule-a2'], type: 'array', values: ['value-a1', 'value-a2', 'value-a3'] },
  };
  const component = shallowRenderer();
  component.setProps({
    filterType: fromJS({
      attributes: { filters },
    }),
    segment: fromJS({
      attributes: { name: segmentName, selected_values: '[{ "filter": "a", "rule": "rule-a1", "value": "value-a1", "meta": { "value": "value-a1" } }]' },
    }),
  });
  expect(component).toHaveState({ segmentName });
  expect(component.instance().state.selectedValues)
    .toEqual([{ filter: 'a', rule: 'rule-a1', value: 'value-a1', meta: { value: 'value-a1' } }]);
  component.setProps({
    filterType: fromJS({
      attributes: { filters },
    }),
    segment: fromJS({
      attributes: { name: segmentName },
    }),
  });
  expect(component).toHaveState({ segmentName });
  expect(component.instance().state.selectedValues).toEqual([]);

  // state does not change if filterType is not changed.
  component.setProps({
    segment: fromJS({
      attributes: { name: segmentName, selected_values: '[{ "filter": "a", "rule": "rule-a1", "value": "value-a1", "meta": { "value": "value-a1" } }]' },
    }),
  });
  expect(component.instance().state.selectedValues).toEqual([]);
});

test('check if state `selectedValues` is changed properly when trash icon is clicked.', () => {
  const selectedValues = [{ filter: 'a' }, { filter: 'b' }];
  const filters = {
    b: { rules: ['rule-b1', 'rule-b2'], type: 'number' },
    a: { rules: ['rule-a1', 'rule-a2'], type: 'array', values: ['value-a1', 'value-a2', 'value-a3'] },
  };
  const component = shallowRenderer({
    ...testProps,
    filterType: fromJS({
      attributes: { filters },
    }),
  });
  component.setState({ selectedValues });
  const row = component.find('Row').at(0);
  const trashIcon = row.find('i.fa-trash');
  trashIcon.simulate('click');
  expect(component.instance().state.selectedValues).toEqual([
    { filter: 'b' },
  ]);
});
