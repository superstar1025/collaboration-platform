import React from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import {
  Card,
  CardHeader,
  CardBody,
  CardText,
  CardFooter,
  Badge,
  Label,
  Input,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { injectIntl } from 'components/Intl';
import LoadingIndicator from 'components/LoadingIndicator';

const colors = {
  draft: 'warning',
  active: 'success',
  error: 'danger',
};

export const WorkflowCard = ({
  data: { attributes },
  projectId,
  formatMessage,
  ghost,
  remove,
  toggleStatus,
}) => (
  <Card>
    <CardHeader>
      <h3 className="float-left">
        {ghost ? '--' : <Link to={`/projects/${projectId}/workflows/${attributes.id}`}>{attributes.name}</Link>}
      </h3>
      {!ghost && (
        <Label className="switch switch-sm switch-default switch-text switch-pill switch-primary float-right">
          <Input
            type="checkbox"
            className="switch-input"
            checked={attributes.status === 'active'}
            onChange={() => toggleStatus(attributes.id, attributes.status)}
          />
          <span className="switch-label" data-on="On" data-off="Off" />
          <span className="switch-handle" />
        </Label>
      )}
    </CardHeader>
    {
      ghost ? (
        <CardBody>
          <LoadingIndicator />
        </CardBody>
      ) : (
        <CardBody>
          <CardText>{formatMessage('Target')}: {attributes.query_type}</CardText>
          <CardText>
            {formatMessage('Created')}: {moment(attributes.created_at).fromNow()}
            <br />
            {formatMessage('Updated')}: {moment(attributes.updated_at).fromNow()}
          </CardText>
        </CardBody>
      )
    }
    {
      ghost ? (
        <CardFooter>
          --
        </CardFooter>
      ) : (
        <CardFooter>
          <Badge color={colors[attributes.status]}>{startCase(attributes.status)}</Badge>
          {!!remove && (
            <i
              className="fa fa-trash action float-right"
              onClick={() => remove(attributes.id)}
            />
          )}
        </CardFooter>
      )
    }
  </Card>
);

WorkflowCard.propTypes = {
  data: PropTypes.shape({
    attributes: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
  }).isRequired,
  projectId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  formatMessage: PropTypes.func.isRequired,
  ghost: PropTypes.bool.isRequired,
  remove: PropTypes.func.isRequired,
  toggleStatus: PropTypes.func.isRequired,
};

export default injectIntl(WorkflowCard);
