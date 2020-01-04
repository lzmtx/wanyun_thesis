/**
 * 后台子组件-刷新按钮
 */
import React, { Component } from 'react';
import { Button } from 'antd';

class ChildRefreshBtn extends Component {
  render() {
    return (
      <Button
        type="link"
        className="customize_cursor"
        disabled={this.props.disabled || false}
        onClick={this.props.onClick}>
        {this.props.text || "刷新"}
      </Button>
    );
  }
}

export default ChildRefreshBtn;