import React, { Component, Fragment } from 'react'
import { Card, Button, Table, Modal, Alert, Row, Col } from 'antd'
import { reqSelectAllTeacher, reqAdminBatchAdditionTeacherAccounts, reqUpdateUserSate } from '../../api'
import ChildAddTeacherForm from '../child_components/ChildAddTeacherForm'
import ChildRefreshBtn from '../child_components/ChildRefreshBtn';
import ChildPaginationPack from '../child_components/ChildPaginationPack'
import ChildHideTableLoading from '../child_components/ChildHideTableLoading'
import memoryUtils from '../../utils/memoryUtils';
import ChildSwitch from '../child_components/ChildSwitch'
import ChildUploadFile from '../child_components/ChildUploadFile'
import $ from 'jquery'
import { antCardS } from "../../utils/AddAnimation"

export default class TeacherManagement extends Component {
  state = {
    visible: false,
    visible_result: false,
    buttonLoading: false,
    paginationDate: {
      pageNum: 1, // 当前页
      pageSize: 5,  // 每页显示记录数
      startIndex: 0, // 开始下标（从第几条记录开始）
      totalPage: 1, // 总页数
      totalRecord: 1, // 总记录数
    },
    showLoading: false, // 显示loading
    table_dataSource: [], // 表格数据
    successfulData: [],
    failedData: [],
    resData: {}
  }
  componentDidMount() {
    document.title = "学生管理" + memoryUtils.page_title_suffix
    this.getAllUserData()
    antCardS($)
  }
  // 上传成功
  fileUploadSucceeded = (res) => {
    this.setState({ resData: res }, () => {
      let resData = this.state.resData, item
      for (item in resData) {
        if (item.indexOf("添加成功") !== -1)
          this.state.successfulData.push(resData[item])
        if (item.indexOf("已注册") !== -1)
          this.state.failedData.push(resData[item])
      }
      this.set_tips()
      this.setState({ visible_result: true })
    })
  }
  // 设置提示信息
  set_tips = () => {
    let success_str, success_text, registered_str, registered_text
    success_text = "个工号添加成功："
    registered_text = "个工号已被注册："
    success_str = this.state.successfulData.length + success_text + this.state.successfulData
    registered_str = this.state.failedData.length + registered_text + this.state.failedData
    this.setState({
      success_str,
      registered_str
    })
  }
  // 请求数据
  getAllUserData = async (pageNum, pageSize) => {
    // 显示loading
    this.setState({ showLoading: true })
    let parameter = [
      pageNum || this.state.paginationDate.pageNum,
      pageSize || this.state.paginationDate.pageSize,
    ]
    let res = await reqSelectAllTeacher(...parameter)
    if (res.data.code === 1) {
      // 设置分页器数据
      this.setState({
        paginationDate: {
          pageNum: res.data.data.pageNum,
          pageSize: res.data.data.pageSize,
          totalRecord: res.data.data.totalRecord,
          startIndex: res.data.data.startIndex,
          totalPage: res.data.data.totalPage
        }
      })
      this.showData(res.data.data.datas)
    }
  }
  // 初始化表格
  showData = (Data) => {
    // 构建表格数据
    let jsonArr = []
    Data.map(item => {
      let jsonItem = {
        key: item.user_name,
        user_name: item.user_name,
        real_name: item.real_name,
        state: item.state,
        teacher_title: item.teacher_title,
      }
      jsonArr.push(jsonItem)
      return ''
    })
    // 设置表格数据
    this.setState({
      table_dataSource: jsonArr
    })
    // 延时隐藏loading
    ChildHideTableLoading(this)
  }
  // 设置表头
  initTableColumns = () => {
    const columns = [
      {
        title: '工号',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '姓名',
        dataIndex: 'real_name',
        key: 'real_name',
      },
      {
        title: '职称',
        dataIndex: 'teacher_title',
        key: 'teacher_title',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <ChildSwitch
            record={record}
            checkedChildrenText="封禁"
            unCheckedChildrenText="解封"
            reqUpdateSate={reqUpdateUserSate}
          />
        ),
      }
    ]
    return columns
  }
  DisplayModalBox = () => {
    this.setState({ visible: true })
  }
  handleCancel = () => {
    this.getAllUserData(1)
    this.setState({ visible: false })
  }
  handleCancel_result = () => {
    this.getAllUserData(1)
    this.setState({ visible_result: false })
  }
  // 刷新数据
  handleRefresh = () => {
    this.getAllUserData(1)
  }
  render() {
    return (
      <div>
        <Card
          title="添加教师用户"
          extra={''}
          className="card"
        >
          <Row>
            <Col span={4}>
              <Button type="primary" onClick={this.DisplayModalBox}>
                手动添加
              </Button>
            </Col>
            <Col span={20}>
              <ChildUploadFile
                url={reqAdminBatchAdditionTeacherAccounts}
                whetherToCallback={this.fileUploadSucceeded}
              />
            </Col>
          </Row>
        </Card>

        <Card
          className="card"
          title="教师用户信息"
          extra={<ChildRefreshBtn onClick={this.handleRefresh} />}
        >
          <Table
            pagination={false}
            dataSource={this.state.table_dataSource}
            columns={this.initTableColumns()}
            loading={this.state.showLoading}
          />
          <div className="Pagination_bar">
            <ChildPaginationPack
              paginationDate={this.state.paginationDate}
              requestDate={this.getAllUserData}
            />
          </div>
        </Card>

        <Modal
          title={"添加学生用户"}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          keyboard={false}
          maskClosable={false}
        >
          <ChildAddTeacherForm />
        </Modal>
        <Modal
          title="添加结果"
          visible={this.state.visible_result}
          onCancel={this.handleCancel_result}
          footer={null}
          keyboard={false}
          maskClosable={false}
        >
          {
            this.state.successfulData.length ?
              <Fragment>
                <Alert
                  message="添加成功"
                  description={this.state.success_str}
                  type="success"
                  showIcon
                /><p></p>
              </Fragment> : ''
          }
          {
            this.state.failedData.length ?
              <Alert
                message="添加失败"
                description={this.state.registered_str}
                type="error"
                showIcon
              /> : ''
          }
        </Modal>
      </div>
    )
  }
}
