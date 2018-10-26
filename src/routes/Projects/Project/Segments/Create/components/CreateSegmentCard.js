import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Serializer from 'helpers/form-serialize';
import { Card, CardHeader, CardBody, FormGroup, Form, Label, Input, Button, Row, Col } from 'reactstrap';

import { selectState } from 'redux/selectors';
import { createSegment } from 'redux/segment/actions';
import { injectIntl } from 'components/Intl';

export class CreateSegmentCard extends Component {
  static propTypes = {
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    formatMessage: PropTypes.func.isRequired,
    filterTypes: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
    addSegment: PropTypes.func.isRequired,
    createSegment: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    createSegmentError: PropTypes.oneOfType([
      ImmutablePropTypes.list,
      ImmutablePropTypes.map,
    ]).isRequired,
    createSegmentRequesting: PropTypes.bool.isRequired,
  };

  componentWillReceiveProps({
    history, projectId, createSegment, createSegmentRequesting, createSegmentError,
  }) {
    if (!createSegmentRequesting
      && this.props.createSegmentRequesting
      && !createSegmentError.size
    ) {
      history.push(`/projects/${projectId}/segments/${createSegment.get('id')}`);
    }
  }

  render() {
    const {
      filterTypes,
      addSegment,
      projectId,
      formatMessage,
      createSegmentRequesting,
    } = this.props;
    return (
      <Card>
        <CardHeader>
          {formatMessage('Create from Scratch')}
        </CardHeader>
        <CardBody>
          <Form onSubmit={(e) => {
            e.preventDefault();
            addSegment(projectId, Serializer.serialize(e.target, { hash: true }));
          }}>
            <Row>
              <Col xs="12" sm="6">
                <FormGroup>
                  <Label htmlFor="name">{formatMessage('Name')}</Label>
                  <Input type="text" name="name" />
                </FormGroup>
              </Col>
              <Col xs="12" sm="6">
                <FormGroup>
                  <Label htmlFor="query_type">{formatMessage('Target')}</Label>
                  <Input type="select" name="query_type">
                    {
                      filterTypes.toJS().map(({ attributes: { name } }) =>
                        <option key={name} value={name}>{name}</option>,
                      )
                    }
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Button type="submit" color="success" block disabled={createSegmentRequesting}>{formatMessage('CREATE')}</Button>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('filterType', 'filterTypes')(state, 'filterTypes'),
  ...selectState('segment', 'createSegment')(state, 'createSegment'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  addSegment: (projectId, payload) => dispatch(createSegment(projectId, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CreateSegmentCard));
