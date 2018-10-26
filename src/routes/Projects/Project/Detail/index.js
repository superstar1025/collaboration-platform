
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row, Col } from 'reactstrap';

import { injectIntl } from 'components/Intl';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';
import ButtonLink from 'components/ButtonLink';
import { selectState } from 'redux/selectors';

import DashboardCard from './components/DashboardCard';
import WordCloudsCard from './components/WordCloudsCard';

// TODO: Replace following actions with meaningful ones.
const getCards = ({ formatMessage, project }) => [
  {
    bgColor: 'primary',
    actions: [
      { label: 'Action1', onClick: console.log },
      { label: 'Action2', onClick: console.log },
    ],
    count: project.getIn(['keywords', 'length']) || 0,
    type: formatMessage('Keywords'),
  },
  {
    bgColor: 'info',
    actions: [
      { label: 'Action1', onClick: console.log },
      { label: 'Action2', onClick: console.log },
      { label: 'Action3', onClick: console.log },
    ],
    count: project.getIn(['mentions', 'length']) || 0,
    type: formatMessage('Mentions'),
  },
  {
    bgColor: 'success',
    actions: [
      { label: 'Action2', onClick: console.log },
      { label: 'Action3', onClick: console.log },
    ],
    count: project.getIn(['people', 'length']) || 0,
    type: formatMessage('People'),
  },
  {
    bgColor: 'warning',
    actions: [
      { label: 'Action2', onClick: console.log },
    ],
    count: project.getIn(['companies', 'length']) || 0,
    type: formatMessage('Companies'),
  },
];

const getWordCloudsCards = ({ formatMessage, project }) => [
  {
    title: formatMessage('Phrases'),
    words: project.toJS().phrases || [],
  },
  {
    title: formatMessage('Tags'),
    words: project.toJS().tags || [],
  },
  {
    title: formatMessage('Hosts'),
    words: project.toJS().hosts || [],
  },
  {
    title: formatMessage('Hashtags'),
    words: project.toJS().hashtags || [],
  },
  {
    title: formatMessage('Match Types'),
    words: project.toJS().matchTypes || [],
  },
  {
    title: formatMessage('Mentions'),
    words: project.toJS().mentions || [],
  },
];

export const ProjectDetail = ({ formatMessage, match: { params: { projectId } }, project }) => (
  <div className="animated fadeIn">
    <BreadcrumbMenu>
      {formatMessage('{count} {count, plural, one {member} other {members}}', { count: (project.getIn(['members', 'length']) || 0) })}
      <ButtonLink className="no-border" handleClick={console.log} icon="fa fa-gear">
        {formatMessage('Settings')}
      </ButtonLink>
    </BreadcrumbMenu>
    <HeaderTitle>{formatMessage('Project {projectName}', { projectName: project.getIn(['attributes', 'name']) || '--' })}</HeaderTitle>
    {formatMessage('Projects')} {projectId}
    <Row>
      {
        getCards({ formatMessage, project }).map(card => (
          <Col xs="12" sm="6" lg="3" key={card.bgColor}>
            <DashboardCard {...card} />
          </Col>
        ))
      }
    </Row>
    <Row>
      {
        getWordCloudsCards({ formatMessage, project }).map(card => (
          <Col xs="12" sm="6" md="4" key={card.title}>
            <WordCloudsCard {...card} />
          </Col>
        ))
      }
    </Row>
  </div>
);

ProjectDetail.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }).isRequired,
  project: ImmutablePropTypes.mapContains({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('project', 'project')(state, 'project'),
});

export default connect(mapStateToProps)(injectIntl(ProjectDetail));
