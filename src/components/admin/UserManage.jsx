/**
 * 后台-学生管理组件
 */
import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Card, Input, Button, message, Form, Modal, Alert, Row, Col } from 'antd'
import {
  reqAdminBatchGroupStudents,
  reqAdminBatchAdditionStudentAccounts,
  reqAdminGroupStudents,
  reqAdminBatchAdditionTeacherAccounts,
  reqSelectAllStudent,
  reqSelectAllTeacher,
  reqSelectUserInformationTwo,
  reqSelectAllPermission
} from '../../api'
import '../../assets/css/student_manage.less'
import ChildAddStudentForm from '../child_components/ChildAddStudentForm'
import ChildAddTeacherForm from '../child_components/ChildAddTeacherForm'
import memoryUtils from '../../utils/memoryUtils'
import $ from 'jquery'
import { antCard } from "../../utils/AddAnimation"

class UserManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      visible_result: false,
      visible_group: false,
      add_user_type: '',
      file_user_type: '',
      add_user_success_arr: [],
      add_user_registered_arr: [],
      add_group_success_arr: [],
      add_grouped_arr: [],
      success_str: '',
      registered_str: '',
      is_null: ''
    }
    this.getAllStudentInfo()
    this.getAllTeacherInfo()
    this.getAllUserInformationTwo()
    this.getAllPermission()
    document.title = "用户管理" + memoryUtils.page_title_suffix
  }
  
  componentDidMount () {
    antCard($)
  }
  // 管理员获取所有学生信息 
  getAllStudentInfo = async () => {
    let res = await reqSelectAllStudent()
    console.log("所有学生数据：", res)
  }
  // 管理员获取所有教师信息 
  getAllTeacherInfo = async () => {
    let res = await reqSelectAllTeacher()
    console.log("所有教师数据：", res)
  }
  // 管理员获取所有分组情况
  getAllUserInformationTwo = async () => {
    let res = await reqSelectUserInformationTwo()
    console.log("所有分组数据：", res)
  }
  // 管理员获取所有权限路径
  getAllPermission = async () => {
    let res = await reqSelectAllPermission()
    console.log("所有权限数据：", res)
  }
  // 上传Excel添加教师用户
  handleFileUpload_add_teacher = () => {
    this.setState({
      file_user_type: 'teacher',
      add_user_success_arr: [],
      add_user_registered_arr: []
    })
    let form = new FormData(document.getElementById("file_form_teacher"))
    const config = { headers: { "Content-Type": "multipart/form-data" } }
    axios.post(reqAdminBatchAdditionTeacherAccounts, form, config).then(res => {
      console.log("请求结果：", res)
      if (res.data.code === 2) {
        for (let item in res.data.data) {
          if (item.indexOf("添加成功") !== -1)
            this.state.add_user_success_arr.push(res.data.data[item])
          if (item.indexOf("已注册") !== -1)
            this.state.add_user_registered_arr.push(res.data.data[item])
        }
        this.set_tips()
        this.setState({ visible_result: true })
      }
      if (res.data.code === 2007)
        message.error("操作失败，请检查Excel表中用户数据是否完整！")
    });
  }
  // 上传Excel添加学生用户
  // 若Excel表格中数据不完整，也可能会上传成功，且会导致个别未填数据的学会数据错误
  // 考虑从前台对所选择的Excel表格文件进行数据检查，查看是否全部填写完成
  // 添加上传进度动画，以增加用户体验
  handleFileUpload_add_student = () => {
    this.setState({
      file_user_type: 'student',
      add_user_success_arr: [],
      add_user_registered_arr: []
    })
    let form = new FormData(document.getElementById("file_form_student"))
    const config = { headers: { "Content-Type": "multipart/form-data" } }
    axios.post(reqAdminBatchAdditionStudentAccounts, form, config).then(res => {
      console.log("请求结果：", res)
      if (res.data.code === 2) {
        for (let item in res.data.data) {
          if (item.indexOf("添加成功") !== -1)
            this.state.add_user_success_arr.push(res.data.data[item])
          if (item.indexOf("已注册") !== -1)
            this.state.add_user_registered_arr.push(res.data.data[item])
        }
        this.set_tips()
        this.setState({ visible_result: true })
      }
      if (res.data.code === 2007)
        message.error("操作失败，请检查Excel表中用户数据是否完整！")
    });
  }
  // 设置提示信息
  set_tips = () => {
    let success_str, success_text, registered_str, registered_text
    if (this.state.file_user_type === "student") {
      success_text = "个学生用户数据："
      registered_text = "个学号已被注册："
    }
    if (this.state.file_user_type === "teacher") {
      success_text = "个教师用户数据："
      registered_text = "个工号已被注册："
    }
    success_str = "成功添加 " + this.state.add_user_success_arr.length + success_text + this.state.add_user_success_arr
    registered_str = this.state.add_user_registered_arr.length + registered_text + this.state.add_user_registered_arr
    this.setState({
      success_str,
      registered_str
    })
  }
  // 上传Excel进行分组
  handleFileUpload_add_group = () => {
    this.setState({
      add_group_success_arr: [],
      is_null: '',
      add_grouped_arr: []
    })
    let form = new FormData(document.getElementById("file_form_add_group"))
    const config = { headers: { "Content-Type": "multipart/form-data" } }
    axios.post(reqAdminBatchGroupStudents, form, config).then(res => {
      console.log("请求结果：", res)
      if (res.data.code === 2) {
        for (let item in res.data.data) {
          if (item.indexOf("分组成功") !== -1)
            this.state.add_group_success_arr.push(res.data.data[item])
          if (item.indexOf("用户名不存在") !== -1)
            this.setState({ is_null: "上传的Excel表中有未注册的用户账号！" })
          if (item.indexOf("已分组") !== -1)
            this.state.add_grouped_arr.push(res.data.data[item])
        }
        this.set_tips()
        this.setState({ visible_group: true })
      }
      if (res.data.code === 2007)
        message.error("操作失败，请检查Excel表中用户数据是否完整！")
    });
  }
  validateTeacherNumber = (rule, value, callback) => {
    let regex = /^[-+]?\d*$/
    if (value && value.length === 6 && regex.test(value)) {
      callback()
    } else {
      callback('格式错误！')
    }
  }
  validateStudentNumber = (rule, value, callback) => {
    let regex = /^[-+]?\d*$/
    if (value && value.length === 8 && regex.test(value)) {
      callback()
    } else {
      callback('格式错误！')
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
  }
  showModal_add_student = () => this.setState({ add_user_type: 'student', visible: true })
  showModal_add_teacher = () => this.setState({ add_user_type: 'teacher', visible: true })
  handleCancel = e => this.setState({ visible: false })
  handleCancel_result = e => this.setState({ visible_result: false })
  handleCancel_group = e => this.setState({ visible_group: false })

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Row gutter={15}>
          <Col span={12}>
            <Card
              title="添加学生用户"
              extra={''}
              className="card"
            >
              <Button type="primary" onClick={this.showModal_add_student}>
                手动添加
              </Button>
              <p></p>
              <form method="post" id="file_form_student" encType="multipart/form-data">
                <input type="file" name="uploadfile" />
                <input type="button" onClick={this.handleFileUpload_add_student} value="上传" />
              </form>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="添加教师用户"
              extra={''}
              className="card"
            >
              <Button type="primary" onClick={this.showModal_add_teacher}>
                手动添加
              </Button>
              <p></p>
              <form method="post" id="file_form_teacher" encType="multipart/form-data">
                <input type="file" name="uploadfile" />
                <input type="button" onClick={this.handleFileUpload_add_teacher} value="上传" />
              </form>
            </Card>
          </Col>
        </Row>
        <Card
          title="分组管理"
          extra={''}
          className="card"
        >
          <Row gutter={15}>
            <Form onSubmit={this.handleSubmit}>
              <Col span={10}>
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
                  })(<Input autoComplete="off" placeholder="请输入 6 位教师工号" />)}
                </Form.Item>
              </Col>
              <Col span={10}>
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
                  })(<Input className="test" autoComplete="off" placeholder="请输入 8 位学生学号" />)}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" >
                    确认分组
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Row>
          <form method="post" id="file_form_add_group" encType="multipart/form-data">
            <input type="file" name="uploadfile" />
            <input type="button" onClick={this.handleFileUpload_add_group} value="上传" />
          </form>
        </Card>
        <Modal
          title={this.state.add_user_type === "student" ? "添加学生用户" : "添加教师用户"}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          keyboard={false}
          maskClosable={false}
        >
          {
            this.state.add_user_type === "student" ?
              <ChildAddStudentForm /> :
              <ChildAddTeacherForm />
          }
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
            this.state.add_user_success_arr.length ?
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
            this.state.registered_str.length ?
              <Alert
                message="添加失败"
                description={this.state.registered_str}
                type="error"
                showIcon
              /> : ''
          }
        </Modal>
        <Modal
          title="分组结果"
          visible={this.state.visible_group}
          onCancel={this.handleCancel_group}
          footer={null}
          keyboard={false}
          maskClosable={false}
        >
          {
            this.state.add_group_success_arr.length ?
              <Fragment>
                <Alert
                  message="分组成功"
                  description={this.state.add_group_success_arr.length + " 个学号分组成功：" + this.state.add_group_success_arr}
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
            this.state.add_grouped_arr.length ?
              <Alert
                message="分组失败"
                description={this.state.add_grouped_arr.length + " 个学号已被分组：" + this.state.add_grouped_arr}
                type="error"
                showIcon
              /> : ''
          }
        </Modal>
      </div>
    )
  }
}

const WrapStudentManage = Form.create()(UserManage)
export default WrapStudentManage
