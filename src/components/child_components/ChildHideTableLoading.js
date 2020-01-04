/**
 * 统一管理延时显示
 * @param {*} _this
 */
export default function ChildHideTableLoading(_this) {
  setTimeout(() => { _this.setState({ showLoading: false }) }, 200)
}