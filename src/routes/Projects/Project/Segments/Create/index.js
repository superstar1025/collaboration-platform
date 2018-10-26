import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';
import Tabs from 'components/Tabs';
import HeaderTitle from 'components/HeaderTitle';
import { listFilterTypes } from 'redux/filter_type/actions';
import { selectState } from 'redux/selectors';

import CreateSegmentCard from './components/CreateSegmentCard';

export class SegmentCreate extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string,
      }),
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    listFilterTypes: PropTypes.func.isRequired,
    filterTypes: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
  }

  componentWillMount() {
    const { listFilterTypes, match: { params: { projectId } } } = this.props;
    listFilterTypes(projectId);
  }

  render() {
    const { formatMessage, match: { params: { projectId } }, filterTypes, history } = this.props;
    return (
      <div>
        <BreadcrumbItem to={`/projects/${projectId}/segments/new`}>
          {formatMessage('Add Segment')}
        </BreadcrumbItem>
        <HeaderTitle>
          {formatMessage('Add Segment')}
        </HeaderTitle>
        <Row>
          <Col xs="12">
            <CreateSegmentCard
              projectId={projectId}
              history={history}
            />
          </Col>
        </Row>
        <h2>{formatMessage('Create from Template')}</h2>
        <Tabs
          tabs={
            [{ attributes: { name: 'All' } }]
            .concat(filterTypes.toJS())
            .map(({ attributes: { name } }) => ({
              title: formatMessage(name),
              content: null,
            }))}
          />
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('filterType', 'filterTypes')(state, 'filterTypes'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  listFilterTypes: projectId => dispatch(listFilterTypes(projectId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SegmentCreate));
