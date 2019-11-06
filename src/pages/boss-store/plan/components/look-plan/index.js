import { Component } from "react"
import { Icon, Button } from "antd"
import style from './index.less'
import ItemBox from './item.js'
import Lock from './lock.js'
import Delete from './delete.js'

class AddPlan extends Component {
  state = {
    visible: false,
    visibleDelete: false,
    lockState: false,
  }
  componentDidMount() {
  }
  /**
   * 添加老客业绩
   */
  addOldCustomer = () => {
    this.setState({ visible: true })
  }
  /**
   * 锁定
   */
  golock = () => {
    this.setState({ lockState: true })
  }
  golockClose = () => {
    const { golockClose } = this.props
    this.setState({ lockState: false })
    golockClose()
  }
  handleClone = () => {
    this.setState({ lockState: false })
  }
  /**
   * 编辑
   */
  goEdit = () => {
    const { setEditState } = this.props
    setEditState(true)
  }
  goCloneEdit = () => {
    const { setEditState } = this.props
    setEditState(false)
  }
  /**
   * 提交编辑
   */
  goSub = () => {
    const { golockClose } = this.props
    golockClose('edir')
  }
  /**
   * 删除计划
   */
  delete = () => {
    this.setState({ visibleDelete: true })
  }
  handleOk = () => {
    const { deleteClick } = this.props
    deleteClick()
    this.setState({ visibleDelete: false })
  }
  handleCancel = () => {
    this.setState({ visibleDelete: false })
  }
  render() {
    const { dispatch, current, storePlan, status, edit } = this.props
    return (
      <div className={style.addplan}>
        {current === 0 ? <div className={style.prompt}>门店计划目标需要单独设置，并非所有员工计划目标的总和<Icon className={style.promptIcon} type="close" /></div> : ''}
        <div className={style.itemBox}>
          {storePlan ? storePlan.map((v, index) => {
            return <div key={index}><ItemBox item={v} index={index} dispatch={dispatch} edit={edit} current={current}></ItemBox></div>
          }) : ''}
        </div>
        {
          !edit ? (<div className={style.btnw}>
            <Button onClick={this.golock} type="primary" size='large' className={style.btn} disabled={status === 1 ? true : false}>锁定计划</Button>
            {status === 1 ? '' : <Button size='large' className={style.btn} onClick={this.goEdit} disabled={status === 1 ? true : false}>编辑计划</Button>}
            {status === 1 ? '' : <Button size='large' className={style.btn} disabled={status === 1 ? true : false} onClick={this.delete}>删除计划</Button>}
          </div>) : ''
        }
        {
          edit ? (<div className={style.btnw}>
            <Button onClick={this.goSub} type="primary" size='large' className={style.btn} disabled={status === 1 ? true : false}>保 存</Button>
            <Button size='large' className={style.btn} onClick={this.goCloneEdit} disabled={status === 1 ? true : false}>取 消</Button>
          </div>) : ''
        }
        <Lock lockState={this.state.lockState} golockClose={this.golockClose} handleClone={this.handleClone}></Lock>
        <Delete visibleDelete={this.state.visibleDelete} handleOk={this.handleOk} handleCancel={this.handleCancel}></Delete>
      </div>
    )
  }
}

export default AddPlan
