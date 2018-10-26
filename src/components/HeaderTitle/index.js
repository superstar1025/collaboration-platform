import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setHeaderTitle, clearHeaderTitle } from 'redux/ui/actions';

export class HeaderTitle extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    setHeaderTitle: PropTypes.func.isRequired,
    clearHeaderTitle: PropTypes.func.isRequired,
  }
  componentWillMount() {
    const { children, setHeaderTitle } = this.props;
    setHeaderTitle(children);
  }
  componentWillReceiveProps({ children, setHeaderTitle }) {
    if (children !== this.props.children) {
      setHeaderTitle(children);
    }
  }
  componentWillUnmount() {
    const { clearHeaderTitle } = this.props;
    clearHeaderTitle();
  }
  render() {
    return null;
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  setHeaderTitle: node => dispatch(setHeaderTitle(node)),
  clearHeaderTitle: () => dispatch(clearHeaderTitle()),
});

const wrappedHeaderTitle = connect(undefined, mapDispatchToProps)(HeaderTitle);
wrappedHeaderTitle.displayName = 'HeaderTitle';

export default wrappedHeaderTitle;
