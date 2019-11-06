import { Component } from 'react'
import { Modal, Form, Select, InputNumber, Input, Cascader, Tooltip, message } from "antd"
import service from 'services'
import validate from "../../utils/validate"
import listTurnTree from "utils/listTurnTree"
import style from './style.less'


const FormItem = Form.Item
const Option = Select.Option

class projectTk extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      salePercent: '0.0',
      consPercent: '0.0',
      projectList: [], //项目分类
      maintainList: [], //业务类型
      consType: 4, //施工提成类型
      saleType: 4, //销售提成类型
      sellPrice: '0.0',//销售价格
      consMoney: '0.0', //施工 -即提成
      saleMoney: '0.0',//销售 -即提成
      title: '实收比例计算的提成低于保底提成时，按保底提成计算。',
      saleList: [{id: 1, name: '实收比例'}, {id: 2, name: '原价比例'}, {id: 4, name: '固定金额'}, {id: 5, name: '利润比例'}, {id: 6, name: '毛利提成'}, {id: 3, name: '不提成'}],
      constructList: [{id: 1, name: '实收比例'}, {id: 2, name: '原价比例'}, {id: 4, name: '固定金额'},{id: 5, name: '利润比例'}, {id: 6, name: '毛利提成'}, {id: 3, name: '不提成'}],
    }
  }

  componentWillMount() {
    // 获取项目分类
    service.list({
      keys: {name: "store/projectcategory"},
    }).then(res => {
      if(res.success) {
        let list = res.list.map(v => ({...v, value: v.categoryId, label: v.categoryName, name: v.categoryName}))
        this.setState({projectList: listTurnTree("categoryId", "pId", list)})
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
  }
  
  onCancel = () => {
    this.props.onClose(false)
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
      this.setState({consMoney: value * consPercent/100})
    }else {
      this.setState({consMoney: 0})
    }

    if(saleType*1 === 2) {
      this.setState({saleMoney: value * salePercent/100})
    }else {
      this.setState({saleMoney: 0})
    }
  }

  onOk = () => {
    const { form, onClose } = this.props
    const { salePercent, consPercent, consMoney, saleMoney, consType, saleType } = this.state
    form.validateFields((err, values) => {
      if(err) {
        return
      }else {
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
            money: (consType*1 ===1 || consType*1 ===2 || consType*1 === 4) ? consMoney : 0,
          },
        }
      }
      service.INSERT({
        keys: {name: 'store/project/insert'},
        data: values,
      }).then(res => {
        if(res.success) {
          onClose(true, res.id)
          message.success('添加项目成功！')
          form.resetFields()
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
      })
    })
  }

  render() {

    const { getFieldDecorator, getFieldValue } = this.props.form
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

    return (
      <Modal
        title={'新建项目'}
        visible={this.props.visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
        width="570px"
        maskClosable={false}
        className="out-modal"
      >
        <Form className="productTk-wrap">
          <FormItem
            label="项目名称"
            style={{height: 60}}
            {...formItemLayout}
          >
            {getFieldDecorator('projectName',validate("项目名称", {
                required: true,
                max: 30,
                type: "string",
                sole: true,
                key: "name",
                model: "Project",
                id: '',
                _var: Number(localStorage.getItem('coiling')) === 1 ? '1|2' : 2,
              }))(
              <Input size='large' placeholder="项目名称"></Input>
            )}
          </FormItem>
          <FormItem
            label="分类"
            style={{height: 60}}
            {...formItemLayout}
          >
            {getFieldDecorator('categoryId', {
              rules: [{
                required: true, message: `请选择一种分类!`,
              }],
            })(
              <Cascader
                size="large"
                placeholder="请选择分类"
                options={this.state.projectList}
                expandTrigger="hover"
                allowClear={false}
              />
            )}
          </FormItem>
          <FormItem
            label="业务类型"
            style={{height: 60}}
            {...formItemLayout}
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
            label="售价"
            style={{height: 60, position: 'relative'}}
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
              style={{width: '100%'}} 
              precision={1}
              placeholder="请输入" 
              onChange={this.sellChange}
              ></InputNumber>
            )}
            <span className={style.dark}>元</span>
          </FormItem>
          <FormItem 
            label="成本" 
            style={{height: 60, position: 'relative'}}
            {...formItemLayout}
          >
            {getFieldDecorator(
              "costTem",
              validate("成本", { min: 0, type: "money" })
            )(
              <Input
                placeholder="输入成本"
                size="large"
                addonAfter="元"
              />
            )}
          </FormItem>
          <FormItem
            label="销售提成"
            style={{height: 60, position: 'relative'}}
            {...formItemLayout}
            extra={this.state.saleType*1 === 4 && (this.state.saleMoney*1 > getFieldValue('priceTem') || (this.state.saleMoney*1 && !getFieldValue('priceTem'))) ? (
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
                required: true, message: `请选择一种类型!`,
              }],
              initialValue: '4',
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
            style={{width: '60%'}}  
            precision={1}
            min={0}
            max={100}
            disabled={this.state.saleType*1 === 3} 
            onChange={(e) => this.inputChange(e, 'salePercent')}
            value={this.state.salePercent} 
            ></InputNumber>}
            {this.state.saleType*1 === 4 ? <InputNumber 
            size='large'
            style={{width: '60%'}}
            precision={1}
            min={0}
            onChange={(e) => this.inputChange(e, 'saleMoney')}
            value={this.state.saleMoney} 
            ></InputNumber> : ''}
            {this.state.saleType*1 === 4 ? '' : <span className={style.dark}>%</span>}
            {this.state.saleType*1 === 4 ? <span className={style.dark}>元</span> : ''}
            {
              this.state.saleType*1 === 5 &&
              <div style={{color: '#FF6F28'}}>注：利润 = 原价 - 成本</div>
            }
          </FormItem>
          {
            this.state.saleType*1 === 2 &&
            <FormItem style={{position: 'relative', textAlign: 'right', left: 126, marginBottom: 30}} {...formItemLayout}>
              <span>即提成</span>
              <InputNumber 
              size='large'
              style={{width: '60%', marginLeft: 14}} 
              value={this.state.saleMoney}
              precision={1}
              onChange={this.saleMoneyChange}
              max={this.state.sellPrice*1}
              ></InputNumber>
              <span className={style.dark}>元</span>
            </FormItem>
          }
          <FormItem
            label="施工提成"
            style={{height: 60, position: 'relative'}}
            {...formItemLayout}
            extra={this.state.consType*1 === 4 && (this.state.consMoney*1 > getFieldValue('priceTem') || (this.state.consMoney*1 && !getFieldValue('priceTem'))) ? (
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
                required: true, message: `请选择一种类型!`,
              }],
              initialValue: '4',
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
            style={{width: '60%'}} 
            min={0}
            precision={1}
            max={100}
            disabled={this.state.consType*1 === 3} 
            onChange={(e) => this.inputChange(e, 'consPercent')}
            value={this.state.consPercent}
            ></InputNumber>}
            {this.state.consType*1 === 4 ? <InputNumber 
            size='large' 
            style={{width: '60%'}}
            min={0}
            precision={1}
            onChange={(e) => this.inputChange(e, 'consMoney')}
            value={this.state.consMoney}
            ></InputNumber> : ''}
            {this.state.consType*1 === 4 ? '' : <span className={style.dark}>%</span>}
            {this.state.consType*1 === 4 ? <span className={style.dark}>元</span>: ''}
            {
              this.state.consType*1 === 5 &&
              <div style={{color: '#FF6F28'}}>注：利润 = 原价 - 成本</div>
            }
          </FormItem>
          {
            (this.state.consType*1 === 1 || this.state.consType*1 === 2) &&
            <FormItem style={{position: 'relative', textAlign: 'right', left: 126}} {...formItemLayout}>
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
              style={{width: '60%', marginLeft: 14}} 
              value={this.state.consMoney}
              onChange={this.moneyChange}
              precision={1}
              max={this.state.sellPrice*1}
              ></InputNumber>
              <span className={style.dark}>元</span>
            </FormItem>
          }
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(projectTk)