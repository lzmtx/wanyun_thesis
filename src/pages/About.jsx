/**
 * 关于我们组件
 */
import React, { Component } from 'react'
import memoryUtils from '../utils/memoryUtils'
import Index from './Index'

export default class About extends Component {
  componentDidMount () {
    document.title = "关于我们" + memoryUtils.page_title_suffix
  }
  render () {
    return (
      <Index>
        <div className="mid_content">
          这是关于啊
        </div>
      </Index>
    )
  }
}
