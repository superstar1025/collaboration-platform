import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { setSidebarItems } from 'redux/ui/actions';
import { getSelector } from 'redux/selectors';

export class SidebarItems extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ).isRequired,
    sidebarItems: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        name: PropTypes.string,
      }),
    ).isRequired,
    setSidebarItems: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { items, sidebarItems, setSidebarItems } = this.props;
    setSidebarItems(items.concat(sidebarItems.toJS()));
  }
  componentWillReceiveProps({ items, sidebarItems, setSidebarItems }) {
    if (items !== this.props.items) {
      setSidebarItems(items.concat(sidebarItems.toJS().slice(items.length)));
    }
  }
  componentWillUnmount() {
    const { items, sidebarItems, setSidebarItems } = this.props;
    setSidebarItems(sidebarItems.toJS().slice(items.length));
  }
  render() {
    return null;
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  sidebarItems: getSelector('ui', 'sidebarItems')(state),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  setSidebarItems: node => dispatch(setSidebarItems(node)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarItems);
