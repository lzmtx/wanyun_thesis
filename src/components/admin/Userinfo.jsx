/**
 * 基本信息组件
 */
import React, { Component } from 'react'
import { Form, Card, Col, Row, Avatar, Button, Input, message } from 'antd';
import {
  reqStudentViewInformatio,
  reqTeacherViewInformation,
  reqMailboxBindingVerificationCodeSending,
  reqMailboxBinding,
  reqReleaseOfMailboxBinding
} from '../../api'
import { isStudent, isTeacher, isAdmin } from '../../utils/getUserType'
import memoryUtils from '../../utils/memoryUtils'
import $ from 'jquery'
import { antCard } from "../../utils/AddAnimation"
import tx from '../../assets/img/tx.jpg'

class UserInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      step: 1,
      showBindEmailCard: false
    }
    document.title = "基本信息" + memoryUtils.page_title_suffix
    this.getSelfInfo()
    this.user = memoryUtils.user
  }

  validateEmail = (rule, value, callback) => {
    let regQQ = /^([a-zA-Z]|[0-9])(\w|-)+@qq+\.com$/
    let regSina = /^([a-zA-Z]|[0-9])(\w|-)+@sina+\.com$/
    if (value && regQQ.test(value) | regSina.test(value)) {
      callback()
    } else {
      callback("仅支持qq、sina邮箱")
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.send_verification_code(values.e_mail)
      }
    })
  }
  handleSubmitBindEmail = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.bind_email(values.verificationCode, values.e_mail)
      }
    })
  }
  send_verification_code = async (e_mail) => {
    let res = await reqMailboxBindingVerificationCodeSending(e_mail)
    console.log("返回数据：", res)
    if (res.data.code === 1) {
      message.success("验证发发送成功，请注意查收！")
      this.setState({
        step: 2
      })
    }
    if (res.data.code === 4001) {
      message.warning(res.data.message)
    }
  }
  bind_email = async (verificationCode, e_mail) => {
    let res = await reqMailboxBinding(verificationCode, e_mail)
    console.log("返回数据：", res)
    if (res.data.code === 1) {
      message.success("绑定成功！")
      this.setState({ showBindEmailCard: false })
      this.getSelfInfo()
    }
  }
  handleBindBtn = () => {
    this.setState({ showBindEmailCard: true })
  }
  UnBindEmail = async () => {
    let res = await reqReleaseOfMailboxBinding()
    if (res.data.code === 1) {
      message.success("解绑成功！")
      this.getSelfInfo()
    }
  }
  getSelfInfo = async () => {
    let _this = this
    let res
    if (isStudent()) {
      res = await reqStudentViewInformatio()
      setInfo()
    }
    if (isTeacher()) {
      res = await reqTeacherViewInformation()
      setInfo()
    }
    function setInfo () {
      if (res.data.code === 1) {
        _this.setState({
          user: res.data.data,
          showBindEmailCard: false
        })
      }
    }
  }
  componentDidMount () {
    antCard($)
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="main_box">
        <Card className="card" title="基本信息" extra={''}>
          <Row>
            <Col span={4} style={{ textAlign: "center" }}>
              <img className="user_info_tx" src={tx} alt="" />
            </Col>
            <Col span={20}>
              <p>用户名：{this.user.user_name}</p>
              <p>姓名：{this.user.real_name}</p>
              {
                isTeacher() ?
                  <p>职称：{this.state.user.teacher_title !== "null" ? this.state.user.teacher_title : ''}</p>
                  : ''
              }
              <p>电话号码：{this.user.user_phone}</p>
              <p>用户类型：{this.user.type}</p>
              <p>用户状态：{this.user.state}</p>
              {
                isAdmin() ? "" :
                  <p>
                    E-mail：{this.state.user.user_email !== "null" ? this.state.user.user_email : <Button type="link" onClick={this.handleBindBtn}>绑定</Button>}
                    {this.state.user.user_email !== "null" ? <Button type="link" onClick={this.UnBindEmail}>解绑</Button> : ""}
                  </p>
              }
            </Col>
          </Row>
        </Card>
        {
          this.state.showBindEmailCard ?
            <Card title="绑定邮箱" extra={''} style={{ marginBottom: "15px" }} >
              {
                this.state.step === 1 ?
                  <Form onSubmit={this.handleSubmit} style={{ width: '350px', marginLeft: '16.5%', marginTop: '15px' }}>
                    <Form.Item>
                      {getFieldDecorator('e_mail', {
                        rules: [
                          {
                            required: true,
                            message: '请输入E-mail ！',
                          },
                          {
                            type: 'email',
                            message: '请输入正确的E-mail ！',
                          },
                          {
                            validator: this.validateEmail,
                          },
                        ],
                      })(<Input autoComplete="off" placeholder="请输入 QQ 或 sina 邮箱地址" />)}
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" >
                        发送验证码
                      </Button>
                    </Form.Item>
                  </Form> :
                  <Form onSubmit={this.handleSubmitBindEmail} style={{ width: '350px', marginLeft: '16.5%', marginTop: '15px' }}>
                    <Form.Item>
                      {getFieldDecorator('e_mail', {
                        rules: [
                          {
                            required: true,
                            message: '请输入E-mail ！',
                          }
                        ],
                      })(<Input autoComplete="off" placeholder="请输入 QQ 或 sina 邮箱地址" disabled={true} />)}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('verificationCode', {
                        rules: [
                          {
                            required: true,
                            message: '请输入验证码！',
                          }
                        ],
                      })(<Input className="test" autoComplete="off" placeholder="请输入 5 位验证码" />)}
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" >
                        确认绑定
                      </Button>
                    </Form.Item>
                  </Form>
              }
            </Card> : ''
        }
      </div>
    )
  }
}

const WrappedUser = Form.create({ name: 'UserInfo' })(UserInfo);
export default WrappedUser