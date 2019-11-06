import { Component } from "react"
import { Input } from "antd"
import style from './index.less'

class ItemBox extends Component {
  state = {
  }
  componentDidMount() {
  }
  // 只能输入两位小数
  priceNumber = (e) => {
    const { dispatch, index, current } = this.props
    let str = e.target.value
    let rel = /^[0-9]+\.{0,1}[0-9]{0,2}$/
    if (!rel.test(str) || (str.substr(0, 1) === '0' && str.substr(1, 1) === '0')) {
      str = ''
    }
    dispatch({
      type: "storeStaffPlan/setPlan",
      payload: { str, index, current },
    })
  }
  render() {
    const { item, edit } = this.props
    return (
      <div>
        {(item.plandataEdit || edit) ? <div className={style.lookItem}>
          <div className={style.name}>{item.name}</div>
          <div className={style.progress}>
            <div className={style.progressBox} style={{ width: edit ? item.complete + '%' : item.completeEdit + '%' }}></div>
            <div className={style.value}>{edit ? item.progress : item.progressEdit}%</div>
          </div>
          <div className={style.cont}>
            <div className={style.complete}>{item.totaldata}</div>
            <div className={style.linestyle}>/</div>
            <div className={style.plandata}>
              {
                edit ? <Input onChange={this.priceNumber} value={item.plandata} /> : ''
              }
              {
                !edit ? <span>{item.plandataEdit}</span> : ''
              }
            </div>
          </div>
        </div> : ''}
      </div>
    )
  }
}

export default ItemBox
