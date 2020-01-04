/**
 * 后台-学生管理
 */
import React, { Component } from 'react'
import ChildPaginationPack from '../child_components/ChildPaginationPack'
import { Button, Card, Table } from 'antd'
import { reqTeacherViewStudentInformation } from '../../api'
import ChildRefreshBtn from '../child_components/ChildRefreshBtn';
import ChildHideTableLoading from '../child_components/ChildHideTableLoading'
import memoryUtils from '../../utils/memoryUtils';
import $ from 'jquery'
import { antCardS } from '../../utils/AddAnimation'

export default class StudentManage extends Component {
  state = {
    paginationDate: {
      pageNum: 1, // 当前页
      pageSize: 5,  // 每页显示记录数
      startIndex: 0, // 开始下标（从第几条记录开始）
      totalPage: 1, // 总页数
      totalRecord: 1, // 总记录数
    },
    showLoading: false, // 显示loading
    table_dataSource: [], // 表格数据
  }
  componentDidMount () {
    document.title = "学生管理" + memoryUtils.page_title_suffix
    this.getAllStudentData()
    antCardS($)
  }
  // 请求数据
  getAllStudentData = async (pageNum, pageSize) => {
    // 显示loading
    this.setState({ showLoading: true })
    let parameter = [
      pageNum || this.state.paginationDate.pageNum,
      pageSize || this.state.paginationDate.pageSize,
    ]
    let res = await reqTeacherViewStudentInformation(...parameter)
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
        key: item.user_id,
        user_name: item.user_name,
        real_name: item.real_name,
        grade: item.grade,
        department: item.department,
        classes: item.classes,
        user_phone: item.user_phone,
        user_email: item.user_email
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
        title: '学号',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '姓名',
        dataIndex: 'real_name',
        key: 'real_name',
      },
      {
        title: '年级',
        dataIndex: 'grade',
        key: 'grade',
      },
      {
        title: '系别',
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: '班级',
        dataIndex: 'classes',
        key: 'classes',
      },
      {
        title: '电话号码',
        dataIndex: 'user_phone',
        key: 'user_phone',
      },
      {
        title: 'E-mail',
        dataIndex: 'user_email',
        key: 'user_email',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            {/* <Button disabled={true} onClick={() => toDelete(record)}>删除</Button> */}
          </span>
        ),
      }
    ]
    function toDelete (record) {
      console.log("点击了删除：", record)
    }
    return columns
  }
  // 刷新数据
  handleRefresh = () => {
    this.getAllStudentData(1)
  }

  render () {
    return (
      <div>
        <Card
          className="card"
          title="组内学生信息"
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
              requestDate={this.getAllStudentData}
            />
          </div>
        </Card>
      </div>
    )
  }
}
