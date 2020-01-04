/**
 * 后台-论文选题
 */
import React, { Component } from 'react'
import { Card, Table, DatePicker, Input, Button, message, Modal, Select, Row, Col, Popover, Icon } from 'antd';
import moment from 'moment';
import { isStudent, isTeacher } from '../../utils/getUserType'
import {
  reqTeacherPublishThesisTopic,
  reqTeacherViewPublishedTopics,
  reqStudentViewingTopics,
  reqStudentChoicePaperTopic,
  reqStudentUploadReport,
  reqStudentUploadPapers,
  reqSelectCallBackTheRecord
} from '../../api/index'
import '../../assets/css/thesis_selection.less'
import ChildPaginationPack from '../child_components/ChildPaginationPack'
import ChildRefreshBtn from '../child_components/ChildRefreshBtn'
import ChildHideTableLoading from '../child_components/ChildHideTableLoading'
import memoryUtils from '../../utils/memoryUtils';
import ChildUploadFile from '../child_components/ChildUploadFile';
import $ from 'jquery'
import { antCardS } from "../../utils/AddAnimation"

const { Option } = Select

export default class ThesisSelection extends Component {
  state = {
    thesis_title: '', //教师输入的论文题目
    dateString: '', // 教师选择的时间
    showLoading: false, // 显示loading
    table_dataSource: [], // 表格数据
    showTeacherComponent: false, // 显示教师组件
    needPagination: true, // 需要分页器
    paginationDate: {
      pageNum: 1, // 当前页
      pageSize: 5,  // 每页显示记录数
      startIndex: 0, // 开始下标（从第几条记录开始）
      totalPage: 1, // 总页数
      totalRecord: 1, // 总记录数
    },
    operation_text: '学生操作',
    is_choose: false,
    visible: false,
    paper_topic_id: '',
    paper_topic: '',
    file_type: '',
    tips: '',
    progress_status: 'active',
    progress_percent: 0,
    file_submit_btn_is_disabled: true,
    paper_state: {
      HAVE_YOU_UPLOADED_PAPERS: 0,
      UPLOADED_INTERIM_REPORT: 0,
      UPLOADED_OPENING_REPORT: 0
    },
    is_effective: 0,
    haveTurnDown: false,
    SumOpeningQuestion: 0,
    SumMediumTerm: 0,
    SumPaper: 0,
    disabledFileBtn: true
  }
  componentDidMount() {
    document.title = "论文选题" + memoryUtils.page_title_suffix
    this.requestThesis_title()
    antCardS($)
  }

  // 设置表头
  initTableColumns = () => {
    let _this = this
    const columns = [
      {
        title: '名称',
        dataIndex: 'paper_topic',
        key: 'paper_topic',
      },
      {
        title: '教师ID',
        dataIndex: 'teacher_id',
        key: 'teacher_id',
      },
      {
        title: '发布时间',
        dataIndex: 'release_date',
        key: 'release_date',
      },
      {
        title: '截止时间',
        dataIndex: 'closing_date',
        key: 'closing_date',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            {
              isStudent()
                ?
                <div>
                  {
                    this.state.is_choose
                      ?
                      <Button type="primary" onClick={() => toSubmit(record)} disabled={this.state.is_effective ? false : true}>提交报告</Button>
                      :
                      <Popover placement="top" title={text} content={popoverContent(record)} trigger="click">
                        <Button type="primary">选择题目</Button>
                      </Popover>
                  }
                </div>
                :
                <div>
                  <Button onClick={() => toScoring(record)}>查看提交情况</Button>
                </div>
            }
          </span>
        ),
      }
    ]
    function popoverContent(record) {
      return (
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '10px 0 20px 0' }}><Icon type="warning" style={{ color: '#faad14', marginRight: '5px' }} />选择之后不能更改！</p>
          <Button type="primary" onClick={() => operationRow(record)} style={{ background: '#faad14', border: 'none' }}>确认选择</Button>
        </div>
      )
    }
    async function operationRow(record) {
      let res = await reqStudentChoicePaperTopic(record.key)
      console.log("选择状态：", res)
      _this.studentGetThesis_title()
    }
    function toScoring(record) {
      console.log("点击查看：", record)
      // 将值放入内存，实现伪动态路由
      memoryUtils.currentThesisTitleData = record
      _this.props.history.push("/admin/thesis_scoring")
    }
    function toSubmit(record) {
      _this.setState({
        paper_topic: record.paper_topic,
        paper_topic_id: record.key,
      }, () => {
        _this.showModal()
      })
    }
    return columns
  }

  // 对话框
  showModal = () => this.setState({ visible: true })
  handleFileChange = e => {
    if (document.getElementsByClassName("Modal_file_input")[0].value && this.state.file_type) {
      this.setState({ file_submit_btn_is_disabled: false })
    } else {
      this.setState({ file_submit_btn_is_disabled: true })
    }
  }
  // 隐藏对话框
  handleCancel = e => {
    console.log(e)
    this.setState({
      visible: false,
      progress_percent: 0,
      file_submit_btn_is_disabled: true
    })
  }
  // 监听报告类型变化
  handleSelectThesisTypeChange = e => {
    let file_type
    if (e === "开题") {
      file_type = "opening_question"
    }
    if (e === "中期") {
      file_type = "medium_term"
    }
    if (e === "论文") {
      file_type = "paper"
    }
    this.setState({
      file_type: file_type,
      disabledFileBtn: false
    })
  }

  // 点击学生操作按钮
  handleStudentClickRow = (record) => {
    console.log("点击了学生行：", record)
  }
  // 用户选择时间
  onChange = (value, dateString) => {
    this.setState({
      dateString: dateString
    })
  }
  // 禁止选择今天以及今天之前的日期
  disabledDate = (current) => {
    return current && current < moment().endOf('day')
  }
  // 用户输入论文选题
  handleThesis_titleChange = (e) => {
    this.setState({
      thesis_title: e.target.value
    })
  }
  // 学生查看论文是否被打回
  studentViewWhetherThePaperIsReturned = async () => {
    let res = await reqSelectCallBackTheRecord()
    if (res.data.code === 1) {
      console.log("打回，state: ", this.state)
    }
    if (res.data.data === {}) {
      this.setState({ haveTurnDown: false })
    } else {
      // 遍历取key并分别累加
      let SumOpeningQuestion = 0, SumMediumTerm = 0, SumPaper = 0, val
      for (val in res.data.data) {
        if (val.indexOf("opening_question") !== -1) SumOpeningQuestion += 1
        if (val.indexOf("medium_term") !== -1) SumMediumTerm += 1
        if (val.indexOf("papers") !== -1) SumPaper += 1
      }
      this.setState({
        SumOpeningQuestion,
        SumMediumTerm,
        SumPaper,
        haveTurnDown: SumOpeningQuestion || SumMediumTerm || SumPaper ? true : false
      })
    }
    if (res.data.code === 2017) {
      this.setState({ haveTurnDown: false })
    }
  }
  // 学生查看教师发布的论文选题
  studentGetThesis_title = async (pageNum, pageSize) => {
    // 显示loading
    this.setState({ showLoading: true })
    let parameter = [
      pageNum || this.state.paginationDate.pageNum,
      pageSize || this.state.paginationDate.pageSize
    ]
    // 开始请求
    let res = await reqStudentViewingTopics(...parameter)
    if (res.data.code === 1 || 2 || 3 || 4 || 5) {
      this.studentViewWhetherThePaperIsReturned()
      let resData = res.data.data
      if (res.data.code === 3 && resData[0]) {
        // 显示 提交报告
        this.setState({
          needPagination: false,
          is_choose: true,
          tips: '你已选择的选题如下',
          paper_state: {
            HAVE_YOU_UPLOADED_PAPERS: resData[1].HAVE_YOU_UPLOADED_PAPERS,
            UPLOADED_INTERIM_REPORT: resData[1].UPLOADED_INTERIM_REPORT,
            UPLOADED_OPENING_REPORT: resData[1].UPLOADED_OPENING_REPORT
          },
          is_effective: resData[0].state ? true : false
        })
        console.log("提交状态：", resData[1])
        this.showData([resData[0]])
      }
      if (res.data.code === 4) {
        // 显示 选择选题
        this.setState({
          needPagination: false,
          is_choose: false,
          tips: '你还没有选择论文选题！在有效期内的选题如下'
        })
        this.showData(resData.datas)
      }
      if (res.data.code === 1) {
        // 设置分页器数据
        this.setState({
          paginationDate: {
            pageNum: resData.pageNum,
            pageSize: resData.pageSize,
            totalRecord: resData.totalRecord,
            startIndex: resData.startIndex,
            totalPage: resData.totalPage
          }
        })
        this.showData(resData.datas)
      }
    }
    // 延时隐藏loading
    ChildHideTableLoading(this)
  }
  // 教师发布论文选题
  handleThesis_titleClick = async () => {
    if (this.state.thesis_title && this.state.dateString) {
      let res = await reqTeacherPublishThesisTopic(this.state.thesis_title, this.state.dateString)
      if (res.data.code === 1) {
        message.success("发布选题成功！")
        this.setState({
          thesis_title: ''
        })
        this.teacherGetThesis_title(1, 5)
      }
    } else {
      message.error("请填写所有字段！")
    }
  }
  // 教师查看已发布的论文选题
  teacherGetThesis_title = async (pageNum, pageSize) => {
    // 显示loading
    this.setState({ showLoading: true })
    let parameter = [
      pageNum || this.state.paginationDate.pageNum,
      pageSize || this.state.paginationDate.pageSize
    ]
    // 开始请求
    let res = await reqTeacherViewPublishedTopics(...parameter)
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
  // 初始化表格
  showData = (Data) => {
    // 构建表格数据
    let jsonArr = []
    Data.map(item => {
      let jsonItem = {
        key: item.paper_topic_id,
        paper_topic: item.paper_topic,
        teacher_id: item.teacher_id,
        release_date: item.release_date,
        closing_date: item.closing_date,
        state: item.state === 1 ? <div>有效</div> : <div>已结束</div>
      }
      jsonArr.push(jsonItem)
      return ''
    })
    // 设置表格数据
    this.setState({ table_dataSource: jsonArr })
    // 延时隐藏loading
    ChildHideTableLoading(this)
  }
  // 刷新数据
  handleRefresh = () => {
    this.requestThesis_title(1)
    this.studentViewWhetherThePaperIsReturned()
  }
  // 根据用户类型调用相应函数
  requestThesis_title = (pageNum, pageSize) => {
    if (isStudent()) {
      this.studentGetThesis_title(pageNum, pageSize)
    } else {
      this.teacherGetThesis_title(pageNum, pageSize)
    }
  }

  render() {
    return (
      <div className="thesis_title_box">
        {
          isTeacher()
            ?
            <Card
              className="card"
              title="发布论文选题"
              extra={''}
            >
              <div className="release_thesis">
                <Input
                  placeholder="请输入论文题目"
                  onChange={this.handleThesis_titleChange}
                  value={this.state.thesis_title}
                />
                <DatePicker
                  className="time_box"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder="选择截止时间"
                  disabledDate={this.disabledDate}
                  onChange={this.onChange}
                />
                <Button
                  type="primary"
                  onClick={this.handleThesis_titleClick}
                >
                  发布
                </Button>
                <div className="clear_both"></div>
              </div>
            </Card>
            :
            ''
        }
        <Card
          className="card"
          title="已发布论文选题"
          extra={<ChildRefreshBtn onClick={this.handleRefresh} />}
        >
          {isStudent() ? <p>提示：{this.state.tips}</p> : ''}
          <Table
            pagination={false}
            dataSource={this.state.table_dataSource}
            columns={this.initTableColumns()}
            loading={this.state.showLoading}
          />
          <div className="Pagination_bar">
            {
              this.state.needPagination ?
                <ChildPaginationPack
                  paginationDate={this.state.paginationDate}
                  requestDate={this.requestThesis_title}
                />
                :
                ""
            }
            <div className="clear_both"></div>
          </div>
        </Card>
        {
          this.state.is_choose ?
            <Card
              className="card"
              title="提交情况"
              extra={''}
            >
              <p>
                开题报告：<span style={{ marginRight: '40px' }}>{this.state.paper_state.UPLOADED_OPENING_REPORT ? '已提交' : '未提交'}</span>
                中期报告：<span style={{ marginRight: '40px' }}>{this.state.paper_state.UPLOADED_INTERIM_REPORT ? '已提交' : '未提交'}</span>
                论文：<span style={{ marginRight: '40px' }}>{this.state.paper_state.HAVE_YOU_UPLOADED_PAPERS ? '已提交' : '未提交'}</span>
              </p>
            </Card>
            :
            ''
        }
        {
          this.state.is_choose ?
            <Card
              className="card"
              title="退回情况"
              extra={''}
            >
              {
                this.state.haveTurnDown ?
                  <p>
                    <span style={{ marginRight: '40px' }}>开题报告：{this.state.SumOpeningQuestion ?
                      <span style={{ color: 'red' }}>被退回<b style={{ margin: '0 5px 0 5px', fontWeight: 'bold' }}>{this.state.SumOpeningQuestion}</b>次</span> : ''}</span>
                    <span style={{ marginRight: '40px' }}>中期报告：{this.state.SumMediumTerm ? <span style={{ color: 'red' }}>被退回<b style={{ margin: '0 5px 0 5px', fontWeight: 'bold' }}>{this.state.SumMediumTerm}</b>次</span> : ''}</span>
                    <span style={{ marginRight: '40px' }}>论文：{this.state.SumPaper ? <span style={{ color: 'red' }}>被退回<b style={{ margin: '0 5px 0 5px', fontWeight: 'bold' }}>{this.state.SumPaper}</b>次</span> : ''}</span>
                  </p>
                  :
                  <p>没有被退回的论文</p>
              }
            </Card>
            :
            ''
        }
        <Modal
          title="提交报告"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          maskClosable={false}
          footer={null}
          keyboard={false}
        >
          <Row className="row_p">
            <Col span={4}><span className="Modal_span_text">选题名称：</span></Col>
            <Col span={20}>
              <Input value={this.state.paper_topic} style={{ width: 200 }} />
            </Col>
          </Row>
          <Row className="row_p">
            <Col span={4}><span className="Modal_span_text">文件类型：</span></Col>
            <Col span={20}>
              <Select onChange={this.handleSelectThesisTypeChange} defaultValue="" style={{ minWidth: 120 }}>
                <Option value="开题" disabled={this.state.paper_state.UPLOADED_OPENING_REPORT ? true : false}>开题</Option>
                <Option value="中期" disabled={this.state.paper_state.UPLOADED_INTERIM_REPORT ? true : false}>中期</Option>
                <Option value="论文" disabled={this.state.paper_state.HAVE_YOU_UPLOADED_PAPERS ? true : false}>论文</Option>
              </Select>
            </Col>
          </Row>
          <div className="file_row">
            <Row>
              <Col span={4}><span className="Modal_span_text">选择文件：</span></Col>
              <Col span={20}>
                <ChildUploadFile
                  url={this.state.file_type === 'paper' ? reqStudentUploadPapers(this.state.paper_topic_id) : reqStudentUploadReport(this.state.paper_topic_id, this.state.file_type)}
                  disable={this.state.paper_topic_id !== '' && this.state.file_type !== '' ? false : true}
                  disabledSelf={this.state.disabledFileBtn}
                  whetherToCallback={this.handleRefresh}
                />
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    )
  }
}
