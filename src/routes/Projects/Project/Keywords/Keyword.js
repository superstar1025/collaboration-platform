
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import BreadcrumbItem from 'components/BreadcrumbItem';
import { selectState } from 'redux/selectors';
import { readKeyword } from 'redux/keyword/actions';

export class Keyword extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        keywordId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
    keyword: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    readKeyword: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { match: { params: { projectId, keywordId } }, readKeyword } = this.props;
    readKeyword(projectId, keywordId);
  }

  render() {
    const { match: { params: { projectId, keywordId } }, keyword } = this.props;
    return (
      <div>
        <BreadcrumbItem to={`/projects/${projectId}/keywords/${keywordId}`}>
          {keyword.getIn(['attributes', 'name'])}
        </BreadcrumbItem>
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('keyword', 'keyword')(state, 'keyword'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  readKeyword: (...args) => dispatch(readKeyword(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Keyword);
