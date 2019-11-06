import React, { Component } from 'react'
import { Checkbox, InputNumber, Input, Modal, Row, Col, message} from 'antd'
import man from '../images/man.png'
import woman from '../images/woman .png'
import styles from './style.less'

const tit = [
  {title: '单价'},
  {title: '数量'},
  {title: '折扣'},
  {title: '金额'},
  {title: '施工人员', edit: true, property: 'constructors'},
  {title: '销售人员', edit: true, property: 'salesman'},
  {title: '备注'},
]

class List extends Component{
  state = {
    visible: false,
    property: '',
    cacheStaff: [],
    data: {},
  }
  showModal = (property, staff, data) => {
    this.setState({
      data,
      property,
      cacheStaff: staff.map(item => ({...item})),
      visible: true,
    })
  }
  handleClick = (id, e) => {
    const { cacheStaff } = this.state
    const data = cacheStaff.map(item => ({...item}))
    const index = data.findIndex(item => item.id === id)
    if(index > -1){ // 存在则删除
      if(e.target.tagName !== 'INPUT'){
        data.splice(index, 1)
      }
    }else { // 不存在则添加
      data.push({id, scale: ''})
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
  handleOk = () => {
    const { onChange } = this.props
    const { property, cacheStaff, data } = this.state
    let totalScale = 0
    let error = false
    for(let i = 0; i < cacheStaff.length; i++){
      totalScale += Number(cacheStaff[i].scale)
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
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }
  render(){
    const { goodsList, onChange, deleteHandel, workStaff, saleStaff } = this.props
    const { visible, property, cacheStaff } = this.state
    const staffData = property === 'constructors' ? workStaff : saleStaff
    return(
      <div className='ainier-list'>
        {
          goodsList.map((v,i) => {
            return(
              <div  className={styles.item  + (v.checked ? ` ${ styles.checkedItem }` : ' ')} key={i}>
                <div className={styles.head + ' flex center'}>
                  <Checkbox checked={v.checked} onChange={(e => onChange(e.target.checked, v, 'checked'))} >{v.projectName}</Checkbox>
                  <span>{v.commodityCode}</span>
                  <span className={styles.delete} ><span onClick={() => deleteHandel(v)}>删除</span></span>
                </div>
                <div className={styles.content}>
                  <div className={styles.col + " flex center"}>
                    {
                      tit.map((c,j) => {
                        return (
                          <div key={j}>
                            {
                              (c.edit && v[c.property] && !!v[c.property].length )
                                ? <div className={styles.edit}><span>{c.title}</span><span className='iconfont icon-xiugaibianji' title='编辑'  onClick={() => this.showModal(c.property, v[c.property] || [], v)} /></div>
                                : <div>{c.title}</div>
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className={styles.col + " flex "}>
                    <div>{v.priceTem}</div>
                    <div>
                      <InputNumber
                        min={1}
                        size="large"
                        value={v.num}
                        precision={0}
                        style={{width: '80%'}}
                        onChange={(value => onChange(value, v, 'num'))}
                      >
                      </InputNumber>
                    </div>
                    <div>
                      {
                        v.priceTem === 0 ?
                          <span style={{marginLeft: '8px'}}>--</span>
                          :
                          <InputNumber
                            min={0}
                            max={10}
                            size="large"
                            value={v.discount}
                            precision={1}
                            style={{width: '80%'}}
                            onChange={(value => onChange(value, v, 'discount'))}
                          />
                      }
                    </div>
                    <div>
                      {
                        v.priceTem === 0 ?
                          <span style={{marginLeft: '8px', color: '#FF6F28'}}>{v.itemTotal}</span>
                          :
                          <InputNumber
                            min={0}
                            size="large"
                            value={v.itemTotal}
                            precision={2}
                            style={{width: '80%'}}
                            onChange={(value => onChange(value, v, 'itemTotal'))}
                          />
                      }
                    </div>
                    <div>
                      {
                        ((!v.constructors) || (v.constructors && !v.constructors.length))
                          ?
                          <div
                            className={styles.add}
                            onClick={() => this.showModal('constructors', v.constructors || [], v)}
                          >
                            <i className='iconfont icon-tianjia' />
                            添加
                          </div>
                          :
                          <div>
                            {
                              v.constructors.map(item => {
                                const name = workStaff.filter(item2 => item2.id === item.id)[0] ? workStaff.filter(item2 => item2.id === item.id)[0].name : ''
                                return (
                                  <div key={item.id} className={styles.staffItem}>
                                    <span>{name}</span>
                                    <span>{item.scale}%</span>
                                  </div>
                                )
                              })
                            }
                          </div>
                      }
                    </div>
                    <div>
                      {
                        ((!v.salesman) || (v.salesman && !v.salesman.length))
                          ?
                          <div
                            className={styles.add}
                            onClick={() => this.showModal('salesman', v.salesman || [], v)}
                          >
                            <i className='iconfont icon-tianjia' />
                            添加
                          </div>
                          :
                          <div>
                            {
                              v.salesman.map(item => {
                                const name = saleStaff.filter(item2 => item2.id === item.id)[0] ? saleStaff.filter(item2 => item2.id === item.id)[0].name : ''
                                return (
                                  <div key={item.id} className={styles.staffItem}>
                                    <span>{name}</span>
                                    <span>{item.scale}%</span>
                                  </div>
                                )
                              })
                            }
                          </div>
                      }
                    </div>
                    <div>
                      <Input
                        style={{ width: '90%' }}
                        placeholder="请输入备注"
                        value={v.remark}
                        onChange={(e => onChange(e.target.value, v, 'remark'))}
                        size="large"
                      />
                    </div>
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
          <Row gutter={20}>
            {
              staffData.map(item => {
                const checkedIndex = cacheStaff.findIndex(item2 => item2.id === item.id)
                return (
                  <Col className="gutter-row" span={6} key={item.id}>
                    <div
                      className={(checkedIndex > -1) ? `${styles.staff} ${styles.activeStaff}` : styles.staff}
                      onClick={(e) => this.handleClick(item.id, e)}
                    >
                      {item.sex === 1 && <img src={man} alt=""/>}
                      {item.sex === 2 && <img src={woman} alt=""/>}
                      <div className={styles.staffModal}>
                        <span>{item.name}</span>
                        <InputNumber
                          disabled={checkedIndex === -1}
                          min={0}
                          max={100}
                          style={{maxWidth: 96, color: '#4AACF7', fontSize: 14}}
                          formatter={value => value ? `${value}%` : ''}
                          parser={value => value.replace('%', '')}
                          value={(checkedIndex > -1) ? cacheStaff[checkedIndex].scale : undefined}
                          onChange={value => this.handleChange(item.id, value)}
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                      {(checkedIndex > -1) && <span className={`${styles.sign} iconfont icon-xuanzhong_`}/>}
                    </div>
                  </Col>
                )
              })
            }
          </Row>
        </Modal>
      </div>
    )
  }
}


export default List
