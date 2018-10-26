import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import BreadcrumbItem from 'components/BreadcrumbItem';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import ButtonLink from 'components/ButtonLink';
import HeaderTitle from 'components/HeaderTitle';
import NotificationCard from 'components/NotificationCard';
import SmartTable from 'components/SmartTable';
import SearchBox from 'components/SearchBox';
import { injectIntl } from 'components/Intl';
import { selectState, getRequestingSelector } from 'redux/selectors';
import { listMembers, createMember } from 'redux/member/actions';
import { listUsers } from 'redux/user/actions';

import AddMembershipModal from './components/AddMembershipModal';

export class Members extends Component {
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
    formatMessage: PropTypes.func.isRequired,
    members: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
    users: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
    listMembers: PropTypes.func.isRequired,
    listUsers: PropTypes.func.isRequired,
    membersRequesting: PropTypes.bool.isRequired,
    createMember: PropTypes.func.isRequired,
    createMemberRequesting: PropTypes.bool.isRequired,
    membersMeta: ImmutablePropTypes.mapContains({
      total: PropTypes.number,
    }).isRequired,
  };

  state = {
    createModal: false,
    addMembers: '',
  };

  componentWillMount() {
    const { match: { params: { companyId, teamId } }, listMembers, listUsers } = this.props;
    listMembers(companyId, teamId);
    listUsers();
  }

  onSearch = () => {
    const { listMembers, match: { params: { companyId, teamId } } } = this.props;
    listMembers(companyId, teamId);
  }

  loadPage = () => {
    const { match: { params: { companyId, teamId } }, listMembers } = this.props;
    listMembers(companyId, teamId);
  }

  toggleCreateModal = () => this.setState({ createModal: !this.state.createModal, addMembers: '' })

  render() {
    const {
      match: { params: { companyId, teamId } },
      team,
      formatMessage,
      members,
      users,
      membersRequesting,
      createMember,
      createMemberRequesting,
      membersMeta,
    } = this.props;
    const {
      createModal,
      addMembers,
    } = this.state;
    const teamName = team.getIn(['attributes', 'name']);
    const ghost = membersRequesting || createMemberRequesting;
    const membersCount = formatMessage('{count} {count, plural, one {member} other {members}}', { count: membersMeta.get('total') });
    return (
      <div>
        <BreadcrumbItem to={`/companies/${companyId}/teams/${teamId}/members`}>
          {formatMessage('members')}
        </BreadcrumbItem>
        <BreadcrumbMenu>
          <ButtonLink className="no-border" handleClick={this.load}>
            {membersCount}
          </ButtonLink>
        </BreadcrumbMenu>
        <Row>
          <Col md={6} sm={6} xs="12">
            <SearchBox onSearch={this.onSearch} />
          </Col>
          <Col md={6} sm={6} xs="12" className="text-right">
            <ButtonLink className="no-border" handleClick={this.toggleCreateModal} icon="fa fa-plus">
              {formatMessage('Add Member')}
            </ButtonLink>
          </Col>
        </Row>
        <HeaderTitle>
          {formatMessage('Team')} {teamName}
        </HeaderTitle>
        <AddMembershipModal
          isOpen={createModal}
          toggle={this.toggleCreateModal}
          className="primary"
          onSave={payload => createMember(companyId, teamId, payload)}
          teams={addMembers}
          key={addMembers}
          teamName={teamName}
          users={users.toJS()}
        />
        {
          !ghost && !members.size ? (
            <div className="margin-t-20">
              <NotificationCard
                icon="users"
                title={formatMessage('You do not have any members yet')}
                description={formatMessage('You can add new member.')}
              />
            </div>
          ) : (
            <div className="margin-t-20">
              <SmartTable
                data={members.toJS()}
                fields={[
                  {
                    label: formatMessage('Role'),
                    name: 'attributes.role',
                    render: (value => (
                      <span>
                        {value}
                      </span>
                    )),
                  },
                  {
                    label: formatMessage('Created'),
                    name: 'attributes.created_at',
                    render: (value => (
                      <span>
                        {moment(value).fromNow()}
                      </span>
                    )),
                  },
                  {
                    label: formatMessage('Updated'),
                    name: 'attributes.updated_at',
                    render: (value => (
                      <span>
                        {moment(value).fromNow()}
                      </span>
                    )),
                  },
                ]}
                ghost={ghost}
                actions={[]}
                onPageChange={this.loadPage}
                total={membersMeta.get('total')}
                checkable
              />
            </div>
          )
        }
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    ...selectState('team', 'team')(state, 'team'),
    ...selectState('member', 'members')(state, 'members'),
    ...selectState('user', 'users')(state, 'users'),
    createMemberRequesting: getRequestingSelector('member', 'createMember')(state),
  };
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  listMembers: (companyId, teamId, query) => dispatch(listMembers(companyId, teamId, query)),
  listUsers: query => dispatch(listUsers(query)),
  createMember: (companyId, teamId, payload) => dispatch(createMember(companyId, teamId, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Members));
