/**
 * 后台-分组管理
 */
import React, { Component, Fragment } from 'react'
import { Card, Input, Button, Table, message, Form, Modal, Alert, Row, Col } from 'antd'
import { reqSelectUserInformationTwo, reqAdminBatchGroupStudents, reqAdminGroupStudents, reqAdjustmentGrouping } from '../../api'
import ChildRefreshBtn from '../child_components/ChildRefreshBtn';
import ChildPaginationPack from '../child_components/ChildPaginationPack'
import ChildHideTableLoading from '../child_components/ChildHideTableLoading'
import memoryUtils from '../../utils/memoryUtils';
import ChildUploadFile from '../child_components/ChildUploadFile'
import $ from 'jquery'
import { antCardS } from "../../utils/AddAnimation"

class GroupManagement extends Component {
  state = {
    visible_result: false,
    visible_adjustment: false,
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
    student_id: '',
    teacher_id: '',
    resData: {}
  }
  componentDidMount() {
    document.title = "学生管理" + memoryUtils.page_title_suffix
    this.getAllUserData()
    antCardS($)
  }
  grouping_adjustment = async values => {
    let res = await reqAdjustmentGrouping(this.state.teacher_id, this.state.student_id)
    console.log("请求完成，数据：", res)
    if (res.data.code === 1) {
      this.setState({
        teacher_id: '',
        student_id: ''
      })
      message.success(res.data.message)
    } else {
      message.error(res.data.message)
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.grouping(values)
      }
    })
  }
  grouping = async values => {
    let { teacher_name, student_name } = values
    let res = await reqAdminGroupStudents(teacher_name, student_name)
    console.log("请求完成，数据：", res)
    if (res.data.code === 1) {
      message.success(res.data.message)
    } else {
      message.error("神奇：" + res.data.message)
    }
  }
  // 上传成功
  fileUploadSucceeded = (res) => {
    this.setState({ resData: res }, () => {
      let resData = this.state.resData, item
      for (item in resData) {
        if (item.indexOf("分组成功") !== -1)
          this.state.successfulData.push(resData[item])
        if (item.indexOf("用户名不存在") !== -1)
          this.setState({ is_null: "上传的Excel表中有未注册的用户账号！" })
        if (item.indexOf("已分组") !== -1)
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
    let res = await reqSelectUserInformationTwo(...parameter)
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
        key: item.studentUserName,
        studentUserName: item.studentUserName,
        studentRealName: item.studentRealName,
        teacherRealName: item.teacherRealName,
        teacherUserName: item.teacherUserName,
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
    let _this = this
    const columns = [
      {
        title: '教师工号',
        dataIndex: 'teacherUserName',
        key: 'teacherUserName',
      },
      {
        title: '教师姓名',
        dataIndex: 'teacherRealName',
        key: 'teacherRealName',
      },
      {
        title: '学生学号',
        dataIndex: 'studentUserName',
        key: 'studentUserName',
      },
      {
        title: '学生姓名',
        dataIndex: 'studentRealName',
        key: 'studentRealName',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <Button onClick={() => toAdjustment(record)}>调整分组</Button>
          </span>
        )
      }
    ]
    function toAdjustment(record) {
      _this.setState({
        visible_adjustment: true,
        student_id: record.studentUserName
      })
      console.log("点击了调整，当前行数据：", record)
    }
    return columns
  }
  handleSubmit_adjustment = e => {
    if (this.state.student_id && this.state.teacher_id)
      this.grouping_adjustment()
    else
      message.error("请填写所有字段！")
  }
  handleTeacherIdChange = (e) => {
    this.setState({ teacher_id: e.target.value })
  }
  handleCancel_result = () => {
    this.getAllUserData(1)
    this.setState({ visible_result: false })
  }
  handleCancel_adjustment = () => {
    this.getAllUserData()
    this.setState({ visible_adjustment: false })
  }
  // 刷新数据
  handleRefresh = () => {
    this.getAllUserData(1)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Card
          title="分组管理"
          extra={''}
          className="card"
        >
          <Row gutter={10}>
            <Form onSubmit={this.handleSubmit}>
              <Col span={7}>
                <Form.Item>
                  {getFieldDecorator('teacher_name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入工号！',
                      },
                      {
                        validator: this.validateTeacherNumber,
                      },
                    ],
                  })(<Input autoComplete="off" placeholder="6 位教师工号" />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item>
                  {getFieldDecorator('student_name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入学号！',
                      },
                      {
                        validator: this.validateStudentNumber,
                      },
                    ],
                  })(<Input className="test" autoComplete="off" placeholder="8 位学生学号" />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" >
                    确认分组
                  </Button>
                </Form.Item>
              </Col>
              <Col span={6}></Col>
            </Form>
          </Row>
          <Row>
            <Col span={24}>
              <ChildUploadFile
                url={reqAdminBatchGroupStudents}
                whetherToCallback={this.fileUploadSucceeded}
              />
            </Col>
          </Row>
        </Card>

        <Card
          className="card"
          title="分组信息"
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
          title="分组结果"
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
                  message="分组成功"
                  description={this.state.successfulData.length + " 个学号分组成功：" + this.state.successfulData}
                  type="success"
                  showIcon
                /><p></p>
              </Fragment> : ''
          }
          {
            this.state.is_null ?
              <Fragment>
                <Alert
                  message="数据错误"
                  description={this.state.is_null}
                  type="warning"
                  showIcon
                /><p></p>
              </Fragment> : ''
          }
          {
            this.state.failedData.length ?
              <Alert
                message="分组失败"
                description={this.state.failedData.length + " 个学号已被分组：" + this.state.failedData}
                type="error"
                showIcon
              /> : ''
          }
        </Modal>
        <Modal
          title="调整分组"
          visible={this.state.visible_adjustment}
          onCancel={this.handleCancel_adjustment}
          footer={null}
          keyboard={false}
          maskClosable={false}
        >
          <Row gutter={10}>
            <Col span={9}>
              <Input autoComplete="off" placeholder="请输入 6 位教师工号" value={this.state.teacher_id} onChange={this.handleTeacherIdChange} />
            </Col>
            <Col span={9}>
              <Input className="test" autoComplete="off" placeholder="请输入 8 位学生学号" value={this.state.student_id} />
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={this.handleSubmit_adjustment}>
                确定调整
              </Button>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}

const WrapStudentManage = Form.create()(GroupManagement)
export default WrapStudentManage
