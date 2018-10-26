import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setBreadcrumbMenu, clearBreadcrumbMenu } from 'redux/ui/actions';

export class BreadcrumbMenu extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    setBreadcrumbMenu: PropTypes.func.isRequired,
    clearBreadcrumbMenu: PropTypes.func.isRequired,
  }
  componentWillMount() {
    const { children, setBreadcrumbMenu } = this.props;
    setBreadcrumbMenu(children);
  }
  componentWillReceiveProps({ children, setBreadcrumbMenu }) {
    if (children !== this.props.children) {
      setBreadcrumbMenu(children);
    }
  }
  componentWillUnmount() {
    const { clearBreadcrumbMenu } = this.props;
    clearBreadcrumbMenu();
  }
  render() {
    return null;
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  setBreadcrumbMenu: node => dispatch(setBreadcrumbMenu(node)),
  clearBreadcrumbMenu: () => dispatch(clearBreadcrumbMenu()),
});

const wrappedBreadcrumbMenu = connect(undefined, mapDispatchToProps)(BreadcrumbMenu);
wrappedBreadcrumbMenu.displayName = 'BreadcrumbMenu';

export default wrappedBreadcrumbMenu;
