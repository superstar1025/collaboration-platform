import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { getSelector } from 'redux/selectors';
import { injectIntl } from 'components/Intl';
import { clearConfirmMessage } from 'redux/ui/actions';

export const ConfirmDialog = ({ formatMessage, confirmMessage, clearConfirmMessage }) => (
  <Modal
    isOpen={!!confirmMessage.get('title')}
    toggle={clearConfirmMessage}
  >
    <ModalHeader>
      {confirmMessage.get('title')}
    </ModalHeader>
    <ModalBody>
      {confirmMessage.get('message')}
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={clearConfirmMessage}>{formatMessage('Cancel')}</Button>{' '}
      <Button
        onClick={() => {
          confirmMessage.get('action')();
          clearConfirmMessage();
        }}
        color="primary"
      >
        {formatMessage('Ok')}
      </Button>
    </ModalFooter>
  </Modal>
);

ConfirmDialog.propTypes = {
  confirmMessage: ImmutablePropTypes.mapContains({
    title: PropTypes.string,
    message: PropTypes.string,
    action: PropTypes.func,
  }).isRequired,
  clearConfirmMessage: PropTypes.func.isRequired,
  formatMessage: PropTypes.func.isRequired,
};

/* istanbul ignore next */
const mapStateToProps = state => ({
  confirmMessage: getSelector('ui', 'confirmMessage')(state),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  clearConfirmMessage: () => dispatch(clearConfirmMessage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ConfirmDialog));
