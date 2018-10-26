import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';
import Serializer from 'helpers/form-serialize';
import { selectState } from 'redux/selectors';
import { injectIntl } from 'components/Intl';
import { updateCompany } from 'redux/company/actions';

export class UpdateCompanyModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    className: PropTypes.string,
    formatMessage: PropTypes.func.isRequired,
    company: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    updateCompany: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: '',
  }

  state = { companyName: '' };

  componentWillReceiveProps({ company }) {
    this.setState({
      companyName: company.getIn(['attributes', 'name']),
    });
  }

  onCompanyNameChange = ({ target: { value } }) => this.setState({ companyName: value });

  render() {
    const {
      isOpen,
      toggle,
      className,
      formatMessage,
      updateCompany,
      company,
    } = this.props;
    const companyId = company.toJS().id;
    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className={` ${className}`.split(' ').join(' modal-')}
      >
        <Form onSubmit={(e) => {
          e.preventDefault();
          updateCompany(companyId, Serializer.serialize(e.target, { hash: true }));
          toggle();
        }}>
          <ModalHeader toggle={toggle}>{formatMessage('Update Company')}</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="name">{formatMessage('Company Name')}</Label>
              <Input type="text" name="name" value={this.state.companyName} onChange={this.onCompanyNameChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>{formatMessage('Cancel')}</Button>{' '}
            <Button type="submit" color="primary">{formatMessage('Done')}</Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('company', 'company')(state, 'company'),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  updateCompany: (companyId, query) => dispatch(updateCompany(companyId, query)),
});


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(UpdateCompanyModal));
