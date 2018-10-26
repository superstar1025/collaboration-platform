import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  ButtonGroup,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

class DashboardCard extends Component {
  static propTypes = {
    bgColor: PropTypes.string.isRequired,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    type: PropTypes.string.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
    })).isRequired,
  };

  state = { showDropdown: false };

  render() {
    const { bgColor, actions, count, type } = this.props;
    const { showDropdown } = this.state;
    return (
      <Card className={`text-white bg-${bgColor}`}>
        <CardBody className="card-body pb-0">
          <ButtonGroup className="float-right">
            <ButtonDropdown
              isOpen={showDropdown}
              toggle={() => { this.setState({ showDropdown: !this.state.showDropdown }); }}>
              <DropdownToggle caret className="p-0" color="transparent">
                <i className="icon-settings" />
              </DropdownToggle>
              <DropdownMenu right>
                {
                  actions.map(action => (
                    <DropdownItem key={action.label} onClick={action.onClick}>
                      {action.label}
                    </DropdownItem>
                  ))
                }
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
          <h4 className="mb-0">{count}</h4>
          <p>{type}</p>
          <div className="chart-wrapper px-3" style={{ height: '70px' }} />
        </CardBody>
      </Card>
    );
  }
}

export default DashboardCard;
