
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { startCase, sortBy } from 'lodash';
import { fromJS } from 'immutable';
import { Creatable } from 'react-select';
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from 'reactstrap';
import Serializer from 'helpers/form-serialize';

import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';
import { injectIntl } from 'components/Intl';
import { selectState } from 'redux/selectors';
import { readSegment, updateSegment } from 'redux/segment/actions';
import { readFilterType } from 'redux/filter_type/actions';

export class Segment extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        segmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
    segment: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    filterType: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    filterTypeRequesting: PropTypes.bool.isRequired,
    segmentRequesting: PropTypes.bool.isRequired,
    readSegment: PropTypes.func.isRequired,
    updateSegment: PropTypes.func.isRequired,
    formatMessage: PropTypes.func.isRequired,
    readFilterType: PropTypes.func.isRequired,
  };

  state = { segmentName: '', selectedValues: [] };

  componentWillMount() {
    const { match: { params: { projectId, segmentId } }, readSegment } = this.props;
    readSegment(projectId, segmentId);
  }

  componentWillReceiveProps({
    segment, filterType, readFilterType, match: { params: { projectId } },
  }) {
    if (segment !== this.props.segment && segment.getIn(['attributes', 'query_type'])) {
      readFilterType(projectId, segment.getIn(['attributes', 'query_type']));
    } else if (filterType !== this.props.filterType) {
      this.setState({
        segmentName: segment.getIn(['attributes', 'name']),
        selectedValues: JSON.parse(segment.toJS().attributes.selected_values || '[]'),
      });
    }
  }

  onSegmentNameChange = ({ target: { value } }) => this.setState({ segmentName: value });

  onAddNewFilter = () => {
    const filters = this.getFilters();
    this.state.selectedValues = this.state.selectedValues.concat([{}]);
    this.onSelectedValueChange(this.state.selectedValues.length - 1, 'filter', sortBy(Object.keys(filters))[0]);
  };

  onSelectedValueChange = (index, name, value) => {
    const selectedValues = this.state.selectedValues.slice();
    const filters = this.getFilters();
    selectedValues[index] = {
      ...selectedValues[index],
      [name]: value,
    };
    this.state.selectedValues = selectedValues;
    if (name === 'filter') {
      const { rules } = filters[value];
      this.onSelectedValueChange(index, 'rule', rules[0]);
    } else if (name === 'rule') {
      const { values, type } = filters[selectedValues[index].filter];
      if (type === 'array') {
        this.onSelectedValueChange(index, 'meta', { value: values[0] });
      } else if (type === 'number') {
        this.onSelectedValueChange(index, 'value', 0);
      } else {
        this.onSelectedValueChange(index, 'value', '');
      }
    } else if (name === 'meta') {
      this.onSelectedValueChange(index, 'value', value.value);
    } else {
      this.setState({ selectedValues });
    }
  }

  getFilters = () => (this.props.filterType.getIn(['attributes', 'filters']) || fromJS([])).toJS();

  removeSelectFilter = (index) => {
    const selectedValues = this.state.selectedValues.slice();
    selectedValues.splice(index, 1);
    this.setState({ selectedValues });
  }

  render() {
    const {
      match: { params: { projectId, segmentId } },
      segment,
      formatMessage,
      updateSegment,
      segmentRequesting,
      filterTypeRequesting,
    } = this.props;
    const { selectedValues } = this.state;
    const target = segment.getIn(['attributes', 'query_type']) || '--';
    const segmentName = segment.getIn(['attributes', 'name']) || '--';
    const filters = this.getFilters();
    return (
      <div>
        <BreadcrumbItem to={`/projects/${projectId}/segments/${segmentId}`}>
          {segmentName}
        </BreadcrumbItem>
        <HeaderTitle>
          {formatMessage('Segment')} {segmentName}
        </HeaderTitle>
        <Card>
          <CardHeader>
            {formatMessage('Setup Segment')}
          </CardHeader>
          <CardBody>
            <h4>{formatMessage('Target')}: {target}</h4><br />
            <Form onSubmit={(e) => {
              e.preventDefault();
              updateSegment(
                projectId,
                segmentId,
                {
                  ...Serializer.serialize(e.target, { hash: true }),
                  selected_values: JSON.stringify(selectedValues),
                },
              );
            }}>
              <FormGroup>
                <Label htmlFor="name"><h5>{formatMessage('Segment Name')}</h5></Label>
                <Input type="text" name="name" value={this.state.segmentName} onChange={this.onSegmentNameChange} required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="name"><h5>{formatMessage('Select Filters')}</h5></Label>
                <p>{formatMessage('{target} must match ALL of the following', { target })}</p>
                {
                  selectedValues.map((selectedValue, index) => (
                    <Row key={index} style={{ marginBottom: 5 }}>
                      <Col>
                        <Input type="select" onChange={({ target: { value } }) => this.onSelectedValueChange(index, 'filter', value)}>
                          <option disabled>{formatMessage('Select Filter')}</option>
                          {
                            sortBy(Object.keys(filters)).map(key => (
                              <option value={key} key={key}>{formatMessage(startCase(key.replace(/_/g, ' ')))}</option>
                            ))
                          }
                        </Input>
                      </Col>
                      <Col>
                        <Input type="select" onChange={({ target: { value } }) => this.onSelectedValueChange(index, 'rule', value)}>
                          <option disabled>{formatMessage('Select Rule')}</option>
                          {
                            filters[selectedValue.filter]
                            && filters[selectedValue.filter].rules.map(rule => (
                              <option value={rule} key={rule}>{formatMessage(startCase(rule.replace(/_/g, ' ')))}</option>
                            ))
                          }
                        </Input>
                      </Col>
                      <Col>
                        {
                          filters[selectedValue.filter].type === 'array' ? (
                            <Creatable
                              onChange={value => this.onSelectedValueChange(index, 'meta', value)}
                              options={filters[selectedValue.filter].values.map(value => ({
                                label: value, value,
                              }))}
                              value={selectedValue.meta}
                            />
                          ) : (
                            <Input
                              type={filters[selectedValue.filter].type}
                              onChange={({ target: { value } }) => this.onSelectedValueChange(index, 'value', value)}
                              value={selectedValue.value}
                            />
                          )
                        }
                      </Col>
                      <div style={{ width: 20, paddingTop: 5 }}>
                        <i
                          className="fa fa-trash action"
                          onClick={() => this.removeSelectFilter(index)}
                        />
                      </div>
                    </Row>
                  ))
                }
                <Button id="add-filter" color="info" onClick={this.onAddNewFilter} disabled={segmentRequesting || filterTypeRequesting}>
                  {formatMessage('Add New Filter')}
                </Button>
              </FormGroup>
              <Button type="submit" color="primary" disabled={segmentRequesting}>{formatMessage('Save Segment')}</Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('segment', 'segment')(state, 'segment'),
  ...selectState('filterType', 'filterType')(state, 'filterType'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  readSegment: (projectId, segmentId) => dispatch(readSegment(projectId, segmentId)),
  updateSegment: (projectId, segmentId, payload) =>
    dispatch(updateSegment(projectId, segmentId, payload)),
  readFilterType: (projectId, filterType) => dispatch(readFilterType(projectId, filterType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Segment));
