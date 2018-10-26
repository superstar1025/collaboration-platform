import React from 'react';
import PropTypes from 'prop-types';

const NotificationCard = ({ icon, title, description }) => (
  <div className="notification-card card card-accent-info text-center p-2">
    <div className="icon">
      <i className={`fa fa-2x fa-${icon} text-primary`} />
    </div>
    <div className="title">{title}</div>
    <div className="description">{description}</div>
  </div>
);

NotificationCard.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

NotificationCard.defaultProps = {
  icon: 'frown-o',
  title: null,
  description: null,
};

export default NotificationCard;
