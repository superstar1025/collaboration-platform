import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  // Label,
  // Input,
  Button,
} from 'reactstrap';
import Serializer from 'helpers/form-serialize';
import Select from 'components/Select';
import { injectIntl } from 'components/Intl';

export class AddProjectModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    className: PropTypes.string,
    formatMessage: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    teamName: PropTypes.string,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.string, PropTypes.number,
        ]),
      }),
    ),
  };

  static defaultProps = {
    className: '',
    teamName: '',
    users: [
      {
        id: '1',
      },
    ],
  };

  state = {}

  render() {
    const { isOpen, toggle, onSave, className, formatMessage, teamName, users } = this.props;
    const userOptions = [];
    users.map((user) => {
      const option = {
        value: user.id,
        label: user.attributes.name,
      };
      userOptions.push(option);
    });
    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className={` ${className}`.split(' ').join(' modal-')}
      >
        <Form onSubmit={(e) => {
          e.preventDefault();
          onSave(Serializer.serialize(e.target, { hash: true }));
          toggle();
        }}>
          <ModalHeader toggle={toggle}>{formatMessage('Add project to')} {teamName}</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Select
                options={userOptions}
                name="user_id"
              />
            </FormGroup>
            <FormGroup>
              <Select
                options={[
                  { value: 'owner', label: 'Owner' },
                  { value: 'reader', label: 'Reader' },
                ]}
                name="role"
                defaultValue="owner"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>{formatMessage('Cancel')}</Button>{' '}
            <Button type="submit" color="primary">{formatMessage('Add')}</Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

export default injectIntl(AddProjectModal);
