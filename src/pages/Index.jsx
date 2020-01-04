/**
 * 首页入口
 */
import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import $ from 'jquery'

export default class Index extends Component {

  componentDidMount() {
    $(".page").css({
      width: "100%",
      height: "100%"
      // border: "10px solid red"
    })
  }

  render () {
    return (
      <div id="index">
        <div id="header">
          <Navbar />
        </div>
        <div id="content">
          {this.props.children}
        </div>
        <div id="footer">
          <Footer />
        </div>
      </div>
    )
  }
}
