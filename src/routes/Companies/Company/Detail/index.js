
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row, Col, Card, CardHeader, CardBody, CardFooter, CardTitle, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import { injectIntl } from 'components/Intl';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import HeaderTitle from 'components/HeaderTitle';
import ButtonLink from 'components/ButtonLink';
import { selectState } from 'redux/selectors';

import UpdateCompanyModal from './components/UpdateCompanyModal';

export class CompanyDetail extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    company: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
  };

  state = {
    editModal: false,
  };

  toggleEditModal = () => this.setState({ editModal: !this.state.editModal })

  render() {
    const {
      formatMessage,
      match: { params: { companyId } },
      company,
    } = this.props;
    const {
      editModal,
    } = this.state;
    const companyName = company.getIn(['attributes', 'name']);
    return (
      <Row>
        <Col xs="12" sm="6" md="4">
          <div className="animated fadeIn">
            <BreadcrumbMenu>
              <ButtonLink className="no-border" handleClick={this.toggleEditModal} icon="fa fa-pencil">
                {formatMessage('Edit')}
              </ButtonLink>
              {formatMessage('{count} {count, plural, one {team} other {teams}}', { count: (company.getIn(['teams', 'length']) || 0) })}
            </BreadcrumbMenu>
            <HeaderTitle>{formatMessage('{companyName}', { companyName: companyName || '--' })}</HeaderTitle>
            <Card>
              <CardHeader className="team-card-header">
                <h3 className="float-left">
                  {formatMessage('Teams')}
                </h3>
              </CardHeader>
              <CardBody className="team-card-body">
                <CardTitle className="title">
                  {formatMessage('Teams let you organize work and simplify access to projects.')}
                </CardTitle>
              </CardBody>
              <CardFooter className="team-card-footer">
                <Link to={`/companies/${companyId}/teams`}>
                  <Button outline color="secondary">
                    {formatMessage('Go to Teams')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          <UpdateCompanyModal
            isOpen={editModal}
            toggle={this.toggleEditModal}
            className="primary"
            company={company}
          />
        </Col>
      </Row>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('company', 'company')(state, 'company'),
});

export default connect(mapStateToProps)(injectIntl(CompanyDetail));
