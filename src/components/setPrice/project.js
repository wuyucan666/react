import { Component } from 'react'
import { Modal, Form, Select, InputNumber, Input, Tooltip, message,Cascader } from "antd"
import service from 'services'
import validate from '../../utils/validate'
import { connect } from "dva"
import style from './style.less'


const FormItem = Form.Item
const Option = Select.Option

class SettingProjectPrice extends Component {

  constructor(props) {
    super(props)
    this.state = {
      salePercent: '',
      consPercent: '',
      consType: 4, //施工提成类型
      saleType: 4, //销售提成类型
      sellPrice: 0,//销售价格
      consMoney: 0, //施工 -即提成
      saleMoney: 0,//销售 -即提成
      title: '实收比例计算的提成低于保底提成时，按保底提成计算。',
      saleList: [{ id: 1, name: '实收比例' }, { id: 2, name: '原价比例' }, { id: 4, name: '固定金额' }, {id: 5, name: '利润比例'}, {id: 6, name: '毛利提成'}, { id: 3, name: '不提成' }],
      constructList: [{ id: 1, name: '实收比例' }, { id: 2, name: '原价比例' }, { id: 4, name: '固定金额' }, {id: 5, name: '利润比例'}, {id: 6, name: '毛利提成'}, { id: 3, name: '不提成' }],
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: "storeSort/getType" })
  }

  onCancel = () => {
    this.props.onClose(false)
    this.props.form.resetFields()
    this.setState({
      consType: 4,
      saleType: 4,
      sellPrice: 0,
      consMoney: 0,
      saleMoney: 0,
      salePercent: '',
      consPercent: '',
    })
  }

  // 下拉框变化
  changeHandel = (e, propty) => {
    this.setState({
      [propty]: e,
    })
    const { sellPrice, salePercent, consPercent } = this.state
    if (propty === 'consType') {
      if (Number(e) === 2) {
        this.setState({ consMoney: sellPrice * consPercent / 100 })
      } else {
        this.setState({ consMoney: 0 })
      }
    }
    if (propty === 'saleType') {
      if (Number(e) === 2) {
        this.setState({ saleMoney: sellPrice * salePercent / 100 })
      } else {
        this.setState({ saleMoney: 0 })
      }
    }
  }

  // 提成金额变化
  moneyChange = (e) => {
    this.setState({ consMoney: (e && e * 1) ? (e * 1).toFixed(1) : e })
    const { consType, sellPrice } = this.state
    if (consType * 1 === 2 && e && e * 1) { //原价比例
      this.setState({ consPercent: (e / sellPrice * 100).toFixed(1) })
    }
  }

  saleMoneyChange = (e) => {
    this.setState({ saleMoney: (e && e * 1) ? (e * 1).toFixed(1) : e })
    const { saleType, sellPrice } = this.state
    if (saleType * 1 === 2 && e && e * 1) { //原价比例
      this.setState({ salePercent: (e / sellPrice * 100).toFixed(1) })
    }
  }

  // 提成比例变化
  inputChange = (value, propty) => {
    const { sellPrice, consType, saleType } = this.state
    this.setState({ [propty]: value})
    // this.setState({ [propty]: (value && value * 1) ? (value * 1).toFixed(1) : value })
    if (propty === 'consPercent' && consType * 1 === 2) { //原价比例
      this.setState({ consMoney: (sellPrice * value / 100).toFixed(1) })
    }
    if (propty === 'salePercent' && saleType * 1 === 2) { //原价比例
      this.setState({ saleMoney: (sellPrice * value / 100).toFixed(1) })
    }
  }

  // 售价变化
  sellChange = (value) => {
    const { consType, saleType, consPercent, salePercent } = this.state
    this.setState({ sellPrice: (value && value * 1) ? (value * 1).toFixed(1) : value })

    if (consType * 1 === 2) { //原价
      this.setState({ consMoney: (value * consPercent / 100).toFixed(1) })
    } else {
      this.setState({ consMoney: 0 })
    }

    if (saleType * 1 === 2) {
      this.setState({ saleMoney: (value * salePercent / 100).toFixed(1) })
    } else {
      this.setState({ saleMoney: 0 })
    }
  }

  onOk = () => {
    const { form, onClose, curItem } = this.props
    const { salePercent, consPercent, consMoney, saleMoney, saleType, consType } = this.state
    form.validateFields((err, values) => {
      if (err) {
        return
      } else {
        if(saleType*1 !== 3 && saleType*1 !== 4 && !salePercent) {
          message.error('请填写销售提成')
          return false
        }
        if(consType*1 !== 3 && consType*1 !== 4 && !consPercent) {
          message.error('请填写施工提成')
          return false
        }
        if((consType*1 === 4 && !consMoney) || (saleType*1 === 4 && !saleMoney)) {
          message.error('请填写固定金额')
          return false
        }
        values = {
          ...values,
          projectId: curItem.id || curItem.pId,
          categoryId: values.categoryId[values.categoryId.length - 1]||curItem.categoryId,
          salesCommissions: {
            type: values.salesCommissions * 1,
            percent: (saleType*1 === 3 || saleType*1 === 4) ? 0 : salePercent,
            money: (saleType*1 === 2 || saleType*1 === 4) ? saleMoney : 0,
          },
          roadWorkCommissions: {
            type: values.roadWorkCommissions * 1,
            percent: (consType*1 === 3 || consType*1 === 4) ? 0 : consPercent,
            money: (consType*1 ===1 || consType*1 ===2 || consType*1 === 4) ? consMoney : 0,
          },
        }
      }
      service.INSERT({
        keys: { name: 'store/project/update' },
        data: values,
      }).then(res => {
        if (res.success) {
          onClose(true, { ...curItem, price: values.priceTem, info: 0, itemTotal: values.priceTem * curItem.num * curItem.discount/10 })
          message.success('设置价格成功!')
          form.resetFields()
          this.setState({
            consType: 4,
            saleType: 4,
            sellPrice: 0,
            consMoney: 0,
            saleMoney: 0,
            salePercent: '',
            consPercent: '',
          })
        }else {
          message.error(`${res.content}`)
        }
      })
    })
  }

  render() {

    const { getFieldDecorator, getFieldValue } = this.props.form
    const {projectList,curItem}=this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    let idArr=[]
      //处理分类tree，初始化
      if(projectList){projectList.map((item)=>{
        if(item.children){
          item.children.map((val)=>{
          if(val.categoryId===curItem.categoryId){
           idArr.push(item.categoryId)
           idArr.push(val.categoryId)
          }
          })
        }else{
          if(item.categoryId===curItem.categoryId){
            idArr=[curItem.categoryId]
           }
        }
    })}
    let idarr=this.props.form.getFieldValue('categoryId')
    let leng=this.props.form.getFieldValue('categoryId')&&this.props.form.getFieldValue('categoryId').length-1
    const reviseCategory=idarr&&this.props.curItem.categoryId?idarr[leng] !== this.props.curItem.categoryId : false
    return (
      <Modal
        title={'编辑项目'}
        visible={this.props.visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
        width="570px"
        maskClosable={false}
        className="out-modal"
      >
        <Form>
          <FormItem
            label="项目名称"
            style={{ height: 60 }}
            {...formItemLayout}
          >
            {getFieldDecorator('projectName', {
              rules: [{
                required: true, message: '请输入项目名称!',
              }],
              initialValue: `${this.props.curItem.name || this.props.curItem.pName}`,
            })(
              <Input size='large' placeholder="项目名称" disabled></Input>
            )}
          </FormItem>
          <FormItem style={{ height: 60 }} {...formItemLayout} label="分类" help={reviseCategory ? <span style={{color: '#ff6f28 '}}>注意：分类修改后，项目不再享有原分类折扣</span> : ''}>
                {getFieldDecorator(
                  "categoryId",
                  {...validate("分类", { required: true, type: "select"}),initialValue:idArr}
                )(
                  <Cascader
                    size="large"
                    placeholder="请选择分类"
                    options={projectList}
                    expandTrigger="hover"
                  />
                )}
              </FormItem>
          <FormItem
            label="售价"
            style={{ height: 60, position: 'relative' }}
            {...formItemLayout}
          >
            {getFieldDecorator('priceTem', {
              rules: [{
                required: true, message: '请输入一位小数的正数!', pattern: /^[0-9]+\.{0,1}[0-9]{0,1}$/,
              }],
            })(
              <InputNumber
                size='large'
                min={0}
                style={{ width: '100%' }}
                placeholder="请输入"
                onChange={this.sellChange}
              ></InputNumber>
            )}
            <span className={style.dark}>元</span>
          </FormItem>
          <FormItem
            label="成本"
            style={{ height: 60, position: 'relative' }}
            {...formItemLayout}
          >
            {getFieldDecorator('costTem', {
              rules: [{
                message: '请输入一位小数的正数!', pattern: /^[0-9]+\.{0,1}[0-9]{0,1}$/,
              }],
              initialValue: this.props.curItem.costTem,
            })(
              <InputNumber
                size='large'
                min={0}
                style={{ width: '100%' }}
                placeholder="请输入"
                disabled={this.props.curItem.formTem*1 !== 2}
              ></InputNumber>
            )}
            <span className={style.dark}>元</span>
          </FormItem>
          <FormItem
            label="销售提成"
            style={{ height: 60, position: 'relative' }}
            {...formItemLayout}
            extra={
              this.state.saleType * 1 === 5 ? (
                <div style={{color: '#FF6F28'}}>
                  注：利润 = 原价 - 成本
              </div>
              ) : this.state.saleType*1 === 4 && (this.state.saleMoney*1 > getFieldValue('priceTem') || (this.state.saleMoney*1 && !getFieldValue('priceTem'))) ? (
                <div style={{color: '#FF6F28', fontSize: '12px'}}>
                  提成金额大于售价，请留意
                </div>
              ) : this.state.saleType * 1 === 6 ?  (
                  <div style={{color: '#FF6F28'}}>
                    注：毛利 = 消耗 - 成本
                </div>
                ) : ''
            }
          >
            {getFieldDecorator('salesCommissions', {
              rules: [{
                required: true, message: `请选择一种类型!`,
              }],
              initialValue: '4',
            })(
              <Select
                size="large"
                style={{ width: '40%' }}
                placeholder="请选择"
                onChange={(e) => this.changeHandel(e, 'saleType')}
              >
                {
                  this.state.saleList.map(v => {
                    return <Option key={v.id}>{v.name}</Option>
                  })
                }
              </Select>
            )}
            {this.state.saleType * 1 === 4 ? '' : <InputNumber
              size='large'
              style={{ width: '60%' }}
              min={0}
              max={this.state.saleType * 1 === 4 ? undefined : 100}
              disabled={this.state.saleType * 1 === 3}
              precision={1}
              onChange={(e) => this.inputChange(e, 'salePercent')}
              value={this.state.salePercent}
            ></InputNumber>}
            {this.state.saleType * 1 === 4 ? <InputNumber
              size='large'
              style={{ width: '60%' }}
              min={0}
              onChange={(e) => this.inputChange(e, 'saleMoney')}
              value={this.state.saleMoney}
            ></InputNumber> : ''}
            {this.state.saleType * 1 === 4 ? '' : <span className={style.dark}>%</span>}
            {this.state.saleType * 1 === 4 ? <span className={style.dark}>元</span> : ''}
          </FormItem>
          {
            this.state.saleType * 1 === 2 &&
            <FormItem style={{ position: 'relative', textAlign: 'right', left: 126, marginBottom: 30 }} {...formItemLayout}>
              <span>即提成</span>
              <InputNumber
                size='large'
                style={{ width: '60%', marginLeft: 14 }}
                value={this.state.saleMoney}
                onChange={this.saleMoneyChange}
                max={this.state.sellPrice}
              ></InputNumber>
              <span className={style.dark}>元</span>
            </FormItem>
          }
          <FormItem
            label="施工提成"
            style={{ height: 60, position: 'relative' }}
            {...formItemLayout}
            extra={
              this.state.consType * 1 === 5 ? (
                <div style={{color: '#FF6F28'}}>
                  注：利润 = 原价 - 成本
              </div>
              ) : this.state.consType*1 === 4 && (this.state.consMoney*1 > getFieldValue('priceTem') || (this.state.consMoney*1 && !getFieldValue('priceTem'))) ? (
                <div style={{color: '#FF6F28', fontSize: '12px'}}>
                  提成金额大于售价，请留意
                </div>
              ) : this.state.consType * 1 === 6 ?  (
                  <div style={{color: '#FF6F28'}}>
                    注：毛利 = 消耗 - 成本
                </div>
                ) : ''
            }
          >
            {getFieldDecorator('roadWorkCommissions', {
              rules: [{
                required: true, message: `请选择一种类型!`,
              }],
              initialValue: '4',
            })(
              <Select
                size="large"
                style={{ width: '40%' }}
                placeholder="请选择"
                onChange={(e) => this.changeHandel(e, 'consType')}
              >
                {
                  this.state.constructList.map(v => {
                    return <Option key={v.id}>{v.name}</Option>
                  })
                }
              </Select>
            )}
            {this.state.consType * 1 === 4 ? '' : <InputNumber
              size='large'
              style={{ width: '60%' }}
              min={0}
              max={this.state.consType * 1 === 4 ? undefined : 100}
              disabled={this.state.consType * 1 === 3}
              precision={1}
              onChange={(e) => this.inputChange(e, 'consPercent')}
              value={this.state.consPercent}
            ></InputNumber>}
            {this.state.consType * 1 === 4 ? <InputNumber
              size='large'
              style={{ width: '60%' }}
              min={0}
              onChange={(e) => this.inputChange(e, 'consMoney')}
              value={this.state.consMoney}
            ></InputNumber> : ''}
            {this.state.consType * 1 === 4 ? '' : <span className={style.dark}>%</span>}
            {this.state.consType * 1 === 4 ? <span className={style.dark}>元</span> : ''}
          </FormItem>
          {
            (this.state.consType * 1 === 1 || this.state.consType * 1 === 2) &&
            <FormItem style={{ position: 'relative', textAlign: 'right', left: 126 }} {...formItemLayout}>
              {
                this.state.consType * 1 === 1//实收
                  ?
                  <span>
                    <Tooltip placement="top" title={this.state.title}>
                      <i className='iconfont icon-wenhao1' style={{ marginRight: 6, fontSize: 14, color: '#4AACF7', cursor: 'pointer' }}></i>
                    </Tooltip>
                    保底提成
                </span>
                  :
                  <span>即提成</span>
              }
              <InputNumber
                size='large'
                style={{ width: '60%', marginLeft: 14 }}
                value={this.state.consMoney}
                onChange={this.moneyChange}
                max={this.state.sellPrice}
              ></InputNumber>
              <span className={style.dark}>元</span>
            </FormItem>
          }
        </Form>
      </Modal>
    )
  }
}
function mapStateToProps(state) {
  const {  projectList } = state.storeSort
  return { projectList }
}
const WrappedTimeRelatedForm=Form.create()(SettingProjectPrice)
export default connect(mapStateToProps)(WrappedTimeRelatedForm)
