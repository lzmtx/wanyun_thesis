/**
 * 登录组件
 */
import React, { Component } from 'react'
import { Form, Icon, Button, Row, Col, message } from 'antd'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'
import { reqLogin } from '../api'
import memoryUtils from '../utils/memoryUtils'
import '../assets/css/login.less'

// 防重复点击的布尔值
let isRun = true;

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      btn_loading: false
    }
    // 如果用户已经登陆，自动跳转到首页
    if (memoryUtils.user.real_name) {
      this.props.history.replace('/')
    }
    document.title = '登录' + memoryUtils.page_title_suffix
  }

  handleSubmit = e => {
    // 阻止事件默认行为(此处指提交行为，停止事件冒泡)
    e.preventDefault()
    if (isRun) {
      // 得到form对象
      const form = this.props.form
      // 对所有表单字段进行校验
      form.validateFields(async (err, values) => {
        if (!err) {
          this.setState({ btn_loading: true })
          // 解构参数（字段值）
          const { user_id, user_pwd } = values
          let res = await reqLogin(user_id, user_pwd)
          this.setResultData(res)
        }
      })
    }
  }

  // 一键登录
  toLogin = async (user_id, user_pwd) => {
    let res = await reqLogin(user_id, user_pwd)
    this.setResultData(res)
  }

  // 设置请求结果
  setResultData = (result) => {
    this.setState({ btn_loading: false })
    let messageStr = JSON.stringify(result.message)
    if (messageStr) {
      if (messageStr.indexOf("Error") !== -1) {
        this.setState({ btn_loading: false })
      }
    }
    if (result.data) {
      if (result.data.code === 6 || 7 || 8) {
        // 清空登录数据
        memoryUtils.user = {}
        Cookies.remove("userInfo")
        if (result.data.data) {
          // 设置登陆数据
          memoryUtils.user = result.data.data
          Cookies.set("userInfo", memoryUtils.user)
          //跳转到首页界面(不需要再回退回到登录)
          this.props.history.replace('/admin/userinfo')
        }
      }
      if (result.data.code === 5001) {
        message.error("该账户已被封禁，如有疑问请联系管理员！")
      }
    }
  }

  render () {
    // 得到具有强大功能的form对象
    const form = this.props.form
    // 得到获取值和表单验证的函数
    const { getFieldDecorator } = form

    return (
      <div className="login_box">
        <div className="login_form_box">

          <Link to="/"><div className="logo_box"></div></Link>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('user_id', {
                rules: [
                  { required: true, message: '必填字段！' }
                ]
              })(
                <div className="formItem_box">
                  <Icon type="user" className="loginIcon" />
                  <input
                    type="text"
                    className="formItem"
                    placeholder="用户名"
                  />
                </div>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('user_pwd', {
                rules: [
                  { required: true, message: '必填字段！' }
                ]
              })(
                <div className="formItem_box">
                  <Icon type="lock" className="loginIcon" />
                  <input
                    type="password"
                    className="formItem"
                    placeholder="密码"
                  />
                </div>
              )}
            </Form.Item>
            <Form.Item>
              <Row>
                <Col span={12}>提示：仅限内部使用</Col>
                <Col span={12} style={{ textAlign: "right" }}><Link to="/forgetPassword">忘记密码？</Link></Col>
              </Row>
            </Form.Item>
            <Form.Item>
              <Button type="primary" loading={this.state.btn_loading} htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>

          {/* 添加一键登录，方便查看 */}
          <div style={{
            padding: '0 20px',
            margin: '0 0 15px 0',
            fontWeight: 'bold',
          }}>
            测试环境一键登录
          </div>
          <div className="test" style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 20px'
          }}>
            <Button type="primary" onClick={() => this.toLogin("20192019", "123")}>
              学生
            </Button>
            <Button type="primary" onClick={() => this.toLogin("101013", "123")}>
              教师
            </Button>
            <Button type="primary" onClick={() => this.toLogin("admin", "123")}>
              管理员
            </Button>
          </div>

        </div>
      </div>
    )
  }
}

/*
包装Form组件（内部有form标签的组件）生成一个新的组件：Form(Login)
新组件会向Form组件传递一个强大的对象属性：form
*/
const WrapLogin = Form.create()(Login)
export default WrapLogin