import React from 'react';
import PropTypes from 'prop-types';
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

import { injectIntl } from 'components/Intl';

export const AddTeamModal = ({ isOpen, toggle, onSave, className, formatMessage }) => (
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
      <ModalHeader toggle={toggle}>{formatMessage('New Team')}</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label htmlFor="name">{formatMessage('Team Name')}</Label>
          <Input type="text" name="name" required />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="description">{formatMessage('Team Description')}</Label>
          <Input type="text" name="description" required />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>{formatMessage('Cancel')}</Button>{' '}
        <Button type="submit" color="primary">{formatMessage('Add Team')}</Button>
      </ModalFooter>
    </Form>
  </Modal>
);

AddTeamModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  className: PropTypes.string,
  formatMessage: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

AddTeamModal.defaultProps = {
  className: '',
};

export default injectIntl(AddTeamModal);
