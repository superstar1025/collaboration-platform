import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { Nav, NavItem, NavLink, TabContent, TabPane, Input } from 'reactstrap';
import classnames from 'classnames';

class Tabs extends Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.node,
      content: PropTypes.node,
    })).isRequired,
    activeTab: PropTypes.number,
    onToggle: PropTypes.func,
  };

  static defaultProps = {
    activeTab: 0,
    onToggle: noop,
  }

  state = { activeTab: this.props.activeTab };

  toggle = (index) => {
    const { onToggle } = this.props;
    this.setState({ activeTab: index });
    onToggle(index);
  }

  render() {
    const { tabs } = this.props;
    const { activeTab } = this.state;
    return (
      <div>
        <Nav tabs>
          {
            tabs.map((tab, index) => (
              <NavItem key={index}>
                <NavLink
                  className={classnames({ active: activeTab === index })}
                  onClick={(e) => { e.preventDefault(); this.toggle(index); }}
                  to="#"
                >
                  {tab.title}
                </NavLink>
              </NavItem>
            ))
          }
        </Nav>
        <TabContent activeTab={activeTab}>
          {
            tabs.map((tab, index) => (
              <TabPane tabId={index} key={index}>
                {tab.content}
              </TabPane>
            ))
          }
        </TabContent>
        <Input type="hidden" name="activeTab" value={activeTab} />
      </div>
    );
  }
}

export default Tabs;
