import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, CardFooter } from 'reactstrap';
import moment from 'moment';
import { injectIntl } from 'components/Intl';

export const CompanyCard = ({ data: { attributes }, formatMessage, remove }) => (
  <Card>
    <CardHeader>
      <h3 className="float-left">
        <Link to={`/companies/${attributes.id}`}>{attributes.name}</Link>
      </h3>
      {!!remove && (
        <i
          className="fa fa-trash action float-right"
          onClick={() => remove(attributes.id)}
        />
      )}
    </CardHeader>
    <CardBody>
      {formatMessage('Created')}: {moment(attributes.created_at).fromNow()}
      <br />
      {formatMessage('Updated')}: {moment(attributes.updated_at).fromNow()}
    </CardBody>
    <CardFooter className="text-center">
      <Link to={`/companies/${attributes.id}`}>
        <Button outline color="secondary">
          {formatMessage('Details')}
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

CompanyCard.propTypes = {
  data: PropTypes.shape({
    attributes: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
  }).isRequired,
  formatMessage: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

export default injectIntl(CompanyCard);
