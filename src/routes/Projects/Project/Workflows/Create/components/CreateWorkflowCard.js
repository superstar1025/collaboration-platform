import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Serializer from 'helpers/form-serialize';
import { Card, CardHeader, CardBody, FormGroup, Form, Label, Input, Button, Row, Col } from 'reactstrap';

import { selectState } from 'redux/selectors';
import { createWorkflow } from 'redux/workflow/actions';
import { injectIntl } from 'components/Intl';

export class CreateWorkflowCard extends Component {
  static propTypes = {
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    formatMessage: PropTypes.func.isRequired,
    addWorkflow: PropTypes.func.isRequired,
    createWorkflow: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    createWorkflowError: PropTypes.oneOfType([
      ImmutablePropTypes.list,
      ImmutablePropTypes.map,
    ]).isRequired,
    createWorkflowRequesting: PropTypes.bool.isRequired,
  };

  componentWillReceiveProps({
    history, projectId, createWorkflow, createWorkflowRequesting, createWorkflowError,
  }) {
    if (!createWorkflowRequesting
      && this.props.createWorkflowRequesting
      && !createWorkflowError.size
    ) {
      history.push(`/projects/${projectId}/workflows/${createWorkflow.get('id')}`);
    }
  }

  render() {
    const {
      addWorkflow,
      projectId,
      formatMessage,
      createWorkflowRequesting,
    } = this.props;
    return (
      <Card>
        <CardHeader>
          {formatMessage('Create from Scratch')}
        </CardHeader>
        <CardBody>
          <Form onSubmit={(e) => {
            e.preventDefault();
            addWorkflow(projectId, Serializer.serialize(e.target, { hash: true }));
          }}>
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label htmlFor="name">{formatMessage('Name')}</Label>
                  <Input type="text" name="name" />
                </FormGroup>
              </Col>
            </Row>
            <Button type="submit" color="success" block disabled={createWorkflowRequesting}>{formatMessage('CREATE')}</Button>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('workflow', 'createWorkflow')(state, 'createWorkflow'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  addWorkflow: (projectId, payload) => dispatch(createWorkflow(projectId, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CreateWorkflowCard));
