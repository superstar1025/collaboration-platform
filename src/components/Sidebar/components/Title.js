import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// nav list section title
const Title = ({ name, className }) => (
  <li className={classNames('nav-title', className)}>
    {name}
  </li>
);

Title.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
};

Title.defaultProps = {
  className: '',
};

export default Title;
