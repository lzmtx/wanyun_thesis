/**
 * 添加学生账户-表单
 * 问题：点击关闭后应初始化表单验证，不要有红色，不能有内容填充
 */
import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { reqAdminAddStudentAccounts } from '../../api'

class ChildAddStudentForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      default_pwd: '123',
      studentGrade: ''
    }
    document.onkeypress = function (e) {
      // 防止 enter 提交
      if (e.keyCode === 13) {
        return false;
      }
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.addStudentAccounts(values)
      }
    })
  }
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  // 自动设置年级
  autoSetTheGrade = (e) => {
    const { value } = e.target;
    this.setState({ studentGrade: value.substring(0, 4) })
  }

  // 手动添加学生用户
  addStudentAccounts = async (values) => {
    let { user_name, user_pwd, real_name, user_phone, grade, department, classes } = values
    let res = await reqAdminAddStudentAccounts(user_name, user_pwd, real_name, user_phone, grade, department, classes)
    if (res.data.code === 1) {
      message.success(user_name + " 添加成功")
      this.props.form.resetFields()
    }
  }
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value !== form.getFieldValue('user_pwd')) {
      callback('两次密码不一致！');
    } else {
      callback()
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm_pwd'], { force: true });
    }
    callback()
  }
  validateStudentNumber = (rule, value, callback) => {
    let regex = /^[-+]?\d*$/
    if (value && value.length === 8 && regex.test(value)) {
      callback()
    } else {
      callback('格式错误！')
    }
  }
  validatePhoneNumber = (rule, value, callback) => {
    let regex = /^1[3456789][-+]?\d*$/
    if (value && value.length === 11 && regex.test(value)) {
      callback()
    } else {
      callback('格式错误！')
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
          offset: 6,
        },
      },
    }

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="学号" >
          {getFieldDecorator('user_name', {
            rules: [
              {
                required: true,
                message: '请输入学号！',
              },
              {
                validator: this.validateStudentNumber,
              },
            ],
          })(<Input className="test" autoComplete="off" onBlur={this.autoSetTheGrade} placeholder="请输入 8 位学号" />)}
        </Form.Item>
        <Form.Item label="密码">
          {getFieldDecorator('user_pwd', {
            initialValue: this.state.default_pwd,
            rules: [
              {
                required: true,
                message: '请输入密码！',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password placeholder="默认密码：123" autoComplete="off" />)}
        </Form.Item>
        <Form.Item label="确认密码">
          {getFieldDecorator('confirm_pwd', {
            initialValue: this.state.default_pwd,
            rules: [
              {
                required: true,
                message: '请确认密码！',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} autoComplete="off" />)}
        </Form.Item>
        <Form.Item label="真实姓名">
          {getFieldDecorator('real_name', {
            rules: [{
              required: true,
              message: '请输入真实姓名！'
            }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('user_phone', {
            rules: [
              { required: true, message: '请输入手机号！' },
              { validator: this.validatePhoneNumber }
            ],
          })(<Input autoComplete="off" />)}
        </Form.Item>

        <Form.Item label="年级">
          {getFieldDecorator('grade', {
            initialValue: this.state.studentGrade,
            rules: [{
              required: true,
              message: '请输入年级！'
            }],
          })(<Input placeholder="0000" autoComplete="off" />)}
        </Form.Item>

        <Form.Item label="系别">
          {getFieldDecorator('department', {
            rules: [{
              required: true,
              message: '请输入系别！'
            }],
          })(<Input placeholder="信息工程系" autoComplete="off" />)}
        </Form.Item>

        <Form.Item label="班级">
          {getFieldDecorator('classes', {
            rules: [{
              required: true,
              message: '请输入班级！'
            }],
          })(<Input placeholder="软件技术4班" autoComplete="off" />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" >
            确认添加
          </Button>
        </Form.Item>
        <div>提示：学生账户自动填入默认密码：123</div>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(ChildAddStudentForm);
export default WrappedRegistrationForm