import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardTitle, CardText, Button } from 'reactstrap';

import { injectIntl } from 'components/Intl';

export const ProjectCard = ({ data: { attributes }, formatMessage, remove }) => (
  <Card>
    <CardHeader>
      <h3 className="float-left">
        <Link to={`/projects/${attributes.id}`}>{attributes.name}</Link>
      </h3>
      {!!remove && (
        <i
          className="fa fa-trash action float-right"
          onClick={() => remove(attributes.id)}
        />
      )}
    </CardHeader>
    <CardBody className="text-center">
      <CardTitle>{attributes.name}</CardTitle>
      <CardText>{attributes.description}</CardText>
      <Link to={`/projects/${attributes.id}`}>
        <Button outline color="secondary">
          {formatMessage('Visit')}
        </Button>
      </Link>
    </CardBody>
  </Card>
);

ProjectCard.propTypes = {
  data: PropTypes.shape({
    attributes: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
  }).isRequired,
  formatMessage: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

export default injectIntl(ProjectCard);
