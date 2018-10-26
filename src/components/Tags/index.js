import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select, { Creatable } from 'react-select';
import { Input } from 'reactstrap';

class Tags extends Component {
  static propTypes = {
    creatable: PropTypes.bool,
    name: PropTypes.string,
  };

  static defaultProps ={
    creatable: false,
    name: 'tags',
  };

  state = { tags: [] };

  saveChanges = tags => this.setState({ tags })

  render() {
    const { creatable, name, ...props } = this.props;
    const { tags } = this.state;
    const SelectComponent = creatable ? Creatable : Select;
    const tagString = tags.map(({ value }) => value).join(',');
    return (
      <div className="tags">
        <SelectComponent {...props} multi onChange={this.saveChanges} value={tags} />
        <Input type="hidden" value={tagString} name={name} />
      </div>
    );
  }
}

export default Tags;
