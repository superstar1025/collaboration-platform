import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { injectIntl } from 'components/Intl';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';
import ButtonLink from 'components/ButtonLink';
import SmartItemGroup from 'components/SmartItemGroup';
import NotificationCard from 'components/NotificationCard';
import SearchBox from 'components/SearchBox';
import { listSegments, removeSegment } from 'redux/segment/actions';
import { setConfirmMessage } from 'redux/ui/actions';
import { selectState, getRequestingSelector } from 'redux/selectors';

import SegmentCard from './components/SegmentCard';

export class SegmentsList extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    segments: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
    segmentsRequesting: PropTypes.bool.isRequired,
    segmentsMeta: ImmutablePropTypes.mapContains({
      total: PropTypes.number,
    }).isRequired,
    project: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    listSegments: PropTypes.func.isRequired,
    removeSegment: PropTypes.func.isRequired,
    removeSegmentRequesting: PropTypes.bool.isRequired,
    setConfirmMessage: PropTypes.func.isRequired,
  };

  state = { pageIndex: 1, search: '' };

  componentWillMount() {
    this.load();
  }

  componentWillReceiveProps({ removeSegmentRequesting }) {
    if (!removeSegmentRequesting && this.props.removeSegmentRequesting) {
      this.load();
    }
  }

  onSearch = (value) => {
    const { listSegments, match: { params: { projectId } } } = this.props;
    this.setState({ search: value, pageIndex: 1 });
    listSegments(projectId, { 'page[number]': 1, search: value });
  }

  load = () => {
    const { listSegments, match: { params: { projectId } } } = this.props;
    const { pageIndex, search } = this.state;
    listSegments(projectId, { 'page[number]': pageIndex, search });
  }

  loadPage = (index) => {
    const { listSegments, match: { params: { projectId } } } = this.props;
    const { search } = this.state;
    this.setState({ pageIndex: index });
    listSegments(projectId, { 'page[number]': index, search });
  }

  render() {
    const {
      formatMessage,
      project,
      segmentsRequesting,
      removeSegmentRequesting,
      segmentsMeta,
      segments,
      match: { params: { projectId } },
      removeSegment,
      setConfirmMessage,
    } = this.props;
    const segmentsCount = formatMessage('{count} {count, plural, one {segment} other {segments}}', { count: segmentsRequesting ? '--' : segmentsMeta.get('total') });
    const ghost = segmentsRequesting || removeSegmentRequesting;
    const ItemComponent = props =>
      <SegmentCard {...props} projectId={projectId} ghost={ghost} />;
    return (
      <div className="animated fadeIn">
        <Helmet
          title={formatMessage('Segments')}
          meta={[
            { name: 'description', content: formatMessage('This is a page to list all segments.') },
          ]}
        />
        <BreadcrumbMenu>
          <SearchBox onSearch={this.onSearch} />
          <ButtonLink className="no-border" handleClick={this.load}>
            {segmentsCount}
          </ButtonLink>
          <ButtonLink className="no-border" to={`/projects/${projectId}/segments/new`} icon="fa fa-plus">
            {formatMessage('Add Segments(s)')}
          </ButtonLink>
        </BreadcrumbMenu>
        <HeaderTitle>
          {formatMessage(
            'All Segments of Project {projectName}',
            { projectName: project.getIn(['attributes', 'name']) || '--' },
          )}
        </HeaderTitle>
        {
          !ghost && !segments.size ? (
            <NotificationCard
              icon="pie-chart"
              title={formatMessage('There are no segments')}
              description={formatMessage('Please, add a segment to get started.')}
            />
          ) : (
            <SmartItemGroup
              data={segments.toJS()}
              ItemComponent={ItemComponent}
              total={segmentsMeta.get('total')}
              onPageChange={this.loadPage}
              ghost={ghost}
              checkable
              remove={segmentId => setConfirmMessage({
                title: formatMessage('Remove Segment'),
                message: formatMessage('Are you sure you want to remove the segment?'),
                action: () => removeSegment(projectId, segmentId),
              })}
            />
          )
        }
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('project', 'project')(state, 'project'),
  ...selectState('segment', 'segments')(state, 'segments'),
  removeSegmentRequesting: getRequestingSelector('segment', 'removeSegment')(state),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  listSegments: (projectId, query) => dispatch(listSegments(projectId, query)),
  removeSegment: (projectId, segmentId) => dispatch(removeSegment(projectId, segmentId)),
  setConfirmMessage: payload => dispatch(setConfirmMessage(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SegmentsList));
