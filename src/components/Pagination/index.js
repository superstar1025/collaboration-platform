import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compact, noop } from 'lodash';
import {
  Pagination as RSPagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';

export class Pagination extends Component {
  static propTypes = {
    pageIndex: PropTypes.number,
    pageCount: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    pageIndex: 1,
    pageCount: 1,
    onChange: noop,
  };

  state = { pageIndex: this.props.pageIndex };

  onChange = (index) => {
    this.setState({ pageIndex: index });
    this.props.onChange(index);
  }

  render() {
    const { pageCount } = this.props;
    const { pageIndex } = this.state;

    /**
     * following lines look complicated but it's smiple in logic
     * if there are 97 actual pages, we can't show all numbers from 1 to 97.
     * suppose you are at 38 page. (pageIndex = 38, pageCount = 97)
     * goal is to show [1, 18, 36, 37, 38, 39, 40, 69, 97]
     * to represent the above with variable names
     * [firstPage, middleStartPage, startPage, startPage + 1, ..., endPage, middleEndPage, lastPage]
     */
    const startPage = Math.max(1, pageIndex - 2);
    const endPage = Math.min(pageCount, pageIndex + 2);
    const firstPage = 1;
    const lastPage = pageCount;
    const middleStartPage = Math.floor((firstPage + startPage) / 2);
    const middleEndPage = Math.ceil((endPage + lastPage) / 2);
    const pages = compact([
      firstPage === middleStartPage ? 0 : firstPage,
      middleStartPage === startPage ? 0 : middleStartPage,
      // this is to render all page numbers from start to end page.
      ...(new Array((endPage - startPage) + 1).fill(0)
        .map((value, index) => index + startPage)),
      middleEndPage === endPage ? 0 : middleEndPage,
      lastPage === middleEndPage ? 0 : lastPage,
    ]);
    if (pages.length < 2) return null;
    return (
      <RSPagination style={{ justifyContent: 'center' }}>
        {
          pages.map((page, index) => (
            <PaginationItem key={index} active={pageIndex === page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.onChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))
        }
      </RSPagination>
    );
  }
}

export default Pagination;
