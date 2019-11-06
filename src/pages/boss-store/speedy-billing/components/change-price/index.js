import { Component } from 'react'
import cloneDeep from "lodash/cloneDeep"
import { Modal, InputNumber, message} from 'antd'
import styles from './style.less'

class changePrice extends Component {

  constructor(props) {
    super(props)
    this.state = {
      curItem: props.curItem,
    }
  }

  onChange = (value, propty) => {
    let curItem = cloneDeep(this.state.curItem)
    curItem[propty] = value
    if(propty === 'itemTotal') {
      curItem.discount = (curItem.itemTotal * 10 / (curItem.price * curItem.num)).toFixed(1)
    }
    if(propty === 'discount' || propty === 'num' || propty === 'price') {
      curItem.itemTotal = (curItem.price * curItem.discount/10 * curItem.num).toFixed(2)
    }
    if(curItem.discount > 10) {
      curItem.discount = (10).toFixed(1)
      curItem.itemTotal = (curItem.price * curItem.discount/10 * curItem.num).toFixed(2)
      message.error('注意当前折扣已超过10!')
    }
    if(curItem.detailId) {
      curItem.itemTotal = (0).toFixed(2)
    }
    this.setState({curItem})
  }

  onOk = () => {
    const { curItem } = this.state
    const { onChange, onCancel } = this.props
    if( (!curItem.price && curItem.price !== 0) || !curItem.num || !curItem.discount || !curItem.itemTotal) {
      message.error('请完善信息')
      return false
    }
    onChange(curItem.price, curItem, 'price')
    onChange(curItem.num, curItem, 'num')
    onChange(curItem.discount, curItem, 'discount')
    onChange(curItem.itemTotal, curItem, 'itemTotal')
    onCancel()
  }

  
  render () {
    const { curItem } = this.state
    return (
      <div>
        <Modal
        title='修改价格'
        width={900}
        visible={this.props.visible}
        onOk={this.onOk}
        onCancel={this.props.onCancel}
        maskClosable={false}
        >
          <div className={styles.formItem}>
            <div className={styles.title}>
              <span>{curItem.type === 1 ? '项目名称: ' : '产品名称: '}</span>
              <span>{curItem.name}</span>
            </div>
            <div className={styles.col}>
              <div>
                <span>原价</span>
                <div>
                  <InputNumber
                    min={0}
                    size="large"
                    value={curItem.price}
                    precision={0}
                    style={{width: '100%'}}
                    onChange={(value => this.onChange(value, 'price'))}
                  >
                  </InputNumber>
                  <span>元</span>
                </div>
              </div>
              <div>
                <span>数量</span>
                <div>
                  <InputNumber
                    min={1}
                    size="large"
                    value={curItem.num}
                    disabled={curItem.pick}
                    precision={0}
                    style={{width: '100%'}}
                    onChange={(value => this.onChange(value, 'num'))}
                  >
                  </InputNumber>
                </div>
              </div>
              <div>
                <span>折扣</span>
                <div>
                  <InputNumber
                    min={0}
                    max={10}
                    size="large"
                    value={curItem.discount}
                    precision={1}
                    style={{width: '100%'}}
                    onChange={(value => this.onChange(value, 'discount'))}
                  />
                  <span>折</span>
                </div>
              </div>
              <div>
                <span>总价</span>
                <div>
                  <InputNumber
                    min={0}
                    size="large"
                    value={curItem.itemTotal}
                    precision={2}
                    style={{width: '100%'}}
                    onChange={(value => this.onChange(value, 'itemTotal'))}
                  />
                  <span>元</span>
                </div>
              </div>
            </div>
            {
              curItem.cardInfo.length > 0 &&
              <div className={styles.discount}>
                <div>折扣优惠参考:</div>
                {
                  curItem.cardInfo.map(v => {
                    return (
                      <div>
                        <span>{v.clientCardName}</span>
                        <span>
                          (
                            {v.discountType*1 === 1 ? '折扣：' : '会员价：'}
                            {v.discount}
                            {v.discountType*1 === 1 ? '折' : '元'}
                          )
                          </span>
                      </div>
                    )
                  })
                }
              </div>
            }
          </div>
        </Modal>
      </div>
    )
  }
}

export default changePrice