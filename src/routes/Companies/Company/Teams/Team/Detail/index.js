import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, Button, Input, Form, FormGroup, Label } from 'reactstrap';

import Serializer from 'helpers/form-serialize';
import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';
import { injectIntl } from 'components/Intl';
import { selectState } from 'redux/selectors';
import { updateTeam } from 'redux/team/actions';

export class TeamDetail extends Component {
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
    updateTeam: PropTypes.func.isRequired,
  };

  state = { editable: false, description: '' }

  componentWillReceiveProps({ team }) {
    this.setState({
      description: team.getIn(['attributes', 'description']) || '',
    });
  }

  onEdit = () => {
    this.setState({ editable: true });
  }

  onCancel = () => {
    this.setState({ editable: false });
  }

  onDescriptionChange = ({ target: { value } }) => this.setState({ description: value });

  render() {
    const {
      match: { params: { companyId, teamId } },
      team,
      formatMessage,
      updateTeam,
    } = this.props;
    const {
      editable,
      description,
    } = this.state;
    const teamName = team.getIn(['attributes', 'name']) || '--';
    const teamDescription = team.getIn(['attributes', 'description']) || formatMessage('There is no description yet');
    return (
      <div>
        <BreadcrumbItem to={`/companies/${companyId}/teams/${teamId}`}>
          {teamName}
        </BreadcrumbItem>
        <HeaderTitle>
          {formatMessage('Team')} {teamName}
        </HeaderTitle>
        <Card>
          <CardHeader>
            <h3 className="float-left">
              {teamName}
            </h3>
          </CardHeader>
          <CardBody>
            {editable ? (
              <div>
                <Form onSubmit={(e) => {
                  e.preventDefault();
                  updateTeam(
                    companyId,
                    teamId,
                    {
                      ...Serializer.serialize(e.target, { hash: true }),
                    },
                  );
                  this.setState({ editable: false });
                }}>
                  <FormGroup>
                    <Label htmlFor="description"><h5>{formatMessage('Description')}</h5></Label>
                    <Input type="text" name="description" value={description} onChange={this.onDescriptionChange} required />
                  </FormGroup>
                  <Button type="submit" color="primary">{formatMessage('Save')}</Button>
                  <Button color="secondary" className="ml-3" onClick={() => this.onCancel()}>
                    {formatMessage('Cancel')}
                  </Button>
                </Form>
              </div>) : (
                <div>
                  <span>
                    {teamDescription}
                  </span>
                  <Button color="link" className="float-right" onClick={() => this.onEdit()}>
                    {formatMessage('Edit')}
                  </Button>
                </div>
              )
            }
          </CardBody>
        </Card>
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
  updateTeam: (companyId, teamId, payload) =>
    dispatch(updateTeam(companyId, teamId, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TeamDetail));
