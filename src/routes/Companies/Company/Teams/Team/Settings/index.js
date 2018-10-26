import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  CardFooter,
} from 'reactstrap';

import Serializer from 'helpers/form-serialize';
import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';
import Select from 'components/Select';
import { injectIntl } from 'components/Intl';
import { selectState } from 'redux/selectors';
import { readTeam, updateTeam, removeTeam } from 'redux/team/actions';
import { setConfirmMessage } from '../../../../../../redux/ui/actions';

export class Settings extends Component {
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
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    readTeam: PropTypes.func.isRequired,
    updateTeam: PropTypes.func.isRequired,
    removeTeam: PropTypes.func.isRequired,
    teamRequesting: PropTypes.bool.isRequired,
    formatMessage: PropTypes.func.isRequired,
    setConfirmMessage: PropTypes.func.isRequired,
  };

  state = { teamName: '', teamDescription: '' };

  componentWillMount() {
    const { match: { params: { companyId, teamId } }, readTeam } = this.props;
    readTeam(companyId, teamId);
  }

  componentWillReceiveProps({ team }) {
    this.setState({
      teamName: team.getIn(['attributes', 'name']),
      teamDescription: team.getIn(['attributes', 'description']) || '',
    });
  }

  teamNameChange = ({ target: { value } }) => this.setState({ teamName: value });

  teamDescriptionChange = ({ target: { value } }) => this.setState({ teamDescription: value });

  deleteTeam = () => {
    const {
      match: { params: { companyId, teamId } },
      removeTeam,
      formatMessage,
      setConfirmMessage,
      history,
    } = this.props;
    setConfirmMessage({
      title: formatMessage('Delete this team'),
      message: formatMessage('Are you sure you want to remove the team?'),
      action: () => {
        removeTeam(companyId, teamId);
        history.push(`/companies/${companyId}/teams`);
      },
    });
  }

  render() {
    const {
      match: { params: { companyId, teamId } },
      team,
      updateTeam,
      teamRequesting,
      formatMessage,
    } = this.props;
    const teamName = team.getIn(['attributes', 'name']) || '--';
    const teamVisibility = team.getIn(['attributes', 'visibility']) || 0;
    return (
      <div>
        <BreadcrumbItem to={`/companies/${companyId}/teams/${teamId}/settings`}>
          {formatMessage('settings')}
        </BreadcrumbItem>
        <HeaderTitle>
          {formatMessage('Team')} {teamName}
        </HeaderTitle>
        <Card>
          <CardHeader>
            {formatMessage('Team settings')}
          </CardHeader>
          <CardBody>
            <Form onSubmit={(e) => {
              e.preventDefault();
              updateTeam(
                companyId,
                teamId,
                {
                  ...Serializer.serialize(e.target, { hash: true }),
                },
              );
            }}>
              <FormGroup>
                <Label htmlFor="name"><h5>{formatMessage('Team Name')}</h5></Label>
                <Input type="text" name="name" value={this.state.teamName || ''} onChange={this.teamNameChange} required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="description"><h5>{formatMessage('Description')}</h5></Label>
                <Input type="text" name="description" value={this.state.teamDescription} onChange={this.teamDescriptionChange} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="visibility"><h5>{formatMessage('Team visibility')}</h5></Label>
                <Select
                  options={[
                    { value: 0, label: 'Visible' },
                    { value: 1, label: 'Secret' },
                  ]}
                  name="visibility"
                  defaultValue={teamVisibility}
                />
              </FormGroup>
              <Button type="submit" color="primary" disabled={teamRequesting}>{formatMessage('Save Changes')}</Button>
            </Form>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <Label className="text-danger">{formatMessage('Danger zone')}</Label>
          </CardHeader>
          <CardBody>
            <Label>{formatMessage('Delete this team')}</Label> <br />
            <Label>{formatMessage('Once deleted, it will be gone forever. Please be certain.')}</Label> <br />
          </CardBody>
          <CardFooter>
            <Button color="danger" onClick={this.deleteTeam}>{formatMessage('Delete this team')}</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('team', 'team')(state, 'team'),
  ...selectState('team', 'teams')(state, 'teams'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  readTeam: (companyId, teamId) => dispatch(readTeam(companyId, teamId)),
  updateTeam: (companyId, teamId, payload) =>
    dispatch(updateTeam(companyId, teamId, payload)),
  setConfirmMessage: payload => dispatch(setConfirmMessage(payload)),
  removeTeam: (companyId, teamId) => dispatch(removeTeam(companyId, teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Settings));
