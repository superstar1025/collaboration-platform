import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RsSelect from 'react-select';

class Select extends Component {

  static propTypes = {
    defaultValue: PropTypes.oneOfType([
      PropTypes.shape, PropTypes.array, PropTypes.string, PropTypes.number,
    ]),
  }

  static defaultProps = {
    defaultValue: null,
  }

  state = { value: this.props.defaultValue };

  onChange = value => this.setState({ value })

  render() {
    const { defaultValue, ...props } = this.props;
    return (
      <RsSelect
        {...props}
        onChange={this.onChange}
        value={this.state.value}
      />
    );
  }
}

export default Select;
