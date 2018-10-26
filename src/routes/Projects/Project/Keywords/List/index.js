import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { get, uniq, without, noop } from 'lodash';

import { injectIntl } from 'components/Intl';
import { selectState, getRequestingSelector } from 'redux/selectors';
import { listKeywords, createKeywords, removeKeyword, removeMultipleKeywords } from 'redux/keyword/actions';
import { listNegativeKeywords, createNegativeKeywords, removeNegativeKeyword, removeMultipleNegativeKeywords } from 'redux/negative_keyword/actions';
import BreadcrumbMenu from 'components/BreadcrumbMenu';
import ButtonLink from 'components/ButtonLink';
import HeaderTitle from 'components/HeaderTitle';
import SmartTable from 'components/SmartTable';
import NotificationCard from 'components/NotificationCard';
import SearchBox from 'components/SearchBox';

import AddKeywordsModal from './components/AddKeywordsModal';
import { setConfirmMessage } from '../../../../../redux/ui/actions';

export class KeywordsList extends Component {
  static propTypes = {
    formatMessage: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }).isRequired,
    keywordsMeta: ImmutablePropTypes.mapContains({
      total: PropTypes.number,
    }).isRequired,
    negativeKeywordsMeta: ImmutablePropTypes.mapContains({
      total: PropTypes.number,
    }).isRequired,
    project: ImmutablePropTypes.mapContains({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    listKeywords: PropTypes.func.isRequired,
    listNegativeKeywords: PropTypes.func.isRequired,
    createKeywords: PropTypes.func.isRequired,
    createNegativeKeywords: PropTypes.func.isRequired,
    setConfirmMessage: PropTypes.func.isRequired,
    removeKeyword: PropTypes.func.isRequired,
    removeNegativeKeyword: PropTypes.func.isRequired,
    removeMultipleKeywords: PropTypes.func.isRequired,
    removeMultipleNegativeKeywords: PropTypes.func.isRequired,
  };

  state = {
    createModal: false,
    pageIndex: 1,
    tags: [],
    addKeywords: '',
    negative: false,
    list: this.props.listKeywords,
    remove: this.props.removeKeyword,
    removeMultiple: this.props.removeMultipleKeywords,
    createRequesting: 'createKeywordsRequesting',
    removeRequesting: 'removeKeywordRequesting',
    requesting: 'keywordsRequesting',
    data: 'keywords',
    meta: 'keywordsMeta',
    search: '',
  };

  componentWillMount() {
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    const { createRequesting, removeRequesting } = this.state;
    if (!nextProps[createRequesting] && this.props[createRequesting]) {
      this.load();
    } else if (!nextProps[removeRequesting] && this.props[removeRequesting]) {
      this.load();
    }
  }

  onAddTags = (checks) => {
    this.setState({
      createModal: true,
      addKeywords: checks.map(check => get(check, 'attributes.name') || '***').join('\n'),
    });
  }

  onSearch = (value) => {
    const { match: { params: { projectId } } } = this.props;
    const { tags, list } = this.state;
    this.setState({ search: value, pageIndex: 1 });
    list(projectId, { 'page[number]': 1, tag: this.getTag(tags), search: value });
  }

  getTag = tags => (tags.length ? tags.join(' ') : undefined);

  load = () => {
    const { match: { params: { projectId } } } = this.props;
    const { tags, pageIndex, list, search } = this.state;
    list(projectId, { 'page[number]': pageIndex, tag: this.getTag(tags), search });
  }

  toggleCreateModal = () => this.setState({ createModal: !this.state.createModal, addKeywords: '' })

  toggleNegative = () => {
    const {
      listKeywords,
      listNegativeKeywords,
      removeKeyword,
      removeNegativeKeyword,
      removeMultipleKeywords,
      removeMultipleNegativeKeywords,
      match: { params: { projectId } },
    } = this.props;
    if (this.state.negative) {
      this.setState({
        negative: false,
        createRequesting: 'createKeywordsRequesting',
        removeRequesting: 'removeKeywordRequesting',
        requesting: 'keywordsRequesting',
        data: 'keywords',
        meta: 'keywordsMeta',
        addKeywords: '',
        list: listKeywords,
        remove: removeKeyword,
        removeMultiple: removeMultipleKeywords,
        tags: [],
        pageIndex: 1,
        search: '',
      });
      listKeywords(projectId, { 'page[number]': 1 });
    } else {
      this.setState({
        negative: true,
        createRequesting: 'createNegativeKeywordsRequesting',
        removeRequesting: 'removeNegativeKeywordRequesting',
        requesting: 'negativeKeywordsRequesting',
        data: 'negativeKeywords',
        meta: 'negativeKeywordsMeta',
        addKeywords: '',
        list: listNegativeKeywords,
        remove: removeNegativeKeyword,
        removeMultiple: removeMultipleNegativeKeywords,
        tags: [],
        pageIndex: 1,
        search: '',
      });
      listNegativeKeywords(projectId, { 'page[number]': 1 });
    }
  }

  loadPage = (index) => {
    const { match: { params: { projectId } } } = this.props;
    const { list, search, tags } = this.state;
    this.setState({ pageIndex: index });
    list(projectId, { 'page[number]': index, tag: this.getTag(tags), search });
  }

  loadByTag = (tags) => {
    const { match: { params: { projectId } } } = this.props;
    const { list, search } = this.state;
    const newTags = uniq(this.state.tags.concat(tags));
    this.setState({ tags: newTags });
    list(projectId, { 'page[number]': this.state.pageIndex, tag: this.getTag(newTags), search });
  }

  removeTagFilter = (tag) => {
    const { match: { params: { projectId } } } = this.props;
    const { list, search } = this.state;
    const newTags = without(this.state.tags, tag);
    this.setState({ tags: newTags });
    list(projectId, { 'page[number]': this.state.pageIndex, tag: this.getTag(newTags), search });
  }

  render() {
    const {
      formatMessage,
      keywordsMeta,
      project,
      createKeywords,
      createNegativeKeywords,
      negativeKeywordsMeta,
      match: { params: { projectId } },
      setConfirmMessage,
    } = this.props;
    const {
      createModal,
      addKeywords,
      negative,
      requesting,
      data,
      remove,
      meta,
      tags,
      search,
      removeMultiple,
    } = this.state;
    const keywordsCount = formatMessage('{count} {count, plural, one {keyword} other {keywords}}', { count: this.props[requesting] ? '--' : keywordsMeta.get('total') });
    const negativeKeywordsCount = formatMessage('{count} {count, plural, one {negative keyword} other {negative keywords}}', { count: this.props[requesting] ? '--' : negativeKeywordsMeta.get('total') });
    return (
      <div className="animated fadeIn">
        <Helmet
          title={formatMessage('Keywords')}
          meta={[
            { name: 'description', content: formatMessage('This is a page to list all keywords.') },
          ]}
        />
        <BreadcrumbMenu>
          <SearchBox onSearch={this.onSearch} />
          <ButtonLink className="no-border" handleClick={this.load}>
            {negative ? negativeKeywordsCount : keywordsCount}
          </ButtonLink>
          <ButtonLink className="no-border" handleClick={this.toggleCreateModal} icon="fa fa-plus">
            {formatMessage('Add Keyword(s)')}
          </ButtonLink>
          <ButtonLink className="no-border" handleClick={this.toggleNegative} icon={`fa fa-${negative ? 'key' : 'shield'}`}>
            {negative ? formatMessage('Keywords') : formatMessage('Negative Keywords')}
          </ButtonLink>
        </BreadcrumbMenu>
        {
          negative ? (
            <HeaderTitle>
              {formatMessage(
                'All Negative Keywords of Project {projectName}',
                { projectName: project.getIn(['attributes', 'name']) || '--' },
              )}
            </HeaderTitle>
          ) : (
            <HeaderTitle>
              {formatMessage(
                'All Keywords of Project {projectName}',
                { projectName: project.getIn(['attributes', 'name']) || '--' },
              )}
            </HeaderTitle>
          )
        }
        <AddKeywordsModal
          isOpen={createModal}
          toggle={this.toggleCreateModal}
          className="primary"
          onAddKeywords={payload => createKeywords(projectId, payload)}
          onAddNegativeKeywords={payload => createNegativeKeywords(projectId, payload)}
          negative={negative}
          keywords={addKeywords}
          key={addKeywords}
        />
        {
          !this.props[requesting] && !this.props[data].size && !tags.length && !search.length ? (
            negative ? (
              <NotificationCard
                icon="shield"
                title={formatMessage('There are no negative keywords')}
                description={formatMessage('Please, add negative keywords to get started.')}
              />
            ) : (
              <NotificationCard
                icon="key"
                title={formatMessage('You have not added any keywords yet')}
                description={formatMessage('Keywords are the main driver of mentions, which drive leads. Add topics of interest to drive the system.')}
              />
            )
          ) : (
            <SmartTable
              data={this.props[data].toJS()}
              ghost={this.props[requesting]}
              fields={[
                {
                  label: negative ? formatMessage('Negative Keyword') : formatMessage('Keyword'),
                  name: 'attributes.name',
                  render: ((value, row) => (
                    <Link to={`/projects/${projectId}/keywords/${row.id}`}>{value}</Link>
                  )),
                },
                {
                  label: formatMessage('Tags'),
                  name: 'attributes.tags',
                  render: (value => value.map((tag, index) => (
                    <span style={{ marginRight: 5, marginBottom: 5 }} key={index}>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => this.loadByTag([tag])}
                      >
                        {tag}
                      </Button>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={noop}
                      >
                        <i className="fa fa-close action" />
                      </Button>
                    </span>
                  ))),
                },
                {
                  label: '',
                  name: 'id',
                  render: ((value, row) => (
                    <i
                      className="fa fa-trash action"
                      onClick={() => setConfirmMessage({
                        title: negative ? formatMessage('Remove Negative Keyword') : formatMessage('Remove Keyword'),
                        message: negative ? formatMessage('Are you sure you want to remove the negative keyword?') : formatMessage('Are you sure you want to remove the keyword?'),
                        action: () => remove(projectId, row.id),
                      })}
                    />
                  )),
                },
              ]}
              actions={[
                { icon: 'plus-square', label: formatMessage('Add Tags'), onClick: this.onAddTags },
                {
                  icon: 'trash',
                  label: formatMessage('Remove'),
                  onClick: checks => setConfirmMessage({
                    title: negative ? formatMessage('Remove Negative Keywords') : formatMessage('Remove Keywords'),
                    message: negative ? formatMessage('Are you sure you want to remove the negative keywords?') : formatMessage('Are you sure you want to remove the keywords?'),
                    action: () => removeMultiple(projectId, { selected_ids: checks.map(check => get(check, 'attributes.id') || 'all') }),
                  }),
                },
              ]}
              headerRight={tags.map((tag, index) => (
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => this.removeTagFilter(tag)}
                  style={{ marginRight: 5 }}
                  key={index}
                >
                  {tag} <i className="fa fa-close action" />
                </Button>
              ))}
              onPageChange={this.loadPage}
              total={this.props[meta].get('total')}
              checkable
              key={negative}
            />
          )
        }
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  ...selectState('project', 'project')(state, 'project'),
  ...selectState('keyword', 'keywords')(state, 'keywords'),
  ...selectState('negativeKeyword', 'negativeKeywords')(state, 'negativeKeywords'),
  createKeywordsRequesting: getRequestingSelector('keyword', 'createKeywords')(state),
  createNegativeKeywordsRequesting: getRequestingSelector('negativeKeyword', 'createNegativeKeywords')(state),
  removeKeywordRequesting: getRequestingSelector('keyword', 'removeKeyword')(state),
  removeNegativeKeywordRequesting: getRequestingSelector('negativeKeyword', 'removeNegativeKeyword')(state),
});

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  listKeywords: (projectId, query) => dispatch(listKeywords(projectId, query)),
  listNegativeKeywords: (projectId, query) => dispatch(listNegativeKeywords(projectId, query)),
  createKeywords: (projectId, payload) => dispatch(createKeywords(projectId, payload)),
  createNegativeKeywords: (projectId, payload) =>
    dispatch(createNegativeKeywords(projectId, payload)),
  setConfirmMessage: payload => dispatch(setConfirmMessage(payload)),
  removeKeyword: (projectId, keywordId) => dispatch(removeKeyword(projectId, keywordId)),
  removeNegativeKeyword: (projectId, negativeKeywordId) =>
    dispatch(removeNegativeKeyword(projectId, negativeKeywordId)),
  removeMultipleKeywords: (projectId, payload) =>
    dispatch(removeMultipleKeywords(projectId, payload)),
  removeMultipleNegativeKeywords: (projectId, payload) =>
    dispatch(removeMultipleNegativeKeywords(projectId, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(KeywordsList));
