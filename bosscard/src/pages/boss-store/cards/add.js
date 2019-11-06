
import { Component } from 'react'
import { Button, Form, Input, InputNumber, Select, Radio, message, Row, Col, Checkbox, Popover,Icon  } from 'antd'
import { connect } from 'dva'

import {__PROJECT_TYPE__, __PRODUCT_TYPE__} from 'utils/globalConfig'
import validate from '../../../utils/validate'
import services from '../../../services'
import moment from 'moment'
// import ClassifyList from 'components/ClassifyList'
// import SelectProject from 'components/SelectProject'
import SelectGiveItems from "../member-center/components/select-give-items/index"
import FormTitle from 'components/FormTitle'
import Tabbar from 'components/Tabbar'
import CategoryTk from './component/categoryTk'
import SelectedTk from './component/projectTk'
import Cards from './cards'
import Mast from '../card-stage/components/mast'
import styles from './style.less'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const { TextArea } = Input

const Add = Form.create({
  mapPropsToFields(props) { //编辑操作,表单默认
    const {  editItem, type } = props
    if(type === 'edit'){
      let obj = {}
      Object.keys(editItem).map(v => {
        return obj[v] = Form.createFormField({
          value: editItem[v],
        })
      })
      if(editItem['salesType']===0){
        obj['salesType']=Form.createFormField({
          value:1,
        })
      }
      return obj
    }else{
      return {
        state: Form.createFormField({value: 1}),
        neverValid: Form.createFormField({value: 0}),
        deadlineNum: Form.createFormField({value: 1}),
      }
    }
  },
}) (
  class extends Component {

    state = {
      showClassify: false,
      showItemPj: false,
      showItemPd: false,
      projectSelect: [], //项目分类
      productSelect: [], //产品分类
      projectItem: [], //具体项目
      productItem: [], //具体产品
      giveInfo: [], //赠送信息
      canLoad: false, //能否加载赠送模块
      open: true,
      type: 1,
      nowSet: 0, //当前批量设置
      tempDiscount: 0,
      deadlineUnit: 1,
      neverValid: 0,
      disable: false,
      deleteArr: [],
      state: 1,
      saleDisable:false,
      mastShow: false, // 控制会员卡弹窗
      isChecked:false,
      initProList: {},
      isAsync: false,
    }

    publish() {
      const { validateFields, getFieldValue } = this.props.form
      const { type='add', hidAdd } = this.props
      const { giveInfo } = this.state
      validateFields((err, values) => {
        if (err) {
          return
        }

        if(getFieldValue('rechargeMoney') === 0) {
          message.error('充值金额必须大于0！')
          return false
        }

        Object.keys(values).map(key => {
          if(!values[key]){
            values[key] = 0
            if(key === 'remark') {
              values.remark = ''
            }
          }
          return true
        })
        values.neverValid = this.state.neverValid
        values.deadlineUnit = this.state.deadlineUnit
        values.state = this.state.state
        values.salesCommissions={type:values['salesType'],percent:values['salesPercent'] || 0, money: values.salesMoney || 0}
        if(Number(values.neverValid) === 1) {
          values.deadlineNum = 0
          values.deadlineUnit = 1
        }
        values.project = this.state.projectSelect.map(v => {
          return {
            goodId: v.categoryId,
            discount: v.discount,
            discountType: v.discountType,
            speciesType: 1,
            speciesInfoId: v.speciesInfoId ? v.speciesInfoId : 0,
          }
        })
        values.product = this.state.productSelect.map(v => {
          return {
            goodId: v.categoryId,
            discount: v.discount,
            discountType: v.discountType,
            speciesType: 2,
            speciesInfoId: v.speciesInfoId ? v.speciesInfoId : 0,
          }
        })
        values.specialProject = this.state.projectItem.map(v => {
          return {
            goodId: v.projectId,
            discount: v.discount,
            discountType: v.discountType,
            speciesType: 3,
            speciesInfoId: v.speciesInfoId ? v.speciesInfoId : 0,
          }
        })
        values.specialProduct	= this.state.productItem.map(v => {
          return {
            goodId: v.productId,
            discount: v.discount,
            discountType: v.discountType,
            speciesType: 4,
            speciesInfoId: v.speciesInfoId ? v.speciesInfoId : 0,
          }
        })
        values.giveInfo = giveInfo.slice(0, giveInfo.length - 1).map(v => {
          return {
            goodId: v.pId,
            speciesType: v.typeTem === 1 ? 5 : 6,
            numTem: v.numTem,
            speciesInfoId : v.speciesInfoId,
            deadlineMonth: v.deadlineMonth,
            // balidityPeriod: v.balidityPeriod,
            // unitPrice: v.unitPrice,
            // deadlineTime: v.deadlineStatus*1 === 1 ?  moment(v.deadlineTime).unix() : -1,
          }
        }) || []
        if(type === 'add') {
          values.updateClientCard = 0
          // console.log('values',values)
          services.insert({data: values,keys:{'name': 'store/species'}}).then(res => {
            if(res.success) {
              message.success('添加成功!')
              this.props.dispatch({
                type: 'table/getData',
                payload: 'store/species',
              })
              if(this.props.type){hidAdd()}
            }else {
              message.error(res.content)
            }
          })
        }else {
          let updateClientCard = this.state.isChecked? 1: 0
          values.deleteArr = this.state.deleteArr
          values.speciesId = this.props.id
          values.updateClientCard = updateClientCard
          // console.log('values',values)
          services.update({data: values, keys:{'name': 'store/species'}}).then(res => {
            if(res.success) {
              message.success('修改成功!')
              this.props.dispatch({
                type: 'table/getData',
                payload: 'store/species',
              })
              if(this.props.type){hidAdd()}
            }else {
              message.error(res.content)
            }
          })
        }
      })
    }

    radio(e) {
      this.setState({
        state: e.target.value,
      })
    }

    setDeadlineUnit(value) {
      this.setState({
        deadlineUnit: value,
      })
    }

    isDisable(e) {
      if(Number(e) === 1){
        this.props.form.setFieldsValue({
          deadlineNum: 1,
        })
        this.setState({
          disable: true,
          neverValid: e,
        })
      }else{
        this.setState({
          disable: false,
          neverValid: e,
        })
      }
    }

    hideModal() {
      this.setState({
        showClassify: false,
        showItemPj: false,
        showItemPd: false,
      })
    }

    showDc(v) {
      this.setState({
        showSet: true,
        nowSet: v,
      })
    }

    setSingle(type,data){
      switch (Number(type)) {
        case 1:
          this.setState({
            projectSelect: data,
          })
          break
        case 2:
          this.setState({
            productSelect: data,
          })
          break
        case 3:
          this.setState({
            projectItem: data,
          })
          break
        case 4:
          this.setState({
            productItem: data,
          })
          break
        default:
          break
      }
    }

    Show(v) {
      if( v === 1 || v === 2 ){
        this.setState({
          showClassify: true,
          type: v,
        })
      }else if( v === 3 ){
        this.setState({
          showItemPj: true,
          type: v,
        })
      }else{
        this.setState({
          showItemPd: true,
          type: v,
        })
      }
    }

    changeOpen() {
      this.setState({
        open: !this.state.open,
      })
    }

    deleteHandle = (e, propty) => {
      const isEdit = this.props.type
      if(isEdit === 'edit') {
        let temp = this.state.deleteArr
        temp.push(e.speciesInfoId)
        console.log('deleteArr', temp)
        this.setState({
          deleteArr: temp,
        })
      }
      if(propty === 3) {
        this.setState({
          projectItem: this.state.projectItem.filter(v => v.projectId !== e.projectId),
        })
      }
      if(propty === 4) {
        this.setState({
          productItem: this.state.productItem.filter(v => v.productId !== e.productId),
        })
      }
    }

    deleteItem(e,type) {
      switch (Number(type)) {
        case 1:
          this.setState({
            projectSelect: this.state.projectSelect.filter(v => v.categoryId !== e.categoryId),
          })
          break
        case 2:
          this.setState({
            productSelect: this.state.productSelect.filter(v => v.categoryId !== e.categoryId),
          })
          break
        case 3:
          this.setState({
            projectItem: this.state.projectItem.filter(v => v.projectId !== e.projectId),
          })
          this.projectRef.delSelectItem(e)
          break
        case 4:
          this.setState({
            productItem: this.state.productItem.filter(v => v.productId !== e.productId),
          })
          this.productRef.delSelectItem(e)
          break
        default:
          break
      }
      const isEdit = this.props.type
      if(isEdit === 'edit') {
        let temp = this.state.deleteArr
        e.speciesInfoId && temp.push(e.speciesInfoId)
        console.log('deleteArr', temp)
        this.setState({
          deleteArr: temp,
        })
      }
    }
    onJudge= () => {
      const { type='add' } = this.props
      if(type === 'add'){
        return
      }
      let {initProList, projectSelect, productSelect, projectItem, productItem} = this.state
      let { project, product, specialProject, specialProduct } = initProList
      let _project = project.map(v => ({...v, categoryName: v.name, categoryId: v.goodId}))
      let _product = product.map(v => ({...v, categoryName: v.name, categoryId: v.goodId}))
      let _specialProject = specialProject.map(v => ({...v, categoryName: v.name, categoryId: v.goodId}))
      let _specialProduct = specialProduct.map(v => ({...v, categoryName: v.name, categoryId: v.goodId}))

      let isOk1 = JSON.stringify(_project) !== JSON.stringify(projectSelect)? true: false
      let isOk2 = JSON.stringify(_product) !== JSON.stringify(productSelect)? true: false
      let isOk3 = JSON.stringify(_specialProject) !== JSON.stringify(projectItem)? true: false
      let isOk4 = JSON.stringify(_specialProduct) !== JSON.stringify(productItem)? true: false

      if(isOk1 || isOk2 || isOk3 || isOk4) {
        this.setState({ isAsync: true })
      }else {
        this.setState({ isAsync: false })
      }
    }
    onOk(e) {
      e.map(v => {
        if(!v.discount) {
          v.discount = 1
        }
        if(!v.discountType) {
          v.discountType = 1
        }
        return v
      })
      switch (this.state.type) {
        case 1:
          this.setState({
            projectSelect: e,
          },()=>{
            this.onJudge()
          })
          break
        case 2:
          this.setState({
            productSelect: e,
          },()=>{
            this.onJudge()
          })
          break
        case 3:
          this.setState({
            projectItem: e,
          },()=>{
            this.onJudge()
          })
          break
        case 4:
          this.setState({
            productItem: e,
          },()=>{
            this.onJudge()
          })
          break
        default:
          break
      }
    }

    back = () => {
      const { hidAdd, dispatch } = this.props
      hidAdd()
      dispatch({
        type: 'app/setBreads',
      })
    }

    onRef = (ref) => {
      this.projectRef = ref
    }

    onRefProduct = (ref) => {
      this.productRef = ref
    }

    saleDisable(){
      const {setFieldsValue} = this.props.form
      setFieldsValue({salesPercent: 0})
      setFieldsValue({salesMoney: 0})
    }

    giveInfoChange = (selected) => {
      const isEdit = this.props.type
      if(isEdit === 'edit') {
        const { giveInfo, deleteArr } = this.state
        giveInfo.forEach(v => {
          if(v.speciesInfoId) {
            let idx = selected.findIndex(_ => _.speciesInfoId === v.speciesInfoId)
            idx === -1 && deleteArr.push(v.speciesInfoId)
            console.log('deleteArr', deleteArr)
            this.setState({deleteArr})
          }
        })
      }
      this.setState({giveInfo: selected})
    }

    componentDidMount (){
      const { id, type } = this.props
      if(type === 'edit') {
        services.cardsDetail({data:{speciesId: id}}).then(res => {
          const { list } = res
          this.setState({
            initProList: list,
          })
          if(Number(list.neverValid) === 1) {
            this.setState({
              disable: true,
            })
          }
          // 赠送信息
          if(list.giveInfo.length > 0) {
            let total = {
              key: -1,
              pName: "总计",
              discount: "",
              unitPrice: "",
              numTem: 0,
              balidityPeriod: 0,
            }
            let giveInfo = list.giveInfo.map((item,i) => {
              total.numTem = total.numTem + Number(item.numTem)
              total.balidityPeriod =
                total.balidityPeriod + Number(item.money * item.numTem)
              return {
                ...item,
                key: i+1,
                pId: item.goodId,
                discount: 10,
                productId: item.speciesType === 6 ?  item.goodId : '',
                projectId: item.speciesType === 5 ?  item.goodId : '',
                pName: item.name,
                type: item.speciesType === 5 ? 1 : 2,
                typeTem: item.speciesType === 5 ? 1 : 2,
                unitPrice: item.money,
                balidityPeriod: item.money * item.numTem,
                deadlineTime: moment(item.deadlineTime * 1000),
                deadlineStatus: item.deadlineTime*1 === -1 ? 0 : 1,
                deadlineMonth: item.deadlineMonth,
              }
            })
            total.balidityPeriod = total.balidityPeriod.toFixed(2)
            giveInfo = [...giveInfo, total]
            this.setState({giveInfo}, () => {
              this.setState({canLoad: true})
            })
          }else {
            this.setState({canLoad: true})
          }
          this.setState({
            deadlineUnit:list.deadlineUnit,
            neverValid: list.neverValid,
            state: list.state,
            projectSelect: list.project.map(v => ({...v, categoryName: v.name, categoryId: v.goodId})),
            productSelect: list.product.map(v => ({...v, categoryName: v.name, categoryId: v.goodId})),
            projectItem: list.specialProject.map(v => ({...v, projectName: v.name, projectId: v.goodId})),
            productItem: list.specialProduct.map(v => ({...v, productName: v.name, productId: v.goodId})),
          })

          if(list.project.length > 0 || list.product.length > 0 || list.specialProject.length > 0 || list.specialProduct.length > 0 || list.giveInfo.length > 0) {
            this.setState({
              open: true,
            })
          }
          this.setState({

          })
        })
      }else {
        this.setState({canLoad: true})
      }
    }
    salesChange = (property, val) => {
      const { getFieldError, getFieldValue, setFieldsValue } = this.props.form
      const rechargeMoney = getFieldError('rechargeMoney') ? 0 : (Number(getFieldValue('rechargeMoney') || 0))
      const salesPercent = getFieldError('salesPercent') ? 0 : (Number(getFieldValue('salesPercent') || 0) / 100)
      const salesMoney = getFieldError('salesMoney') ? 0 : (Number(getFieldValue('salesMoney') || 0))
      const salesType = getFieldValue('salesType')
      if(salesType === 2){
        switch (property) {
          case 'rechargeMoney':
            if(salesPercent){
              const money = (Number(val) || 0) * salesPercent
              setFieldsValue({salesMoney: money.toFixed(1)})
            }else if(salesMoney){
              const percent = salesMoney / (Number(val) || 0) /100
              setFieldsValue({salesPercent: percent.toFixed(1)})
            }
            break
          case 'salesPercent':
            const money = rechargeMoney * ((Number(val) || 0) / 100)
            setFieldsValue({salesMoney: money.toFixed(1)})
            break
          case 'salesMoney':
            const percent = (Number(val) || 0) / rechargeMoney * 100
            setFieldsValue({salesPercent: percent.toFixed(1)})
            break
          default:
            console.log(property)
        }
      }
    }
    //控制弹窗
    showMast=()=>{
      const { mastShow } = this.state
      this.setState({
        mastShow:!mastShow,
      })
    }
    onChange=(e)=> {
      this.setState({
        isChecked: e.target.checked,
      })
    }

    render() {
      const { getFieldDecorator, getFieldValue, getFieldError } = this.props.form
      const { type='add',editItem} = this.props
      const content=(<div>
        <p>例如，充值900元，赠送100元，总金额为1000元。</p>
        <p>所以，该卡每使用1元，产生0.9的消耗。</p>
        </div>)
      let projectProps = {
        type: __PROJECT_TYPE__,
        visible: this.state.showClassify,
        hideModal: this.hideModal.bind(this),
        onOk: this.onOk.bind(this),
        defaultItem: this.state.projectSelect,
        deleteHandle: this.deleteHandle,
      }

      let productProps = {
        type: __PRODUCT_TYPE__,
        visible: this.state.showClassify,
        hideModal: this.hideModal.bind(this),
        onOk: this.onOk.bind(this),
        defaultItem: this.state.productSelect,
        deleteHandle: this.deleteHandle,
      }

      let ItemPjProps = {
        type: __PROJECT_TYPE__,
        visible: this.state.showItemPj,
        hideModal: this.hideModal.bind(this),
        onOk: this.onOk.bind(this),
        defaultItem: this.state.projectItem.map(v => ({...v, type: __PROJECT_TYPE__})),
        deleteHandle: this.deleteHandle,
        propty: 3,
      }

      let ItemPdProps = {
        type: __PRODUCT_TYPE__,
        visible: this.state.showItemPd,
        hideModal: this.hideModal.bind(this),
        onOk: this.onOk.bind(this),
        defaultItem: this.state.productItem.map(v => ({...v, type: __PRODUCT_TYPE__})),
        deleteHandle: this.deleteHandle,
        propty: 4,
      }
      return (
        <div className='a_pad'>
          <div>
            <FormTitle name="基本信息"></FormTitle>
            <Form layout="vertical">
              <Row type="flex" justify="space-between">
                <Col span={6}>
                  <FormItem
                    label="卡名称"
                  >
                    {getFieldDecorator('cardName',validate('卡名称',{
                      required: true,
                      max: 30,
                      type: 'string',
                      sole: true,
                      model: 'CardSpecies',
                      id: editItem.speciesId,
                    }))(
                      <Input placeholder="请输入卡名称" size="large"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={6} style={{position: 'relative'}}>
                  <FormItem
                    label="充值金额"
                  >
                    {getFieldDecorator('rechargeMoney', validate('充值金额', {required: 'true'}))(
                      <InputNumber style={{width: '100%'}} min={0}  precision={2}   placeholder="请输入充值金额" size="large" onChange={(val) => this.salesChange('rechargeMoney', val)}/>
                    )}
                  </FormItem>
                  <span className={styles.yuan}>元</span>
                </Col>
                <Col span={6} >
                  <div style={{ display: 'flex'}}>
                    <FormItem
                      label="销售提成"
                      style={{flex: '1',marginBottom: 0}}
                    >
                      {getFieldDecorator('salesType',{...validate('销售提成',{required: true}), initialValue: 4})(
                        <Select  size="large" onChange={this.saleDisable.bind(this)}>
                          <Option value={1} >实收比例</Option>
                          <Option value={2} >原价比例</Option>
                          <Option value={4} >固定金额</Option>
                          <Option value={3} >不提成</Option>
                        </Select>
                      )}
                    </FormItem>
                    {getFieldValue('salesType') === 4 ? <FormItem style={{flex: '1', marginTop: 27, marginBottom: 0}}
                    >
                      {getFieldDecorator('salesMoney',{...validate('固定金额',{required: true, type: "money"}), initialValue: '0.0'})(
                        <InputNumber size="large"
                          min={0}
                          precision={1}
                          style={{ width: '100%'}}
                          onChange={(val) => this.salesChange('salesMoney', val)}
                        />
                      )}
                    </FormItem> : ''}
                    {getFieldValue('salesType') === 4 ? '' : <FormItem style={{flex: '1', marginTop: 27, marginBottom: 0}}
                    >
                      {getFieldDecorator('salesPercent',{...validate('销售提成',{required: getFieldValue('salesType') !== 3, type: "price1"}), initialValue: 0})(
                        <InputNumber size="large"
                          min={0}
                          max={100}
                          precision={2}
                          style={{ width: '100%'}}
                          disabled={getFieldValue('salesType') === 3}
                          onChange={(val) => this.salesChange('salesPercent', val)}
                        />
                      )}
                    </FormItem>}
                    {getFieldValue('salesType') === 4 ? '' :<span className={styles.yuan}>%</span>}
                    {getFieldValue('salesType') === 4 ? <span className={styles.yuan}>元</span> : ''}
                  </div>
                  {
                    getFieldValue('salesType') === 2 && (
                      <div style={{display: 'flex', justifyContent: 'flex-end', alignItem: 'center'}}>
                        <span style={{lineHeight: '38px',marginRight: 15}}>即提成</span>
                        <FormItem style={{margin: 0, padding: 0}}
                        >
                          {getFieldDecorator('salesMoney',{
                            ...validate('销售提成',{
                              required: getFieldValue('salesType') === 2,
                              type: "price1" ,
                              len: getFieldError('rechargeMoney') ? 0 : (Number(getFieldValue('rechargeMoney') || 0)).toFixed(1),
                            }),
                            initialValue: 0})(
                            <Input size="large" style={{ width: 175}} addonAfter='元' onChange={(e) => this.salesChange('salesMoney', e.target.value)}/>
                          )}
                        </FormItem>
                      </div>
                    )
                  }
                </Col>
              </Row>
              <Row type="flex" justify="space-between">
                <Col span={6} style={{ display: 'flex'}}>
                  <FormItem
                    label="有效期"
                  >
                    {getFieldDecorator('neverValid',validate('期限',{required: true}))(
                      <Select style={{ width: 100}} placeholder="请选择" size="large" onChange={this.isDisable.bind(this)}>
                        <Option value={0} >有效期</Option>
                        <Option value={1} >无限期</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem style={{flex: '1', marginTop: 27}}
                  >
                    {getFieldDecorator('deadlineNum',validate('期限', { required: true}))(
                      <InputNumber size="large"
                        min={1}
                        max={this.state.deadlineUnit === 1 ? 20 : 99999999}
                        style={{ width: '100%'}}
                        disabled={this.state.disable}
                      />
                    )}
                  </FormItem>
                  <Select style={{ width: 74, marginTop: 27}}
                          className='selected-dark'
                          size="large"
                          placeholder="请选择"
                          disabled={this.state.disable}
                          value={this.state.deadlineUnit}
                          onChange={this.setDeadlineUnit.bind(this)}>
                    <Option value={1}>年</Option>
                    <Option value={2}>月</Option>
                    <Option value={3}>日</Option>
                  </Select>
                </Col>
                <Col span={6} style={{position:'relative'}}>
                  <FormItem
                    label="卡阶段"
                  >
                    <span onClick={this.showMast} style={{position:'absolute',top:'-38px',left:'60px',fontSize:'7px',fontFamily:'MicrosoftYaHei',fontWeight:400,color:'#4AACF7',cursor:'pointer'}}>什么是卡类型?</span>
                    {getFieldDecorator('stage', validate('卡阶段', {required: 'true'}))(
                      <Select
                        size="large"
                        placeholder="请选择类型"
                        // value={this.state.deadlineUnit}
                        //  onChange={this.setDeadlineUnit.bind(this)}
                      >
                        <Option value={1}>吸客</Option>
                        <Option value={2}>养客</Option>
                        <Option value={3}>黏客</Option>
                        <Option value={4}>升客</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem
                    label="赠送金额"
                    style={{marginBottom:'0'}}
                  >
                    {getFieldDecorator('giveMoney')(
                      <InputNumber style={{width: '100%'}}  placeholder="请输入赠送金额"  min={0} size="large"/>
                    )}
                  </FormItem>
                  <span>注：使用赠送金额支付不产生消耗 <Popover content={content} trigger="click"><Icon style={{color:'#4aacf7'}} type="question-circle" /></Popover></span>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col span={6}>
                  <FormItem
                    label="备注"
                  >
                    {getFieldDecorator('remark')(
                      <TextArea  placeholder="备注" maxLength="200" rows={4}></TextArea>
                    )}
                  </FormItem>
                </Col>
                <Col span={6} style={{ marginLeft:'12.5%' }}  >
                  <FormItem
                    label="卡状态"
                  >
                    <RadioGroup onChange={this.radio.bind(this)} value={this.state.state}>
                      <Radio value={1}>启用</Radio>
                      <Radio value={0}>停用</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <div>
            {
              this.state.open &&
              <div style={{marginBottom: 30}} className='animated fadeIn'>
                <FormTitle name="折扣信息"></FormTitle>
                <div className={styles.listContent}>
                  <Cards
                    data={this.state}
                    deleteItem={this.deleteItem.bind(this)}
                    showDc={this.showDc.bind(this)}
                    setSingle={this.setSingle.bind(this)}
                    Show={this.Show.bind(this)}
                  ></Cards>
                  {
                    this.state.showClassify &&
                    <CategoryTk
                      {... this.state.type === 1 ? projectProps : productProps}
                    ></CategoryTk>
                  }
                  {
                    this.state.showItemPj &&
                    <SelectedTk
                    {...ItemPjProps}
                    ></SelectedTk>
                  }
                  {
                    this.state.showItemPd &&
                    <SelectedTk
                    {...ItemPdProps}
                    ></SelectedTk>
                  }
                  
                </div>
                <FormTitle name="赠送信息"></FormTitle>
                {
                  this.state.canLoad &&
                  <SelectGiveItems
                    newTpye={true}
                    onChange={(selected) => this.giveInfoChange(selected)}
                    giveItems={this.state.giveInfo}
                  />
                }
              </div>
            }
          </div>
          {
            !this.state.open ?
              <span className={styles.open} onClick={this.changeOpen.bind(this)}>更多设置<i className="iconfont icon-zhankai"></i></span>
              : <span className={styles.open} onClick={this.changeOpen.bind(this)}>更多设置<i className="iconfont icon-shouqi"></i></span>
          }
          <Tabbar>
            <div className={styles.tabbar}>
              <Button size="large" type="primary" onClick={this.publish.bind(this)}>{type === 'add' ? '发布' : '修改'}</Button>
              <Button size="large" onClick={this.back}>取消</Button>
              {type !== 'add' && this.state.isAsync && <div className={styles.az_check_box}><Checkbox onChange={this.onChange}>同步折扣信息到已售出的卡中</Checkbox></div>}
            </div>
          </Tabbar>
          {  this.state.mastShow && <Mast  handerMastHidden={this.showMast}  />  }
        </div>
      )
    }
  }
)
function mapStateToProps(state) {
  const { editItem } = state.cards
  return { editItem }
}
export default connect(mapStateToProps)(Add)
