import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, InputGroupButton, Button, Input } from 'reactstrap';

import { injectIntl } from 'components/Intl';

export class SearchBox extends Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    formatMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    placeholder: '',
  };

  state = { value: '' };

  onKeyUp = (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      this.props.onSearch(this.state.value);
    }
  }

  render() {
    const { onSearch, placeholder, formatMessage } = this.props;
    const { value } = this.state;
    return (
      <InputGroup className="input-group-search">
        <Input
          type="text"
          placeholder={placeholder}
          onChange={e => this.setState({ value: e.target.value })}
          onKeyUp={this.onKeyUp}
        />
        <InputGroupButton>
          <Button color="primary" onClick={() => onSearch(value)}>
            <i className="fa fa-search" /> {formatMessage('Search')}
          </Button>
        </InputGroupButton>
      </InputGroup>
    );
  }
}

const SearchBoxWrapper = injectIntl(SearchBox);
SearchBoxWrapper.displayName = 'SearchBox';

export default SearchBoxWrapper;
