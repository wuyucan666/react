import React, { Component } from 'react'
import { InputNumber, Modal, message, Icon, Button, Tooltip } from 'antd'
import ProductTk from 'components/setPrice/product'
import QuickIn from 'components/Drawer/quickIn'
import ChangePrice from '../change-price/index'
import { connect } from 'dva'
import styles from './style.less'
import { add } from "../../../../../utils/calculate"
import collectData from 'utils/collectData'

class List extends Component{

  constructor(prop) {
    super(prop)
    this.state = {
      visible: false,
      property: '',
      cacheStaff: [],
      data: {},
      showNew: false,
      priceVisible: false,
      curItem: {},
      curSet: {},
      canSet: JSON.parse(window.localStorage.getItem("permissionRole")).findIndex(v => v === 53) !== -1,
      is1440: prop.is1440,
      quickVisible: false,
      curProduct: {},
    }
  }


  showModal = (property, staff, data) => {
    this.setState({
      data,
      property,
      cacheStaff: staff.map(item => ({...item})),
      visible: true,
    })
  }

  handleClick = (staff, e) => {
    const { cacheStaff } = this.state
    const data = cacheStaff.map(item => ({...item}))
    const index = data.findIndex(item => item.id === staff.id)
    if(index > -1){ // 存在则删除
      if(e.target.tagName !== 'INPUT'){
        data.splice(index, 1)
      }
    }else { // 不存在则添加
      data.push({id: staff.id, scale: '', name: staff.staffName})
    }
    const length = data.length
    if(!!length){
      const  average = (100 / data.length).toFixed(2) // 平均值
      const scale = Number(average.substring(0,average.lastIndexOf('.')+2)) // 不四舍五入取一位小数
      data.forEach(item => {
        item.scale = scale
      })
      if(length > 1){ // 选中了多个员工
        let preScale = 0
        data.slice(0, data.length -1).forEach(item => { // 取最后一个员工之前的所有比例的和
          preScale += item.scale
        })
        let lastScale = (100 - preScale).toFixed(2)
        lastScale = Number(lastScale.substring(0,lastScale.lastIndexOf('.')+2)) // 不四舍五入取一位小数
        data[length -1].scale = lastScale // 最后一个员工重新赋值
      }
    }
    this.setState({cacheStaff: data})
  }

  handleChange = (id, value) => {
    const { cacheStaff } = this.state
    const data = cacheStaff.map(item => ({...item}))
    const index = data.findIndex(item => item.id === id)
    data[index].scale = value
    this.setState({cacheStaff: data})
  }

  add = (item) => {
    if(item.pick) {
      return false
    }
    const { onChange } = this.props
    let value = item.num*1 + 1
    onChange(value, item, 'num')
  }

  subtract = (item) => {
    if(item.pick) {
      return false
    }
    const { onChange } = this.props
    let value = 1
    if(item.num > 1) {
      value = item.num*1 - 1
    }
    onChange(value, item, 'num')
  }

  handleOk = () => {
    const { onChange } = this.props
    const { property, cacheStaff, data } = this.state
    let totalScale = 0
    let error = false
    for(let i = 0; i < cacheStaff.length; i++){
      totalScale = add(Number(cacheStaff[i].scale), totalScale)
    }
    if(cacheStaff.length > 0 ) {
      if(parseInt(totalScale) !== 100){
        message.error('分配比例错误，比例之和应等于100%')
        error = true
      }
    }
    if(!error){
      onChange(cacheStaff, data, property)
      this.setState({
        visible: false,
      })
    }
  }

  closeTk = (isSuccess, item) => {
    const { setPrice } = this.props
    this.setState({showNew: false})
    if(isSuccess) {
      setPrice(item)
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  onCancel = () => {
    this.setState({showReturn: false})
  }

  quickClose = () => {
    this.setState({quickVisible: false})
  }

  quickSuccess = (item) => {
    const { onChange, updateDate } = this.props
    this.quickClose()
    onChange(item.stock, item, 'stock')
    updateDate()
  }

  toImport = (item) => {
    this.setState({quickVisible: true, curProduct: item})
  }

  goSetPrice = (item) => {
    this.setState({
      priceVisible: true,
      curItem: item,
    })
  }

  priceCancle = () => {
    this.setState({priceVisible: false})
  }

  priceOk = () => {
    this.setState({priceVisible: false})
  }

  render(){
    const { goodsList, onChange, deleteHandel, workStaff, saleStaff } = this.props
    const { visible, property, cacheStaff } = this.state
    const staffData = property === 'constructors' ? workStaff : saleStaff
    const props = {
      visible: this.state.quickVisible,
      product: this.state.curProduct,
      onClose: this.quickClose,
      quickSuccess: this.quickSuccess,
    }
    const priceProps = {
      visible: this.state.priceVisible,
      onChange: this.props.onChange,
      onCancel: this.priceCancle,
      onOk: this.priceOk,
      curItem: this.state.curItem,
    }
    return(
      <div className={this.state.is1440 ? 'ainier-list-1440' : 'ainier-list'}>
        <QuickIn {...props}></QuickIn>
        {
          goodsList.map((v,i) => {
            const showCrad =
            v.cardInfo.length > 0
            && v.discount === v.originDiscount
            && v.price === v.originPrice
            return(
              <div className={styles.item  + (v.checked ? ` ${ styles.checkedItem }` : ' ')} key={i}>
                <div className={styles.head + ' flex center'}>
                  <span>
                    {v.name}
                    {
                      v.commodityCode &&
                      <span>
                        ({v.commodityCode})
                      </span>
                    }
                  </span>
                  {
                    v.detailId && <span className={styles.card}>{v.cardName}</span>
                  }
                  {
                    showCrad &&
                    <span style={{color: '#FF6F28'}} className={styles.youhui}>
                      {v.cardInfo[0].clientCardName}
                    </span>
                  }
                  <span className={styles.delete} ><span onClick={() => deleteHandel(v)}><Icon type="close" /></span></span>
                </div>
                <div className={styles.content}>
                  <div className={styles.row + ' flex'}>
                    <span>销售总价:</span>
                    <span style={{color: v.discount*1 === 10 ? '#333' : '#FF6F28'}}>{v.info*1 === 2 ? '无价格' : v.itemTotal}</span>
                    {(!v.detailId && v.info*1 !== 2)&& <span className='iconfont icon-xiugai1' onClick={() => this.goSetPrice(v)}></span>}
                    <div className= {styles.operate + ' item'}>
                      <span onClick={() => this.subtract(v)} className={((v.num === 1 || v.pick) ? styles.disabled : ' ' ) + ' iconfont icon-jian'} ></span>
                      <InputNumber
                        min={1}
                        value={v.num}
                        precision={0}
                        style={{ width: 54 }}
                        onChange={(value => onChange(value, v, 'num'))}
                      >
                      </InputNumber>
                      <span onClick={() => this.add(v)} className={(v.pick ? styles.disabled : ' ') + ' iconfont icon-jia'}></span>
                    </div>
                  </div>
                  {/* 选择销售 */}
                  {
                    v.salesman
                    ?
                    <div className={styles.row + ' flex'}>
                      <span>销售人员:</span>
                      <div style={{color: '#333'}}>
                        {
                          v.salesman.map((_, idx) => {
                            if (idx < 2) {
                              return <span key={idx}>{_.name}{_.scale}% </span>
                            } else {
                              return ''
                            }
                          })
                        }
                        {
                          v.salesman.length > 2 && <span>...</span>
                        }
                      </div>
                      <div
                      className='item'
                      style={{display: 'flex', justifyContent: 'flex-end', cursor: 'pointer'}}
                      onClick={() => this.showModal('salesman', v.salesman || [], v)}>
                        <span className='iconfont icon-yuandian'  style={{color: '#4AACF7'}}></span>
                      </div>
                    </div>
                    :
                    <div
                    className={styles['add-btn']}
                    style={{borderBottom: v.constructors ? '1px dashed #4AACF7' : '0 none'}}
                    onClick={() => this.showModal('salesman', v.salesman || [], v)}>
                      <span className='iconfont icon-xinzeng1'></span>
                      <span>销售人员</span>
                    </div>
                  }
                  {/* 选择施工 */}
                  {
                    v.constructors
                    ?
                    <div className={styles.row + ' flex'}>
                      <span>施工人员:</span>
                      <div style={{color: '#333'}}>
                        {
                          v.constructors.map((_, idx) => {
                            if (idx < 2) {
                              return <span key={idx}>{_.name}{_.scale}% </span>
                            } else {
                              return ''
                            }
                          })
                        }
                        {
                          v.constructors.length > 2 && <span>...</span>
                        }
                      </div>
                      <div
                      className='item'
                      style={{display: 'flex', justifyContent: 'flex-end', cursor: 'pointer'}}
                      onClick={() => this.showModal('constructors', v.constructors || [], v)}>
                        <span className='iconfont icon-yuandian'  style={{color: '#4AACF7'}}></span>
                      </div>
                    </div>
                    :
                    <div
                    className={styles['add-btn']}
                        onClick={() => { this.showModal('constructors', v.constructors || [], v); collectData('order')}}>
                      <span className='iconfont icon-xinzeng1'></span>
                      <span>施工人员</span>
                    </div>
                  }
                </div>
                <div className={styles.footer}>
                  <div className='item' style={{color: '#4AACF7', flex: '1'}}>
                    {
                      v.orderRemark &&
                      <Tooltip placement="right" title={v.orderRemark || '暂无'}><i className='iconfont icon-beizhuxinxi'></i></Tooltip>
                    }
                  </div>
                  <div>
                    {/* 1.是否设置价格 2.库存是否充足 3.是否进行领料 */}
                    {
                      v.info*1 === 2 ?
                        <div className={styles.message}>
                          <div>{ this.state.canSet ? '未设置价格' : '未设置价格请提醒管理员设置'}</div>
                          <Button size="large" type="primary" onClick={() => this.setState({showNew: true, curSet: {...v, costTem: v.cost}})} disabled={!this.state.canSet}>设置价格</Button>
                          <ProductTk
                            curItem={this.state.curSet}
                            visible={this.state.showNew}
                            onClose={this.closeTk.bind(this)}
                          ></ProductTk>
                        </div>
                        :
                        <div>
                          {
                            v.num > v.stock &&
                            <div className={styles.message}>
                              <div>库存不足</div>
                              <Button size="large" type="primary" onClick={() => this.toImport(v)}>入库</Button>
                            </div>
                          }
                        </div>
                    }
                  </div>
                </div>
              </div>
            )
          })
        }
        <Modal
          title="选择员工"
          width={1200}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className={styles.staffs_box}>
            {
              staffData.map(item => {
                const checkedIndex = cacheStaff.findIndex(item2 => item2.id === item.id)
                return (
                  <div
                    className={(checkedIndex > -1) ? `${styles.staff} ${styles.activeStaff}` : styles.staff}
                    onClick={(e) => this.handleClick(item, e)}
                  >
                    <div className={styles.staffModal}>
                      {
                        item.name.length > 5
                        ?
                        <Tooltip title={item.name}>{item.name.slice(0,4) + '...'}</Tooltip>
                        :
                        <span>{item.name}</span>
                      }
                      {
                        checkedIndex !== -1
                        &&
                        <InputNumber
                          disabled={checkedIndex === -1}
                          min={0}
                          max={100}
                          style={{maxWidth: 70, color: '#4AACF7', fontSize: 14}}
                          formatter={value => value ? `${value}%` : ''}
                          parser={value => value.replace('%', '')}
                          value={(checkedIndex > -1) ? cacheStaff[checkedIndex].scale : undefined}
                          onChange={value => this.handleChange(item.id, value)}
                          onClick={e => e.stopPropagation()}
                        />
                      }
                    </div>
                    {(checkedIndex > -1) && <span className={`${styles.sign} iconfont icon-xuanzhong_`}/>}
                  </div>
                )
              })
            }
          </div>
        </Modal>
        {/* 修改价格 */}
        {
          this.state.priceVisible &&
          <ChangePrice {...priceProps}></ChangePrice>
        }
      </div>
    )
  }
}


export default connect()(List)
