/**
 * 后台-数据分析页面
 */
import React, { Component } from 'react'
import { Icon } from 'antd'
import $ from 'jquery'
import { reqDataNum } from '../../api'
import ReactEcharts from 'echarts-for-react'
import { AdminSelfCard } from '../../utils/AddAnimation'
import '../../assets/css/data_analysis.less'


export default class DataAnalysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardDom: "",
      cardData: []
    }
    this.getDataNum()
  }
  setChartOne = () => {
    let option = {
      title: {
        text: '专业方向契合度分析表',
        subtext: '纯属虚构',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        x: 'center',
        y: 'bottom',
        data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: {
            show: true,
            type: ['pie', 'funnel']
          },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      series: [
        {
          name: '面积模式',
          type: 'pie',
          radius: [40, 110],
          center: ['20%', '50%'],
          roseType: 'area',
          data: [
            { value: 10, name: 'rose1' },
            { value: 5, name: 'rose2' },
            { value: 15, name: 'rose3' },
            { value: 25, name: 'rose4' },
            { value: 20, name: 'rose5' },
            { value: 35, name: 'rose6' },
            { value: 30, name: 'rose7' },
            { value: 40, name: 'rose8' }
          ]
        }
      ]
    }

    return option
  }

  setChartTwo = () => {
    let option = {
      title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['30%', '50%'],
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 848, name: '搜索引擎' }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    return option
  }

  setChartThree = () => {
    let option = {
      title: {
        text: '就业方向契合度分析表',
        subtext: '巴拉巴拉'
      },
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    return option
  }

  setChartFour = () => {
    let option = {
      title: {
        text: '顶岗实习岗位契合度分析表',
        subtext: '数据来自网络'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['2011年', '2012年']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
      },
      series: [
        {
          name: '2011年',
          type: 'bar',
          data: [18203, 23489, 29034, 104970, 131744, 630230]
        },
        {
          name: '2012年',
          type: 'bar',
          data: [19325, 23438, 31000, 121594, 134141, 681807]
        }
      ]
    }

    return option
  }

  setDataCard = () => {
    let cardData = [
      {
        title: "学生",
        icon: "team",
        unit: "位"
      },
      {
        title: "教师",
        icon: "user",
        unit: "位"
      },
      {
        title: "报告",
        icon: "file-text",
        unit: "篇"
      },
      {
        title: "论文",
        icon: "file-pdf",
        unit: "篇"
      }
    ]
    let doms = []
    cardData.forEach((item, index) => {
      doms.push(
        <div key={index} className="admin_self_card top_card admin_card">
          <div className="title_box">
            <div className="title">{item.title}</div>
            <div className="icon_box">
              <Icon type={item.icon} />
            </div>
          </div>
          <div className="data_box">
            <span className="data">{this.state.cardData[index]}</span>
            {item.unit}
          </div>
          <div className="bolang"></div>
        </div>
      )
    })
    this.setState({ cardDom: doms })
  }

  getDataNum = async () => {
    let res = await reqDataNum()
    if (res.data.err === 1) {
      let dataArr = []
      dataArr.push(res.data.data.studentNum)
      dataArr.push(res.data.data.teacherNum)
      dataArr.push(res.data.data.reportNum)
      dataArr.push(res.data.data.paperNum)
      this.setState({ cardData: dataArr }, () => {
        this.setDataCard()
      })
    }
  }

  componentDidMount () {
    AdminSelfCard($)
  }

  render () {
    return (
      <div className="data_analysis_box">
        <div className="top_card_box">
          {this.state.cardDom}
        </div>
        <div className="admin_card news_box">
          <Icon type="sound" className="news_icon" />
          <span className="news_content">这是一条最新消息，显示的消息标题名称</span>
        </div>
        <div className="one_charts">
          <div className="allPassingRate admin_card charts_item">
            学年平均学业成绩-论文成绩分布表
          </div>
        </div>
        <div className="one_charts">
          <div className="allPassingRate admin_card charts_item">
            <ReactEcharts
              option={this.setChartOne()}
              className='react_for_echarts' />
          </div>
          <div className="allPassingRate admin_card charts_item">
            <ReactEcharts
              option={this.setChartTwo()}
              className='react_for_echarts' />
          </div>
        </div>
        <div className="one_charts">
          <div className="allPassingRate admin_card charts_item">
            <ReactEcharts
              option={this.setChartThree()}
              className='react_for_echarts' />
          </div>
          <div className="allPassingRate admin_card charts_item">
            <ReactEcharts
              option={this.setChartFour()}
              className='react_for_echarts' />
          </div>
        </div>
      </div>
    )
  }
}
