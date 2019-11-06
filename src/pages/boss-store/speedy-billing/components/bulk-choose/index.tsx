import { Component } from 'react'
import { Modal, InputNumber, Tooltip } from 'antd'

const styles = require('./style.less')
export interface pageProps {
  /**是否显示浮层 */
  visible: boolean,
  /**取消函数 */
  onCancel: any,
  /**确认函数 */
  onOk: any,
  workStaff: Array<any>,
  saleStaff: Array<any>, 
}



class BulkChoose extends Component<pageProps> {

  state = {
    cacheSaleStaff: [],  //选择的销售人员
    cacheWorkStaff: [],  //选择的施工人员
  }

  handleClick = (staff, e, propty) => {
    const cacheList = this.state[propty]
    const data = cacheList.map(item => ({ ...item }))
    const index = data.findIndex(item => item.id === staff.id)
    if (index > -1) { // 存在则删除
      if (e.target.tagName !== 'INPUT') {
        data.splice(index, 1)
      }
    } else { // 不存在则添加
      data.push({ id: staff.id, scale: '', name: staff.staffName })
    }
    const length = data.length
    if (!!length) {
      const average = (100 / data.length).toFixed(2) // 平均值
      const scale = Number(average.substring(0, average.lastIndexOf('.') + 2)) // 不四舍五入取一位小数
      data.forEach(item => {
        item.scale = scale
      })
      if (length > 1) { // 选中了多个员工
        let preScale = 0
        data.slice(0, data.length - 1).forEach(item => { // 取最后一个员工之前的所有比例的和
          preScale += item.scale
        })
        let lastScale:any = (100 - preScale).toFixed(2)
        lastScale = Number(lastScale.substring(0, lastScale.lastIndexOf('.') + 2)) // 不四舍五入取一位小数
        data[length - 1].scale = lastScale // 最后一个员工重新赋值
      }
    }
    this.setState({ [propty]: data })
  }

  handleChange = (id, value, propty) => {
    const cacheList = this.state[propty]
    const data = cacheList.map(item => ({ ...item }))
    const index = data.findIndex(item => item.id === id)
    data[index].scale = value
    this.setState({ [propty]: data })
  }
  onOk = () => {
    const { cacheSaleStaff, cacheWorkStaff } = this.state
    const { onOk } = this.props
    onOk(cacheSaleStaff, cacheWorkStaff)
    console.log(cacheSaleStaff, cacheWorkStaff)
  }

  render () {
    const { visible, onCancel, workStaff, saleStaff } = this.props
    const { cacheWorkStaff, cacheSaleStaff } = this.state
    return (
      <div>
        <Modal
        title="批量选择员工"
        width={1200}
        visible={visible}
        onCancel={onCancel}
        onOk={this.onOk}
        >
          <div className='overflow-box'>
            <div className={styles.tit}>销售人员</div>
            <div className={styles.staffs_box}>
              {
                saleStaff.map(item => {
                  const checkedIndex = cacheSaleStaff.findIndex(item2 => item2.id === item.id)
                  return (
                    <div
                      className={(checkedIndex > -1) ? `${styles.staff} ${styles.activeStaff}` : styles.staff}
                      onClick={(e) => this.handleClick(item, e, 'cacheSaleStaff')}
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
                            style={{ maxWidth: 70, color: '#4AACF7', fontSize: 14 }}
                            formatter={value => value ? `${value}%` : ''}
                            parser={(value: any) => value.replace('%', '')}
                            value={(checkedIndex > -1) ? cacheSaleStaff[checkedIndex].scale : undefined}
                            onChange={value => this.handleChange(item.id, value, 'cacheSaleStaff')}
                            onClick={e => e.stopPropagation()}
                            onBlur={e => e.stopPropagation()}
                          />
                        }
                      </div>
                      {(checkedIndex > -1) && <span className={`${styles.sign} iconfont icon-xuanzhong_`} />}
                    </div>
                  )
                })
              }
            </div>
            <div className={styles.tit}>施工人员</div>
            <div className={styles.staffs_box}>
              {
                workStaff.map(item => {
                  const checkedIndex = cacheWorkStaff.findIndex(item2 => item2.id === item.id)
                  return (
                    <div
                      className={(checkedIndex > -1) ? `${styles.staff} ${styles.activeStaff}` : styles.staff}
                      onClick={(e) => this.handleClick(item, e, 'cacheWorkStaff')}
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
                            style={{ maxWidth: 70, color: '#4AACF7', fontSize: 14 }}
                            formatter={value => value ? `${value}%` : ''}
                            parser={(value: any) => value.replace('%', '')}
                            value={(checkedIndex > -1) ? cacheWorkStaff[checkedIndex].scale : undefined}
                            onChange={value => this.handleChange(item.id, value, 'cacheWorkStaff')}
                            onClick={e => e.stopPropagation()}
                          />
                        }
                      </div>
                      {(checkedIndex > -1) && <span className={`${styles.sign} iconfont icon-xuanzhong_`} />}
                    </div>
                  )
                })
              }
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default BulkChoose