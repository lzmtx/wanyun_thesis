/**
 * 后台-资料管理组件
 */
import React, { Component, Fragment } from 'react'
import { Card, Button, Table, Input, Icon } from 'antd';
import { isStudent, isTeacher, isAdmin } from '../../utils/getUserType'
import {
  reqFileUpload,
  reqStudentCanOperateAllInformation,
  reqAdminCanOperateAllInformation,
  reqDownload,
  reqDocToPdf,
  reqTeacherCanOperateAllInformation,
  reqStudentFuzzyQuery,
  reqTeacherFuzzyQuery
} from '../../api'
import ChildPaginationPack from '../child_components/ChildPaginationPack'
import ChildRefreshBtn from '../child_components/ChildRefreshBtn'
import memoryUtils from '../../utils/memoryUtils';
import ChildUploadFile from '../child_components/ChildUploadFile'
import $ from 'jquery'
import { antCardS } from "../../utils/AddAnimation"

export default class FileMaterial extends Component {
  state = {
    thesis_title: '', //教师输入的论文题目
    dateString: '', // 教师选择的时间
    showLoading: false, // 显示loading
    table_dataSource: [], // 表格数据
    showTeacherComponent: false, // 显示教师组件
    paginationDate: {
      pageNum: 1, // 当前页
      pageSize: 5,  // 每页显示记录数
      startIndex: 0, // 开始下标（从第几条记录开始）
      totalPage: 1, // 总页数
      totalRecord: 1, // 总记录数
    },
    search_content: ''
  }
  componentDidMount () {
    document.title = "资料管理" + memoryUtils.page_title_suffix
    this.getAllFileData()
    antCardS($)
  }

  // 获取资料数据
  getAllFileData = async (pageNum, pageSize) => {
    // 显示loading
    this.setState({ showLoading: true })
    const reqData = [
      pageNum || this.state.paginationDate.pageNum,
      pageSize || this.state.paginationDate.pageSize
    ]
    let res
    if (isStudent()) {
      res = await reqStudentCanOperateAllInformation(...reqData)
    }
    if (isTeacher()) {
      res = await reqTeacherCanOperateAllInformation(...reqData)
    }
    if (isAdmin()) {
      res = await reqAdminCanOperateAllInformation(...reqData)
    }
    // 处理响应数据
    if (res.data.code === 1 && res.data.data.datas) {
      // 设置分页器数据
      this.setState({
        paginationDate: {
          pageNum: res.data.data.pageNum,
          pageSize: res.data.data.pageSize,
          startIndex: res.data.data.startIndex,
          totalPage: res.data.data.totalPage,
          totalRecord: res.data.data.totalRecord
        }
      })
      this.setTableDatas(res.data.data.datas)
    }
  }
  // 模糊查询资料
  fuzzyQuery = async (pageNum, pageSize, data_name) => {
    // 显示loading
    this.setState({ showLoading: true })
    const reqData = [
      pageNum || this.state.paginationDate.pageNum,
      pageSize || this.state.paginationDate.pageSize,
      data_name || this.state.search_content
    ]
    let res
    if (isStudent()) {
      res = await reqStudentFuzzyQuery(...reqData)
    }
    if (isTeacher()) {
      res = await reqTeacherFuzzyQuery(...reqData)
    }
    // 处理响应数据
    if (res.data.data.datas) {
      // 设置分页器数据
      this.setState({
        paginationDate: {
          pageNum: res.data.data.pageNum,
          pageSize: res.data.data.pageSize,
          startIndex: res.data.data.startIndex,
          totalPage: res.data.data.totalPage,
          totalRecord: res.data.data.totalRecord
        }
      })
      this.setTableDatas(res.data.data.datas)
    }
  }
  // 初始化表格的表头
  initTableColumns = () => {
    let columns = [
      {
        title: '文件名',
        dataIndex: 'data_name',
        key: 'data_name',
      },
      {
        title: '上传人ID',
        dataIndex: 'upload_user_id',
        key: 'upload_user_id',
      },
      {
        title: '上传人姓名',
        dataIndex: 'real_name',
        key: 'real_name',
      },
      {
        title: '上传人类型',
        dataIndex: 'upload_role_name',
        key: 'upload_role_name',
      },
      {
        title: '上传时间',
        dataIndex: 'upload_date',
        key: 'upload_date',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <div>
            <Button onClick={() => this.fileDownload(record)}>下载</Button>
            <Button onClick={() => this.showDocToPdf(record)}>预览</Button>
          </div>
        ),
      }
    ]
    return columns
  }
  // 文件下载
  fileDownload = (record) => {
    window.location.href = reqDownload + "?data_name=" + record.data_name + "&upload_user_id=" + record.upload_user_id
  }
  // 在线预览
  showDocToPdf = (record) => {
    window.open(reqDocToPdf + "?fileName=" + record.data_name + "&upload_user_id=" + record.upload_user_id, '_blank', "top=200,left=200,height=600,width=800,status=yes,toolbar=1,menubar=no,location=no,scrollbars=yes");
  }
  // 设置表格数据
  setTableDatas = (Data) => {
    // 构建表格数据
    let jsonArr = []
    Data.map(item => {
      let jsonItem = {
        key: item.dataset_id,
        real_name: item.real_name,
        upload_role_name: item.upload_role_name,
        upload_user_id: item.upload_user_id,
        data_name: item.data_name,
        storage_address: item.storage_address,
        upload_date: item.upload_date
      }
      jsonArr.push(jsonItem)
      return ''
    })
    // 设置表格数据
    this.setState({
      table_dataSource: jsonArr
    })
    // 延时隐藏loading
    setTimeout(() => { this.setState({ showLoading: false }) }, 500)
  }
  // 刷新数据
  handleRefresh = () => {
    this.setState({
      search_content: ""
    }, () => {
      this.getAllFileData(1)
    })
  }
  // 监听搜索框
  handleSearchInputChange = e => {
    this.setState({
      search_content: e.target.value
    })
  }
  // 监听搜索按钮
  handleSearchBtn = async () => {
    if (this.state.search_content) {
      this.fuzzyQuery(1, 5, this.state.search_content)
    } else {
      this.handleRefresh()
    }
  }

  render () {
    return (
      <Fragment>
        {
          isTeacher() || isAdmin() ?
            <Card
              className="card"
              title="资料上传"
              extra={''}
            >
              <ChildUploadFile
                url={reqFileUpload}
                whetherToCallback={this.getAllFileData}
              />
            </Card >
            :
            ''
        }
        <Card
          className="card"
          title={isStudent() ? "资料列表" : "已上传资料"}
          extra={
            <div className="search_box">
              {
                isStudent() || isTeacher() ?
                  <Fragment>
                    <Input
                      className="search_input"
                      onChange={this.handleSearchInputChange}
                      value={this.state.search_content}
                      placeholder="默认加载所有数据"
                      suffix={
                        <Button
                          className="search_btn"
                          style={{ marginRight: -12 }}
                          size="large"
                          onClick={this.handleSearchBtn}
                          type="primary"
                        >
                          <Icon type="search" />
                        </Button>
                      }
                    />
                    <Button type="primary" onClick={this.handleRefresh}>All</Button>
                  </Fragment>
                  :
                  <ChildRefreshBtn onClick={this.handleRefresh} />
              }
            </div>
          }
        >
          <Table
            pagination={false}
            dataSource={this.state.table_dataSource}
            loading={this.state.showLoading}
            columns={this.initTableColumns()}
          />
          <div className="Pagination_bar">
            <ChildPaginationPack
              paginationDate={this.state.paginationDate}
              requestDate={this.state.search_content ? this.fuzzyQuery : this.getAllFileData}
            />
            <div className="clear_both"></div>
          </div>
        </Card>
      </Fragment>
    )
  }
}
