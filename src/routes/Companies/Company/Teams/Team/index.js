import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import BreadcrumbItem from 'components/BreadcrumbItem';
import SidebarItems from 'components/SidebarItems';
import HeaderTitle from 'components/HeaderTitle';
import { injectIntl } from 'components/Intl';
import { selectState } from 'redux/selectors';
import { readTeam, updateTeam } from 'redux/team/actions';
import Routes from './_routes';

export class Team extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        teamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
    team: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    readTeam: PropTypes.func.isRequired,
    formatMessage: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { match: { params: { companyId, teamId } }, readTeam } = this.props;
    readTeam(companyId, teamId);
  }

  render() {
    const {
      match: { params: { companyId, teamId } },
      team,
      formatMessage,
    } = this.props;
    const teamName = team.getIn(['attributes', 'name']);
    return (
      <div>
        <BreadcrumbItem to={`/companies/${companyId}/teams/${teamId}`}>
          {teamName}
        </BreadcrumbItem>
        <HeaderTitle>
          {formatMessage('Team')} {teamName}
        </HeaderTitle>
        <SidebarItems
          items={[
            { title: true, name: teamName },
            {
              name: formatMessage('Membership'),
              url: `/companies/${companyId}/teams/${teamId}/members`,
              icon: 'fa fa-users',
            },
            {
              name: formatMessage('Team'),
              url: `/companies/${companyId}/teams/${teamId}/team`,
              icon: 'fa fa-user-secret',
            },
            {
              name: formatMessage('Projects'),
              url: `/companies/${companyId}/teams/${teamId}/projects`,
              icon: 'fa fa-folder',
            },
            {
              name: formatMessage('Settings'),
              url: `/companies/${companyId}/teams/${teamId}/settings`,
              icon: 'fa fa-cog',
            },
          ]}
        />
        <Routes url="/companies/:companyId/teams/:teamId" />
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('team', 'team')(state, 'team'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  readTeam: (companyId, teamId) => dispatch(readTeam(companyId, teamId)),
  updateTeam: (companyId, teamId, payload) =>
    dispatch(updateTeam(companyId, teamId, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Team));
