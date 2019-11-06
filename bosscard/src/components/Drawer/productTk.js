import { Component } from 'react'
import { connect } from "dva"
import { Modal, Form, Select, InputNumber, Input, Cascader, Tooltip, message, Radio, Button  } from "antd"
import service from 'services'
import validate from "../../utils/validate"
import listTurnTree from "utils/listTurnTree"
import style from './style.less'
import PullDown from '../PullDown/index'


const FormItem = Form.Item
const Option = Select.Option
const Group = Radio.Group

class productTk extends Component {

  constructor(props) {
    super(props)
    console.log(props.controlRequired,'李远钏')
    this.state = {
      salePercent: props.controlRequired ? '' : '0.0',
      consPercent: props.controlRequired ? '' : '0.0',
      productList: [], //产品分类
      maintainList: [], //业务类型
      unitList: [],
      consType: 4, //施工提成类型
      saleType: 4, //销售提成类型
      sellPrice: '0.0',//销售价格
      consMoney: props.controlRequired ? '' : '0.0', //施工 -即提成
      saleMoney: props.controlRequired ? '' : '0.0',//销售 -即提成
      defaultUnit: 0, //默认单位
      product_name: '',
      commodity_code: '',
      title: '实收比例计算的提成低于保底提成时，按保底提成计算。',
      saleList: [{id: 1, name: '实收比例'}, {id: 2, name: '原价比例'}, {id: 4, name: '固定金额'}, {id: 5, name: '利润比例'}, {id: 6, name: '毛利提成'}, {id: 3, name: '不提成'}],
      constructList: [{id: 1, name: '实收比例'}, {id: 2, name: '原价比例'}, {id: 4, name: '固定金额'}, {id: 5, name: '利润比例'}, {id: 6, name: '毛利提成'}, {id: 3, name: '不提成'}],
    }
  }

  componentWillMount() {
    const {outsideType} = this.props
    if(outsideType) {
      // 获取默认提成
      this.setState({
        consType: 5,
        saleType: 5,
      })
      this.miningOutside()
    }
    // 获取产品分类
    service.list({
      keys: {name: "store/productcategory"},
    }).then(res => {
      if(res.success) {
        let list = res.list.map(v => ({...v, value: v.categoryId, label: v.categoryName, name: v.categoryName}))
        this.setState({productList: listTurnTree("categoryId", "pId", list)})
      }
    })
    //获取业务类型
    service.LIST({
      keys: {name: "store/maintaintype"},
    }).then(res => {
      if(res.success) {
        let list = res.list.map(v=> ({...v, value: v.maintainTypeId, label: v.name}))
        this.setState({maintainList: listTurnTree("maintainTypeId", "pId", list)})
      }
    })
    // 获取单位列表
    service.LIST({
      keys: {name: 'store/unit/list'},
    }).then(res => {
      if(res.success) {
        this.setState({unitList: res.list.map(v => ({...v, name: v.unitName, id: v.unitId})), defaultUnit: res.list[0].unitId})
      }
    })
  }

  onCancel = () => {
    this.props.onClose(false,'',false)
    this.props.form.resetFields()
    this.setState({
      consType: 4,
      saleType: 4,
      sellPrice: '0.0',
      consMoney: '0.0',
      saleMoney: '0.0',
      salePercent: '0.0',
      consPercent: '0.0',
    })
  }

  // 下拉框变化
  changeHandel = (e, propty) => {
    this.setState({
      [propty]: e,
    })
    const { sellPrice, salePercent, consPercent } = this.state
    if(propty === 'consType') {
      if(Number(e) === 2) {
        this.setState({consMoney: sellPrice * consPercent/100})
      }else {
        this.setState({consMoney: 0})
      }
    }
    if(propty === 'saleType') {
      if(Number(e) === 2) {
        this.setState({saleMoney: sellPrice * salePercent/100})
      }else {
        this.setState({saleMoney: 0})
      }
    }
  }

  // 提成金额变化
  moneyChange = (e) => {
    this.setState({consMoney: e})
    const { consType, sellPrice } = this.state
    if(consType*1 === 2 && e && e*1) { //原价比例
      this.setState({consPercent: e/sellPrice * 100})
    }
  }

  saleMoneyChange = (e) => {
    this.setState({saleMoney: e})
    const { saleType, sellPrice } = this.state
    if(saleType*1 === 2 && e && e*1) { //原价比例
      this.setState({salePercent: e/sellPrice * 100})
    }
  }

  // 提成比例变化
  inputChange = (value, propty) => {
    const { sellPrice, consType, saleType } = this.state
    this.setState({[propty]: value})
    if(propty === 'consPercent' && consType*1 === 2) { //原价比例
      this.setState({consMoney: sellPrice * value/100})
    }
    if(propty === 'salePercent' && saleType*1 === 2) { //原价比例
      this.setState({saleMoney: sellPrice * value/100})
    }
  }

  // 售价变化
  sellChange = (value) => {
    const { consType, saleType, consPercent, salePercent } = this.state
    this.setState({sellPrice: value*1})
    if(consType*1 === 2) { //原价
      this.setState({consMoney: value*1 * consPercent/100})
    }else {
      this.setState({consMoney: 0})
    }

    if(saleType*1 === 2) {
      this.setState({saleMoney: value*1 * salePercent/100})
    }else {
      this.setState({saleMoney: 0})
    }
  }
  // 选选择外采类型时，显示默认提成
  miningOutside=()=> {
    this.props.dispatch({ type: "miningOutside/edit"}).then(() => {
      const {miningData} = this.props
      const {setFieldsValue} = this.props.form
      this.setState({consType: miningData.construction.type, saleType: miningData.sales.type}, ()=> {
        this.setState({
          saleMoney: miningData.sales.money,
          salePercent: miningData.sales.percent,
          consMoney: miningData.construction.money,
          consPercent: miningData.construction.percent,
        }, () => {
          setFieldsValue({
            salesCommissions: miningData.sales.type + '',
            roadWorkCommissions: miningData.construction.type + '',
          })
        })
      })
    })
  }

  changeType = (e) => {
    const {setFieldsValue} = this.props.form
    if(e.target.value === 0) {
      this.miningOutside()
    } else {
      this.setState({
        consType: 4,
        saleType: 4,
        sellPrice: '0.0',
        consMoney: '0.0',
        saleMoney: '0.0',
        salePercent: '0.0',
        consPercent: '0.0',
      })
      setFieldsValue({
        salesCommissions: '4',
        roadWorkCommissions: '4',
      })
    }
  }

  onOk = (isClose) => {
    const { form, onClose, controlRequired } = this.props
    const { salePercent, consPercent, consMoney, saleMoney, saleType, consType } = this.state
    form.validateFields((err, values) => {
      if(err) {
        return
      }else {
          if(controlRequired){// 如果controlRequired：true ,（销售价格-销售提成-施工提成）非必填
              values = {
                ...values,
                commodityCode: values.commodityCode || '',
                sellingPriceTem:  values.sellingPriceTem || 0, // 销售价格
                warehouseId: 0,
                categoryId: values.categoryId[values.categoryId.length-1],
                maintainTypeId: values.maintainTypeId[values.maintainTypeId.length-1],
                salesCommissions: salePercent||saleMoney ? {
                  type: values.salesCommissions * 1,
                  percent: (saleType*1 === 3 || saleType*1 === 4) ? 0 : salePercent,
                  money: (saleType*1 === 2 || saleType*1 === 4) ? saleMoney : 0,
                } : 0,
                roadWorkCommissions: consPercent || consMoney ? {
                  type: values.roadWorkCommissions * 1,
                  percent: (consType*1 === 3 || consType*1 === 4) ? 0 : consPercent,
                  money: (consType*1 ===1 || consType*1 ===2 || consType*1 ===4) ? consMoney : 0,
                } : 0,
              }
          }else{

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
                commodityCode: values.commodityCode || '',
                warehouseId: 0,
                categoryId: values.categoryId[values.categoryId.length-1],
                maintainTypeId: values.maintainTypeId[values.maintainTypeId.length-1],
                salesCommissions: {
                  type: values.salesCommissions * 1,
                  percent: (saleType*1 === 3 || saleType*1 === 4) ? 0 : salePercent,
                  money: (saleType*1 === 2 || saleType*1 === 4) ? saleMoney : 0,
                },
                roadWorkCommissions: {
                  type: values.roadWorkCommissions * 1,
                  percent: (consType*1 === 3 || consType*1 === 4) ? 0 : consPercent,
                  money: (consType*1 ===1 || consType*1 ===2 || consType*1 ===4) ? consMoney : 0,
                },
              }
          }
      }
      service.INSERT({
        keys: {name: 'store/product/insert'},
        data: values,
      }).then(res => {
        if(res.success) {
          if(isClose) {
            onClose(true, res.id, false)
          }else {
            onClose(true, res.id, true)
          }
          message.success('添加产品成功！')
          form.resetFields()
          this.setState({
            consMoney: '0.0',
            consType: 4,
            saleType: 4,
            showMsg: false,
            salePercent: '0.0',
            consPercent: '0.0',
          })
        }else {
          message.error(res.content)
        }
      })
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const {outsideType, controlRequired} = this.props
    return (
      <Modal
        title={'新建产品'}
        visible={this.props.visible}
        // onOk={this.onOk}
        onCancel={this.onCancel}
        width="900px"
        height="660px"
        maskClosable={false}
        className="out-modal"
        footer={null}
      >
        <div className={style.productTk + " productTk-wrap"} >
          <Form layout="vertical">
            <FormItem
              label="产品名称"
            >
              {getFieldDecorator('productName', validate("产品名称", {
                required: true,
                max: 30,
                type: "string",
                sole: true,
                key: "name",
                model: "Product",
                id: '',
                _var: { '_': Number(localStorage.getItem('coiling')) === 1 ? '1|2' : 2, commodity_code: this.state.commodity_code},
              }))(
                <Input
                size='large'
                placeholder="产品名称"
                onChange={(e) => {
                  this.setState({product_name: e.target.value}, () => {
                    this.props.form.validateFields(['commodityCode'],{force: true})
                  })
                }}
                ></Input>
              )}
            </FormItem>
            <FormItem
              label="编码"
            >
              {getFieldDecorator('commodityCode',validate("编码", {
                required: false,
                max: 30,
                sole: true,
                model: "Product",
                id: '',
                _var:  { '_': Number(localStorage.getItem('coiling')) === 1 ? '1|2' : 2, product_name: this.state.product_name},
                }))(
                <Input
                size='large'
                placeholder="产品编码"
                onChange={(e) => {
                  this.setState({commodity_code: e.target.value}, () => {
                    this.props.form.validateFields(['productName'],{force: true})
                  })
                }}
                ></Input>
              )}
            </FormItem>
            <FormItem
              label="业务类型"
            >
              {getFieldDecorator('maintainTypeId', {
                rules: [{
                  required: true, message: `请选择一种类型!`,
                }],
              })(
                <Cascader
                  size="large"
                  placeholder="请选择类型"
                  options={this.state.maintainList}
                  expandTrigger="hover"
                  allowClear={false}
                />
              )}
            </FormItem>
            <FormItem
              label="所属分类"
            >
              {getFieldDecorator('categoryId', {
                rules: [{
                  required: true, message: `请选择一种分类!`,
                }],
              })(
                <Cascader
                  size="large"
                  placeholder="请选择分类"
                  options={this.state.productList}
                  expandTrigger="hover"
                  allowClear={false}
                />
              )}
            </FormItem>
            <FormItem
              label="销售价格"
              style={{position: 'relative'}}
            >
              {getFieldDecorator('sellingPriceTem', {
                rules: [{
                  required: controlRequired?false:true, message: '请输入一位小数的正数!', pattern: /^[0-9]+\.{0,1}[0-9]{0,1}$/,
                }],
              })(
                <InputNumber
                size='large'
                min={0}
                style={{width: '100%'}}
                placeholder='请输入'
                precision={1}
                onChange={this.sellChange}
                ></InputNumber>
              )}
              <span className={style.dark}>元</span>
            </FormItem>
            <FormItem
              label="单位"
            >
              {getFieldDecorator(
                "unitId",
                {
                  ...validate("单位", { required: true, type: "select", initialValue: this.state.defaultUnit}),
                  initialValue: this.state.defaultUnit,
                }
              )(
                <PullDown data={this.state.unitList} tdWidth={'66px'}></PullDown>
              )}
            </FormItem>
            <FormItem
              label="产品类型"
            >
              {getFieldDecorator('type', {initialValue: outsideType ? 0 : 1})(
                <Group onChange={this.changeType}>
                  <Radio value={1}>自有产品</Radio>
                  <Radio value={0}>外采产品</Radio>
                </Group>
              )}
            </FormItem>
            <FormItem></FormItem>

            <FormItem
              label="销售提成"
              style={{position: 'relative', marginBottom: 0, paddingBottom: 0}}
              extra={this.state.saleType*1 === 4 && (this.state.saleMoney*1 > getFieldValue('sellingPriceTem') || (this.state.saleMoney*1 && !getFieldValue('sellingPriceTem'))) ? (
                <div style={{color: '#FF6F28', fontSize: '12px'}}>
                  提成金额大于售价，请留意
                </div>
              ) : this.state.saleType*1 === 6 ? (
                  <div style={{color: '#FF6F28'}}>
                    注：毛利 = 消耗 - 成本
                </div>
                ) : ''}
            >
              {getFieldDecorator('salesCommissions', {
                rules: [{
                  required: controlRequired?false:true, message: `请选择一种类型!`,
                }],
                initialValue: outsideType ? '5' : '4',
              })(
                <Select
                  size="large"
                  style={{width: '40%'}}
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
              {this.state.saleType*1 === 4 ? '' : <InputNumber
              size='large'
              style={{width: '60%', position: 'relative', top: '1px'}}
              min={0}
              precision={1}
              max={100}
              disabled={this.state.saleType*1 === 3}
              onChange={(e) => this.inputChange(e, 'salePercent')}
              value={this.state.salePercent}
              placeholder={controlRequired?'请输入':''}
              ></InputNumber>}
              {this.state.saleType*1 === 4 ? <InputNumber
              size='large'
              style={{width: '60%', position: 'relative', top: '1px'}}
              min={0}
              precision={1}
              onChange={(e) => this.inputChange(e, 'saleMoney')}
              value={this.state.saleMoney}
              placeholder={controlRequired?'请输入':''}
              ></InputNumber> : ''}
              {this.state.saleType*1 === 4 ? '' : <span className={style.dark}>%</span>}
              {this.state.saleType*1 === 4 ? <span className={style.dark}>元</span> : ''}
            </FormItem>

            <FormItem
              label="施工提成"
              style={{position: 'relative', marginBottom: 0, paddingBottom: 0}}
              extra={this.state.consType*1 === 4 && (this.state.consMoney*1 > getFieldValue('sellingPriceTem') || (this.state.consMoney*1 && !getFieldValue('sellingPriceTem'))) ? (
                <div style={{color: '#FF6F28', fontSize: '12px'}}>
                  提成金额大于售价，请留意
                </div>
              ) : this.state.consType*1 === 6 ? (
                  <div style={{color: '#FF6F28'}}>
                    注：毛利 = 消耗 - 成本
                </div>
                ) : ''}
            >
              {getFieldDecorator('roadWorkCommissions', {
                rules: [{
                  required: controlRequired?false:true, message: `请选择一种类型!`,
                }],
                initialValue: outsideType ? '5' : '4',
              })(
                <Select
                  size="large"
                  style={{width: '40%'}}
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
              {this.state.consType*1 === 4 ? '' : <InputNumber
              size='large'
              style={{width: '60%', position: 'relative', top: '1px'}}
              min={0}
              precision={1}
              max={100}
              disabled={this.state.consType*1 === 3}
              onChange={(e) => this.inputChange(e, 'consPercent')}
              value={this.state.consPercent}
              placeholder={controlRequired?'请输入':''}
              ></InputNumber>}
              {this.state.consType*1 === 4 ? <InputNumber
              size='large'
              style={{width: '60%', position: 'relative', top: '1px'}}
              min={0}
              precision={1}
              onChange={(e) => this.inputChange(e, 'consMoney')}
              value={this.state.consMoney}
              placeholder={controlRequired?'请输入':''}
              ></InputNumber> : ''}
              {this.state.consType*1 === 4 ? '' : <span className={style.dark}>%</span>}
              {this.state.consType*1 === 4 ? <span className={style.dark}>元</span>: ''}
            </FormItem>
            {/* 销售即提成 */}
            {
              this.state.saleType*1 === 2 ?
              <FormItem style={{position: 'relative', textAlign: 'right'}}>
                <span>即提成</span>
                <InputNumber
                size='large'
                precision={1}
                style={{width: '60%', marginLeft: 14}}
                value={this.state.saleMoney}
                onChange={this.saleMoneyChange}
                placeholder={controlRequired?'请输入':''}
                ></InputNumber>
                <span className={style.dark}>元</span>
              </FormItem>
              : <FormItem>
                {
                  this.state.saleType*1 === 5 &&
                  <span style={{marginTop: 8, color: '#FF6F28'}}>注：利润 = 原价 - 成本</span>
                }
              </FormItem>
            }
            {/* 施工即提成 */}
            {
              (this.state.consType*1 === 1 || this.state.consType*1 === 2) ?
              <FormItem style={{position: 'relative', textAlign: 'right'}}>
                {
                  this.state.consType*1 === 1//实收
                  ?
                  <span>
                    <Tooltip placement="top" title={this.state.title}>
                      <i className='iconfont icon-wenhao1' style={{marginRight: 6, fontSize: 14, color: '#4AACF7', cursor: 'pointer'}}></i>
                    </Tooltip>
                    保底提成
                  </span>
                  :
                  <span>即提成</span>
                }
                <InputNumber
                size='large'
                precision={1}
                style={{width: '60%', marginLeft: 14}}
                value={this.state.consMoney}
                onChange={this.moneyChange}
                max={this.state.consType*1 === 1 ? undefined :this.state.sellPrice*1}
                placeholder={controlRequired?'请输入':''}
                ></InputNumber>
                <span className={style.dark}>元</span>
              </FormItem>
              : <FormItem>
                {
                  this.state.consType*1 === 5 &&
                  <span style={{marginTop: 8, color: '#FF6F28'}}>注：利润 = 原价 - 成本</span>
                }
              </FormItem>
            }
          </Form>
          <div style={{marginTop: 40, paddingBottom: 32, textAlign: 'right'}}>
            <Button size='large' onClick={this.onCancel} style={{marginRight: 20}}>取消</Button>
            <Button size='large' onClick={() => this.onOk(true)} style={{marginRight: 20}} type='primary'>提交</Button>
            <Button size='large' type='primary' onClick={() => this.onOk(false)}>提交并新建下一个</Button>
          </div>
        </div>
      </Modal>
    )
  }
}
function mapStateToProps(state) {
  const {miningData} = state.miningOutside
  return {miningData}
}
export default connect(mapStateToProps)(Form.create()(productTk))
