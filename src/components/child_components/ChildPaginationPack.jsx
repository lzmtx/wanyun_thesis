/**
 * 后台子组件-分页器组件
 */
import React, { Component } from 'react';
import { Pagination } from 'antd'

class ChildPaginationPack extends Component {
  // 监听显示个数的变化
  onShowSizeChange = (current, pageSize) => {
    this.props.requestDate(current, pageSize)
  }
  // 监听页码的变化
  handlePageNumChange = (page, pageSize) => {
    this.props.requestDate(page, pageSize)
  }
  render() {
    return (
      <Pagination
        showSizeChanger={true}
        onChange={this.handlePageNumChange}
        onShowSizeChange={this.onShowSizeChange}
        current={this.props.paginationDate.pageNum}
        total={this.props.paginationDate.totalRecord}
        pageSize={this.props.paginationDate.pageSize}
        pageSizeOptions={['5', '10', '20', '30', '40']}
      />
    );
  }
}

export default ChildPaginationPack;