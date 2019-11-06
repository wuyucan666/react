import { Component } from "react"
import { connect } from "dva"
import styles from './styles.less'
import services from "../../../services"
import { Input, Select, Button, message } from 'antd'

const InputGroup = Input.Group
const { Option } = Select
class OutsideBox extends Component {
  state = {
    data: {
      salesType: 5,
      salesMoney: '',
      salesPercent: '',
      roadWorkType: 5,
      roadWorkMoney: '',
      roadWorkPercent: '',
    },
  }
  componentDidMount() {
    this.props.dispatch({ type: "miningOutside/edit"}).then(() => {
      const {miningData} = this.props
      let data = {
        salesType: miningData.sales.type || 5,
        salesMoney: miningData.sales.money || '',
        salesPercent: miningData.sales.percent || '',
        roadWorkType: miningData.construction.type || 5,
        roadWorkMoney: miningData.construction.money || '',
        roadWorkPercent: miningData.construction.percent || '',
      }
      this.setState({data})
    })
  }
  onSelect(st, e) {
    let data = {...this.state.data}
    let rel = /^[0-9]+\.{0,1}[0-9]{0,1}$/
    let v = e.target ? e.target.value : e
    if(!rel.exec(v)){
      data[st] = '' 
    } else {
      data[st] = v
    }
    this.setState({data})
  }
  submit=()=> {
    const { salesType, salesMoney, salesPercent, roadWorkType, roadWorkMoney, roadWorkPercent} = this.state.data
    if((salesType !== 3 && salesType !== 4 && !salesPercent) || (roadWorkType !== 3 && roadWorkType !== 4 && !roadWorkPercent)) {
      return message.warning('请把数据填写完整！')
    }
    if(salesType === 2 && (!salesPercent)) {
      return message.warning('请把数据填写完整！')
    }
    if(salesType === 4 && !salesMoney) {
      return message.warning('请把数据填写完整！')
    }
    if(roadWorkType === 4 && !roadWorkMoney) {
      return message.warning('请把数据填写完整！')
    }
    if((roadWorkType === 1 && !roadWorkPercent) || (roadWorkType === 2 && !roadWorkPercent)) {
      return message.warning('请把数据填写完整！')
    }
    services.INSERT({ data: {
      commission: {
        sales: {
          type: salesType*1 || 0,
          percent: (salesType === 3 || salesType === 4) ? 0 : salesPercent*1,
          money: salesType === 4 ? salesMoney*1 : 0,
        },
        construction: {
          type: roadWorkType*1 || 0,
          percent: (roadWorkType === 3 || roadWorkType === 4) ? 0 : roadWorkPercent*1,
          money: roadWorkType ===4 ? roadWorkMoney*1 : 0,
        },
      },
    }, keys: { name: "store/setting/general-commission" } }).then(res => {
      if (res.code === '0') {
        message.success('保存成功')
      }
    })
  }
  // 
  onBlur=(e)=> {
    let data = {...this.state.data}
    let value = data[e]
    if(e === 'roadWorkPercent') {
      value = value*1 >= 100 ? 100 : value*1
    } else {
      value = value*1 >= 100  ? 100 : value*1
    }
    data[e] = value
    this.setState({data})
  }
  render() {
    const { salesType, salesMoney, salesPercent, roadWorkType, roadWorkMoney, roadWorkPercent} = this.state.data
    return (
      <div className={styles.outside_wrap}>
        <div className={styles.outside_title}>新建外采产品时，默认使用以下提成：</div>
        <div className={styles.outside_h}>销售提成</div>
        <div className={styles.outside_box}>
          <InputGroup compact>
            <Select value={salesType} size='large' className={styles.outside_select} onChange={this.onSelect.bind(this, 'salesType')}>
              <Option value={1}>实收比例</Option>
              <Option value={2}>原价比例</Option>
              <Option value={4}>固定金额</Option>
              <Option value={5}>利润比例</Option>
              <Option value={6}>毛利提成</Option>
              <Option value={3}>不提成</Option>
            </Select>
            {salesType === 4 ? '' : <Input
            value={salesPercent}
            onChange={this.onSelect.bind(this, 'salesPercent')}
            onBlur={this.onBlur.bind(this, 'salesPercent')}
            size='large'
            disabled={salesType === 3 ? true : false}
            className={styles.outside_value}
            addonAfter='%' />}
            {salesType === 4 ? <Input
            value={salesMoney}
            onChange={this.onSelect.bind(this, 'salesMoney')}
            size='large'
            disabled={salesType === 3 ? true : false}
            className={styles.outside_value}
            addonAfter='元' /> : ''}
          </InputGroup>
          {/* {salesType === 2 ? <div className={styles.outside_selects}>即提成</div> : ''}
          {salesType === 2 ? <Input value={salesMoney} onChange={this.onSelect.bind(this, 'salesMoney')} size='large' className={styles.outside_values} addonAfter='元' /> : ''} */}
          {salesType === 5 ? <div className={styles.outside_note}>注：利润 = 原价 - 成本</div> : ''}
          {salesType === 6 ? <div className={styles.outside_note}>注：毛利 = 消耗 - 成本</div> : ''}
        </div>

        <div className={styles.outside_h}>施工提成</div>
        <div className={styles.outside_box}>
          <InputGroup compact>
            <Select value={roadWorkType} size='large' className={styles.outside_select} onChange={this.onSelect.bind(this, 'roadWorkType')}>
              <Option value={1}>实收比例</Option>
              <Option value={2}>原价比例</Option>
              <Option value={4}>固定金额</Option>
              <Option value={5}>利润比例</Option>
              <Option value={6}>毛利提成</Option>
              <Option value={3}>不提成</Option>
            </Select>
            {roadWorkType === 4 ? '' : <Input
            value={roadWorkPercent}
            onChange={this.onSelect.bind(this, 'roadWorkPercent')}
            onBlur={this.onBlur.bind(this, 'roadWorkPercent')}
            size='large'
            disabled={roadWorkType === 3 ? true : false}
            className={styles.outside_value}
            addonAfter='%'/>}
            {roadWorkType === 4 ? <Input
            value={roadWorkMoney}
            onChange={this.onSelect.bind(this, 'roadWorkMoney')}
            size='large'
            className={styles.outside_value}
            addonAfter='元'/> : ''}
          </InputGroup>
          {/* {(roadWorkType === 1 || roadWorkType === 2) ? <div className={styles.outside_selects}>
            <Tooltip placement="top" title='实收比例计算的提成低于保底提成时，按保底提成计算。'>
              <Icon type="question-circle" style={{ marginRight: '10px', fontSize: '16px' }} />
            </Tooltip>
            {roadWorkType === 2 ? '即提成' : '保底提成'}
          </div> : ''}
          {(roadWorkType === 1 || roadWorkType === 2) ? <Input value={roadWorkMoney} onChange={this.onSelect.bind(this, 'roadWorkMoney')} size='large' className={styles.outside_values} addonAfter='元'/> : ''} */}
          {roadWorkType === 5 ? <div className={styles.outside_note}>注：利润 = 原价 - 成本</div> : ''}
          {roadWorkType === 6 ? <div className={styles.outside_note}>注：毛利 = 消耗 - 成本</div> : ''}
        </div>
        <Button size='large' className={styles.outside_button} type="primary" onClick={this.submit}>保存</Button>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { miningData } = state.miningOutside
  return {miningData}
}
export default connect(mapStateToProps)(OutsideBox)
