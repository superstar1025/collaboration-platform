import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import { injectIntl } from 'components/Intl';
import BreadcrumbItem from 'components/BreadcrumbItem';
import Tabs from 'components/Tabs';
import HeaderTitle from 'components/HeaderTitle';

import CreateWorkflowCard from './components/CreateWorkflowCard';

export class WorkflowCreate extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string,
      }),
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  render() {
    const { formatMessage, match: { params: { projectId } }, history } = this.props;
    return (
      <div>
        <BreadcrumbItem to={`/projects/${projectId}/workflows/new`}>
          {formatMessage('Add Workflow')}
        </BreadcrumbItem>
        <HeaderTitle>
          {formatMessage('Add Workflow')}
        </HeaderTitle>
        <Row>
          <Col xs="12">
            <CreateWorkflowCard
              projectId={projectId}
              history={history}
            />
          </Col>
        </Row>
        <h2>{formatMessage('Create from Template')}</h2>
        <Tabs
          tabs={[{ attributes: { name: 'All' } }].map(({ attributes: { name } }) => ({
            title: formatMessage(name),
            content: null,
          }))}
        />
      </div>
    );
  }
}

export default injectIntl(WorkflowCreate);
