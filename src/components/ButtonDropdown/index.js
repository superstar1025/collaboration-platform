import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ButtonDropdown as ButtonDropdownRS,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';

export class ButtonDropdown extends Component {
  static propTypes = {
    toggleOptions: PropTypes.shape(),
    children: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
  }

  static defaultProps = {
    toggleOptions: {},
  }

  state = { show: false };

  render() {
    const { toggleOptions, children, title } = this.props;
    const { show } = this.state;
    return (
      <ButtonDropdownRS
        isOpen={show}
        toggle={() => { this.setState({ show: !show }); }}
      >
        <DropdownToggle {...toggleOptions}>
          {title}
        </DropdownToggle>
        <DropdownMenu className={show ? 'show' : ''}>
          {children}
        </DropdownMenu>
      </ButtonDropdownRS>
    );
  }
}

export default ButtonDropdown;
