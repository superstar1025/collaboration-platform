import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, CardText } from 'reactstrap';

export const WordCloudsCard = ({ title, words }) => (
  <Card>
    <CardHeader>
      {title}
    </CardHeader>
    <CardBody>
      {
        words.map(word => (
          <CardText key={word}>{word}</CardText>
        ))
      }
    </CardBody>
  </Card>
);

WordCloudsCard.propTypes = {
  title: PropTypes.string.isRequired,
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default WordCloudsCard;
