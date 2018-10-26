import React from 'react';
import PropTypes from 'prop-types';
import { noop, startCase } from 'lodash';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Button,
  Input,
  FormGroup,
  Label,
} from 'reactstrap';
import Serializer from 'helpers/form-serialize';

import { injectIntl } from 'components/Intl';
import Select from 'components/Select';

export const ConfigDialog = ({
  isOpen,
  toggle,
  onUpdate,
  className,
  formatMessage,
  defaultConfig,
  agentType: { config, default_schedule: defaultSchedule },
  schedules,
}) => isOpen && (
  <Modal
    isOpen={isOpen}
    toggle={toggle}
    className={` ${className}`.split(' ').join(' modal-')}
  >
    <Form onSubmit={(e) => {
      e.preventDefault();
      const config = Serializer.serialize(e.target, { hash: true });
      toggle();
      onUpdate(config);
    }}>
      <ModalHeader toggle={toggle}>
        {config.type}
        {defaultSchedule && (
          <div className="schedule-header">
            <Label htmlFor="schedule">Schedule</Label>
            <Select
              options={schedules.map(schedule => ({ value: schedule, label: startCase(schedule) }))}
              name="schedule"
              defaultValue={defaultConfig.schedule || defaultSchedule}
              required
            />
          </div>
        )}
      </ModalHeader>
      <ModalBody>
        <p>{config.description}</p>
        {
          config.fields.map(({
            type, name, help, description, options, display_name: displayName, ...props
          }, index) => {
            let inputField = null;
            const inputProps = {
              ...props,
              name,
              defaultValue: defaultConfig[name],
            };
            switch (type) {
              case 'text':
                inputField = <Input type="text" {...inputProps} />;
                break;
              case 'textarea':
                inputField = <Input type="textarea" {...inputProps} />;
                break;
              case 'boolean':
                inputField = (
                  <Label className="switch switch-sm switch-default switch-primary" style={{ marginLeft: 10 }}>
                    <Input
                      type="checkbox"
                      className="switch-input"
                      {...inputProps}
                    />
                    <span className="switch-label" />
                    <span className="switch-handle" />
                  </Label>
                );
                break;
              case 'select':
                if (options.length && defaultConfig[name]) {
                  const selectedOption = options.find(option => `${(option.id || option.value)}` === `${defaultConfig[name]}`);
                  inputProps.defaultValue = selectedOption.id || selectedOption.value;
                }
                inputField = (
                  <Select
                    options={
                      options.map(({ id, value, name }) =>
                        ({ value: id || value, label: name }))
                    }
                    {...inputProps}
                  />
                );
                break;
              default:
                break;
            }
            return (
              <FormGroup key={index}>
                <Label htmlFor={name}>{displayName || startCase(name)}</Label>
                {inputField}
                <div style={{ fontSize: 9, color: 'gray', marginTop: -1 }}>{help || description}</div>
              </FormGroup>
            );
          })
        }
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>{formatMessage('Cancel')}</Button>{' '}
        <Button type="submit" color="primary">{formatMessage('Save Changes')}</Button>
      </ModalFooter>
    </Form>
  </Modal>
);

ConfigDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func,
  className: PropTypes.string,
  formatMessage: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  defaultConfig: PropTypes.shape({}),
  agentType: PropTypes.shape({
    config: PropTypes.shape({
      type: PropTypes.string,
    }),
  }),
  schedules: PropTypes.arrayOf(PropTypes.string),
};

ConfigDialog.defaultProps = {
  className: '',
  onUpdate: noop,
  toggle: noop,
  defaultConfig: {},
  agentType: { config: { fields: [] } },
  schedules: [],
};

const injectIntlConfigDialog = injectIntl(ConfigDialog);
injectIntlConfigDialog.displayName = 'ConfigDialog';
export default injectIntlConfigDialog;
