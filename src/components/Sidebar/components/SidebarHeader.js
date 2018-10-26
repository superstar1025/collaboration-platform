import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SidebarHeader = ({ picture, name, nickname }) => (
  <div className="sidebar-header">
    <img src={picture} className="img-avatar" alt="Avatar" />
    <div><strong>{name}</strong></div>
    <div className="text-muted"><small>{nickname}</small></div>
    <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
      <button type="button" className="btn btn-link">
        <i className="icon-settings" />
      </button>
      <Link to="/companies">
        <button type="button" className="btn btn-link">
          <i className="fa fa-building-o" />
        </button>
      </Link>
      <Link to="/users">
        <button type="button" className="btn btn-link">
          <i className="icon-user" />
        </button>
      </Link>
    </div>
  </div>
);

SidebarHeader.propTypes = {
  picture: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
};

export default SidebarHeader;
