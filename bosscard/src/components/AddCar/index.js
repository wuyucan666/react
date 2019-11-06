/**
 * Created by kikazheng on 2019/4/9
 */
import React, { Component } from 'react'
import { Modal, Form, Input, Tabs, Select, Row, Col, DatePicker, InputNumber, Upload, message, Icon, Spin, Button } from 'antd'
import moment from 'moment'
import debounce from 'lodash/debounce'
import validate from '../../utils/validate'
import services from '../../services'
import style from './style.less'
import uploadImg from "../../utils/uploadImg"
import Brand from './components/Brand'
import PullDown from '../../components/PullDown'
import collectData from 'utils/collectData'

const TabPane = Tabs.TabPane
const Option = Select.Option
const { TextArea } = Input

class AddCar extends Component {
  constructor(props) {
    super(props)
    this.searchBrand = debounce(this.searchBrand, 500)
    this.scollBytop = null
  }

  state = {
    activeKey: '1',
    fetching: false,
    loading: false,
    brand: [],
    client: [],
    carPriceIntervalList: [],
    showBrand: false,
    previewVisible: false, //查看图片
    previewImage: '',//图片路径
    plateProvince: ['皖', '京', '渝', '闽', '甘', '粤', '桂', '贵', '琼', '冀', '豫', '黑', '鄂', '湘', '吉', '苏', '赣', '辽', '蒙', '宁', '青', '鲁', '晋', '陕', '沪', '川', '津', '藏', '新', '云', '浙', '军', '使', 'W'],
    plateLetter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if ((nextProps.visible !== this.props.visible) && nextProps.editItem && nextProps.editItem.clientCarId) {
      const { carBrandId, carBrandName, seriesName, carIcon, seriesId } = nextProps.editItem
      this.setState({
        brand: [{
          brand_id: carBrandId,
          brand_name: carBrandName,
          brand_icon: [{ id: carIcon }],
          series_name: seriesName,
          series_id: seriesId,
        }],
        // client: [{ clientId, clientName, phoneTem }],
      })
    }
  }
  componentDidMount() {
    services.LIST({ keys: { name: 'erp/carpricerange/selector' } }).then(res => {
      if (res.success) {
        this.setState({ carPriceIntervalList: res.list })
      }
    })
  }

  // 品牌搜索
  searchBrand = (keyword) => {
    this.setState({ fetching: true })
    services.LIST({ keys: { name: 'common/carSeries' }, data: { keyword } }).then(res => {
      this.setState({ fetching: false })
      if (res.success) {
        this.setState({ brand: res.list })
      }
    }).catch(() => {
      this.setState({ fetching: false })
    })
  }

  // 品牌切换
  searchChange = (seriesId) => {
    const { setFieldsValue } = this.props.form
    const { brand } = this.state
    const index = brand.findIndex(item => item.series_id === seriesId)
    const data = brand[index]
    setFieldsValue({
      carBrandId: data.brand_id,
      carBrandName: data.brand_name,
      seriesName: data.series_name,
      carIcon: data.brand_icon[0].id,
      carIconUrl: data.brand_icon[0].requestAddress,
    })
  }

  // 车主搜索
  searchClient = (val) => {
    const PHONE = /^[1]([3-9])[0-9]{9}$/
    const {setFieldsValue } = this.props.form
    this.setState({client: []})
    setFieldsValue({name: undefined})
    if(val && PHONE.test(val)){
      services.LIST({ keys: { name: 'store/client/list' }, data: { q: { page: -1, limit: -1, where: { 'phoneTem[~]': val } } } }).then(res => {
        if (res.success) {
          this.setState({ client: res.list })
          if(res.list.length){
            setFieldsValue({name: res.list[0].clientName})
          }
        }
      })
    }
  }

  tabChange = (activeKey) => {
    this.setState({ activeKey })
  }

  //隐藏图片modal
  handleCancel = () => {
    this.setState({ previewVisible: false })
  }

  //查看图片
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  // 图片value转换
  normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  // 获取图片id
  getImgId = (property) => {
    return (id) => {
      const fileList = this.props.form.getFieldValue(property)
      for (let i = 0; i < fileList.length; i++) {
        if (!fileList[i].imgId) {
          fileList[i].imgId = id
          this.props.form.setFieldsValue({ [property]: fileList })
          break
        }
      }
    }
  }

  // 图片选择
  handleChange = (property, num) => {
    return ({ fileList, file }) => {
      const imgType = ['image/jpeg', 'image/jpg', 'image/png']
      if (imgType.indexOf(file.type) === -1) {
        fileList.splice(fileList.findIndex(item => item.uid === file.uid))
        return false
      }
      if (fileList.length > num) {
        message.info(`最多上传${num}张`)
        fileList.splice(num)
      }
    }
  }

  // 提交
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true })
        const data = {
          ...values,
          plateNumber: values.plateNumber.toUpperCase(),
          firshShop: values.firshShop && moment(values.firshShop).format('YYYY-MM-DD'),
          nextMaintainTime: values.nextMaintainTime && moment(values.nextMaintainTime).format('YYYY-MM-DD'),
          shopCarTime: values.shopCarTime && moment(values.shopCarTime).format('YYYY-MM-DD'),
          bizSafeStopTime: values.bizSafeStopTime && moment(values.bizSafeStopTime).format('YYYY-MM-DD'),
          trafficSafeStopTime: values.trafficSafeStopTime && moment(values.trafficSafeStopTime).format('YYYY-MM-DD'),
          carSafeStopTime: values.carSafeStopTime && moment(values.carSafeStopTime).format('YYYY-MM-DD'),
          licenseImg: values.licenseImg && (values.licenseImg.constructor === Array ? values.licenseImg.map(item => item.imgId) : values.licenseImg),
          imgSrc: values.imgSrc && (values.imgSrc.constructor === Array ? values.imgSrc.map(item => item.imgId) : values.imgSrc),
        }
        for (let i in data) {
          if (!data[i]) {
            delete data[i]
          }
        }
        const { type, onOk, editItem, noGetData, memberClientPhone } = this.props
        if (noGetData) {
          // 甘明凤 会员导入
          this.setState({ loading: false, client: [] })
          onOk({ ...data })
          return false
        }
        if (memberClientPhone) {
          // 甘明凤 20190601 赠送和办卡新建车辆
          data.phone = memberClientPhone
        }
        if (type === 'add') {
          services.INSERT({ keys: { name: 'store/car' }, data: { ...data } }).then(res => {
            this.setState({ loading: false })
            if (res.success) {
              message.success('新建成功')
              onOk({ ...data, clientCarId: res.data.id })
              this.setState({ activeKey: '1',client: [] })
            }
          }).catch(() => {
            this.setState({ loading: false })
          })
        } else {
          services.UPDATE({ keys: { name: 'store/car', id: editItem.clientCarId }, data: { ...data } }).then(res => {
            this.setState({ loading: false })
            if (res.success) {
              message.success('修改成功')
              onOk({ ...data, clientCarId: res.data.id })
              this.setState({ activeKey: '1',client: [] })
            }
          }).catch(() => {
            this.setState({ loading: false })
          })
        }
      } else {
        console.log(err)
        if (err.frameNumber || err.engineNo) {
          this.setState({ activeKey: '2' })
        } else {
          this.setState({ activeKey: '1' })
        }
      }
    })
  }

  // modal取消
  onCancel = () => {
    this.props.form.resetFields()
    this.props.onCancel()
    this.setState({ activeKey: '1',client: [] })
  }

  // 品牌modal
  showBrand = () => {
    this.setState({
      showBrand: true,
    })
  }

  hideBrand = () => {
    this.setState({
      showBrand: false,
    })
  }

  brandOk = (data) => {
    const {setFieldsValue} = this.props.form
    this.setState({
      brand: [{
        series_id: data.seriesId,
        series_name: data.seriesName,
        brand_name: data.carBrandName,
        brand_id: data.carBrandId,
        brand_icon:[{id: data.carIcon, requestAddress: data.carIconUrl}],
      }],
      showBrand: false,
    },() => {
      setFieldsValue({
        ...data,
      })
    })
  }
  controlFocus=(index)=>{
    if(this.scollBytop){
      this.scollBytop.scrollTop=80*index
    }
  }

  // 数据统计
  collectData = () => {
    if ((window.location.pathname === '/boss-store/speedy-billing') || ( window.location.pathname === '/boss-store/maintain-billing')) {
      collectData('order')
    }
  }
  render() {
    const { activeKey, plateLetter, plateProvince, brand, carPriceIntervalList, previewImage, previewVisible, fetching, loading, client, showBrand } = this.state
    const { getFieldDecorator, getFieldValue, getFieldError } = this.props.form
    const { editItem = {}, visible, type, hideClient = false } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 19 },
      },
    }
    const prefixSelector = (
      <Row style={{ width: 115 }}>
        <Col span={12}>
          {
            getFieldDecorator('plateProvince', {
              ...validate('车牌', {
                sole: getFieldValue('plateNumber') ? (!getFieldError('plateNumber')) : false,
                key: 'licenseNo',
                value: (val) => (val + getFieldValue('plateLetter') + '·' + getFieldValue('plateNumber')),
                model: 'ClientCar',
                id: editItem.clientCarId,
              }),
              initialValue: editItem.plateProvince || '粤',
            })(
              <PullDown
                data={plateProvince.map(item => ({id: item, name: item}))}
                tdWidth={'66px'}
                customProp={{
                  dropdownMatchSelectWidth: false,
                  dropdownStyle:{width: 350},
                }}
              />
            )
          }
        </Col>
        <Col span={12}>
          {
            getFieldDecorator('plateLetter', {
              ...validate('车牌', {
                sole: getFieldValue('plateNumber') ? (!getFieldError('plateNumber')) : false,
                key: 'licenseNo',
                value: (val) => (getFieldValue('plateProvince') + val + '·' + getFieldValue('plateNumber')),
                model: 'ClientCar',
                id: editItem.clientCarId,
              }),
              initialValue: editItem.plateLetter || 'A',
            })(
              <PullDown
                data={plateLetter.map(item => ({id: item, name: item}))}
                tdWidth={'66px'}
                customProp={{
                  dropdownMatchSelectWidth: false,
                  dropdownStyle:{width: 350},
                }}
              />
            )
          }
        </Col>
      </Row>
    )
    const uploadButton = (
      <div>
        <Icon type="plus" />
      </div>
    )
    getFieldDecorator('carBrandId', { initialValue: editItem.carBrandId })
    getFieldDecorator('carBrandName', { initialValue: editItem.carBrandName })
    getFieldDecorator('seriesName', { initialValue: editItem.seriesName })
    getFieldDecorator('carIcon', { initialValue: editItem.carIcon })
    getFieldDecorator('carIconUrl', { initialValue: '' })
    getFieldDecorator('clientId', { initialValue: editItem.clientId })
    return (
      <Modal
        wrapClassName='car-modal'
        maskClosable={false}
        title={type === 'add' ? '新建车辆' : '编辑车辆'}
        visible={visible}
        width={570}
        destroyOnClose
        confirmLoading={loading}
        onOk={this.handleSubmit}
        onCancel={this.onCancel}
      >
        <Form colon={false}>
          <Tabs activeKey={activeKey} onChange={this.tabChange}>
            <TabPane tab="基本信息" key="1">
              <div className={style.carBox}>
                <Form.Item {...formItemLayout} label='车牌号码' className='plate'>
                  {getFieldDecorator('plateNumber', {
                    ...validate('车牌号码', {
                      required: true,
                      type: 'plate',
                      sole: true,
                      key: 'licenseNo',
                      value: (val) => (getFieldValue('plateProvince') + getFieldValue('plateLetter') + '·' + val),
                      model: 'ClientCar',
                      id: editItem.clientCarId,
                    }),
                    initialValue: editItem.plateNumber,
                  })(
                    <Input size='large' addonBefore={prefixSelector} onBlur={this.collectData} />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='品牌车型'>
                  {getFieldDecorator('seriesId', {
                    initialValue: editItem.seriesId,
                    rules: [{ required: true, message: '请选择品牌车型' }],
                  })(
                    <Select
                      style={{width: 224, marginRight: 10}}
                      showArrow={false}
                      showSearch
                      size='large'
                      placeholder='搜索车型，例：奥迪-A4'
                      filterOption={false}
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      onSearch={this.searchBrand}
                      onChange={this.searchChange}
                      onBlur={this.collectData}
                    >
                      {
                        brand.map((item) =>{
                          if(item.series_id){
                            return  (
                              <Option value={item.series_id} key={item.series_id}>
                                <span style={{ color: '#4AACF7' }}>{item.brand_name}</span>
                                <span> - </span>
                                <span>{item.series_name}</span>
                              </Option>
                            )
                          }else {
                            return (
                              (
                                <Option value={item.series_id} key={item.series_id}>
                                  未知品牌
                                </Option>
                              )
                            )
                          }
                        })
                      }
                    </Select>
                  )}
                  <Button type='primary' size='large' onClick={this.showBrand}>按品牌找车型</Button>
                </Form.Item>
                <Form.Item {...formItemLayout} label="车辆进店时间">
                  {getFieldDecorator(`firshShop`, {
                    initialValue: editItem.firshShop || moment(),
                    rules: [{ required: true, message: '请选择车辆进店时间' }],
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      size="large"
                      onBlur={this.collectData}
                      // getCalendarContainer={trigger => trigger.parentNode}
                      disabledDate={(current) => {
                        return current && current > moment().endOf('day')
                      }}
                    />
                  )}
                </Form.Item>
                {
                  !hideClient&&(
                    <Form.Item {...formItemLayout} label="联系电话" extra={!!client.length && <span style={{color: '#FF6F28'}}>该车主已存在，系统会将车辆绑定到该车主</span>}>
                      {getFieldDecorator(`phone`, {
                        ...validate('联系电话',{type: 'phone'}),
                        initialValue: editItem.phoneTem ? editItem.phoneTem : undefined,
                      })(
                        <Input
                          style={{ width: '100%' }}
                          size="large"
                          placeholder='输入联系电话'
                          disabled={!!editItem.phoneTem}
                          onChange={(e) => this.searchClient(e.target.value)}
                        />

                      )}
                    </Form.Item>
                  )
                }
                {
                  !hideClient&&(
                    <Form.Item {...formItemLayout} label="车主姓名">
                      {getFieldDecorator(`name`, {
                        initialValue: editItem.clientName ?editItem.clientName: undefined,
                      })(
                        <Input
                          style={{ width: '100%' }}
                          size="large"
                          placeholder='输入车主姓名'
                          disabled={!!editItem.clientName}
                        />
                      )}
                    </Form.Item>
                  )
                }
              </div>
            </TabPane>
            <TabPane tab="常规信息" key="2">
              <div className={style.carBox} ref={(scollBytop)=>this.scollBytop = scollBytop  }  >
                <Form.Item {...formItemLayout} label="车架号">
                  {getFieldDecorator(`frameNumber`, {
                    ...validate('车架号', {
                      max: 17,
                      type: 'string',
                      sole: true,
                      model: 'ClientCar',
                      id: editItem.clientCarId,
                    }),
                    initialValue: editItem.frameNumber,
                    rules: [
                      ...validate('车架号', {
                        max: 17,
                        type: 'string',
                        sole: true,
                        model: 'ClientCar',
                        id: editItem.clientCarId,
                      }).rules,
                      { pattern: '^[\\w\\s]+$', message: '请输入正确的车架号' },
                      { len: 17, message: '请输入17位正确的车架号' },
                    ],
                  })(
                    <Input placeholder="请输入车架号" size="large" onFocus={this.controlFocus.bind(this,0)} />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="发动机号">
                  {getFieldDecorator(`engineNo`, {
                    initialValue: editItem.engineNo,
                    rules: [
                      { pattern: '^[\\w\\s]+$', message: '请输入正确的发动机号' },
                      { min: 6, message: '请输入6-15位的发动机号' },
                      { max: 15, message: '请输入6-15位的发动机号' },
                    ],
                  })(
                    <Input placeholder="请输入发动机号" size="large" onFocus={this.controlFocus.bind(this,1)} />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="发动机型号">
                  {getFieldDecorator(`engineModel`, {
                    initialValue: editItem.engineModel,
                    rules: [{ pattern: '^[\\w\\s]+$', message: '请输入正确的发动机型号' }],
                  })(
                    <Input placeholder="请输入发动机型号" size="large"  onFocus={this.controlFocus.bind(this,2)} />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="排量">
                  {getFieldDecorator(`displacement`, {
                    initialValue: editItem.displacement,
                  })(
                    <Input placeholder="请输入排量" size="large"   onFocus={this.controlFocus.bind(this,3)}  />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="厂牌型号">
                  {getFieldDecorator(`brandModel`, {
                    initialValue: editItem.brandModel,
                  })(
                    <Input placeholder="请输入厂牌型号" size="large"  onFocus={this.controlFocus.bind(this,4)} />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="购车时间">
                  {getFieldDecorator(`shopCarTime`, {
                    initialValue: editItem.shopCarTime,
                  })(
                    <DatePicker style={{ width: '100%' }} size="large" getCalendarContainer={trigger => trigger.parentNode}  onFocus={this.controlFocus.bind(this,5)} />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="车价区间（万）">
                  {getFieldDecorator(`carPriceInterval`, {
                    initialValue: (editItem.carPriceInterval) || undefined,
                  })(
                    <Select placeholder="请选择车价区间" size='large' style={{ width: '100%' }} getPopupContainer={triggerNode => triggerNode.parentNode} onFocus={this.controlFocus.bind(this,6)} >
                      {
                        carPriceIntervalList.map((item) => (
                          <Option key={item.id} value={item.id}>{item.range}</Option>
                        ))
                      }
                    </Select>
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="车价（万）">
                  {getFieldDecorator(`carPrice`, {
                    initialValue: editItem.carPrice,
                  })(
                    <InputNumber placeholder="请输入车价" size="large" style={{ width: '100%' }} precision={1} min={0} onFocus={this.controlFocus.bind(this,7)} />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="颜色">
                  {getFieldDecorator(`carColour`, {
                    initialValue: editItem.carColour,
                  })(
                    <Input placeholder="请输入颜色" size="large" onFocus={this.controlFocus.bind(this,8)} />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="备注">
                  {getFieldDecorator(`remark`, {
                    initialValue: editItem.remark,
                  })(
                    <TextArea placeholder="请输入备注" maxLength="200" rows={4} onFocus={this.controlFocus.bind(this,9)} />
                  )}
                </Form.Item>
                <Form.Item  {...formItemLayout} label="上传其它图片">
                  {getFieldDecorator('imgSrc', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                    initialValue: editItem.imgSrc && (editItem.imgSrc.constructor === Array ? editItem.imgSrc : []),
                  })(
                    <Upload
                      className='client-upload'
                      multiple
                      listType="picture-card"
                      onChange={this.handleChange('imgSrc', 10)}
                      onPreview={this.handlePreview}
                      beforeUpload={(file) => uploadImg(file, 'car', this.getImgId('imgSrc'))}
                    >
                      {this.props.form.getFieldValue('imgSrc') && this.props.form.getFieldValue('imgSrc').length === 10 ? null : uploadButton}
                    </Upload>
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="上传行驶证">
                  {getFieldDecorator(`licenseImg`, {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                    initialValue: editItem.licenseImg && (editItem.licenseImg.constructor === Array ? editItem.licenseImg : []),
                  })(
                    <Upload
                      className='client-upload'
                      multiple
                      listType="picture-card"
                      onChange={this.handleChange(`licenseImg`, 2)}
                      onPreview={this.handlePreview}
                      beforeUpload={(file) => uploadImg(file, 'car', this.getImgId(`licenseImg`))}
                    >
                      {this.props.form.getFieldValue(`licenseImg`) && this.props.form.getFieldValue(`licenseImg`).length === 2 ? null : uploadButton}
                    </Upload>
                  )}
                </Form.Item>
              </div>
            </TabPane>
            <TabPane tab="里程信息" key="3">
              <div className={style.carBox}>
                <Form.Item {...formItemLayout} label="首次入场公里数">
                  {getFieldDecorator(`firshShopMileage`, {
                    initialValue: editItem.firshShopMileage,
                    ...validate('首次入场里程', { type: 'number' }),
                  })(
                    <Input placeholder="请输入首次入场公里数" addonAfter="Km" size="large" />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="最近保养公里数">
                  {getFieldDecorator(`lastMaintainMileage`, {
                    initialValue: editItem.lastMaintainMileage,
                    ...validate('最近保养公里数', { type: 'number' }),
                  })(
                    <Input placeholder="请输入最近保养公里数" addonAfter="Km" size="large" />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="下次保养公里数">
                  {getFieldDecorator(`nextMaintainMileage`, {
                    initialValue: editItem.nextMaintainMileage,
                    ...validate('下次保养公里数', { type: 'number' }),
                  })(
                    <Input placeholder="请输入下次保养公里数" addonAfter="Km" size="large" />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="下次保养时间">
                  {getFieldDecorator(`nextMaintainTime`, {
                    initialValue: editItem.nextMaintainTime,
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      size="large"
                      // getCalendarContainer={trigger => trigger.parentNode}
                      disabledDate={(current) => {
                        return current && current < moment().endOf('day')
                      }}
                    />
                  )}
                </Form.Item>
              </div>
            </TabPane>
            <TabPane tab="保险信息" key="4">
              <div className={style.carBox}>
                <Form.Item {...formItemLayout} label="车检(年审)到期">
                  {getFieldDecorator(`carSafeStopTime`, {
                    initialValue: editItem.carSafeStopTime,
                  })(
                    <DatePicker style={{ width: '100%' }} size="large" getCalendarContainer={trigger => trigger.parentNode} />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="商业险到期">
                  {getFieldDecorator(`bizSafeStopTime`, {
                    initialValue: editItem.bizSafeStopTime,
                  })(
                    <DatePicker style={{ width: '100%' }} size="large" />
                  )}
                </Form.Item>
                <Form.Item  {...formItemLayout} label="商业险承保公司">
                  {getFieldDecorator(`carSafeCom`, {
                    initialValue: editItem.carSafeCom,
                  })(
                    <Input placeholder="请输入商业险-承保公司" size="large" />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="交强险到期日">
                  {getFieldDecorator(`trafficSafeStopTime`, {
                    initialValue: editItem.trafficSafeStopTime,
                  })(
                    <DatePicker style={{ width: '100%' }} size="large" />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="交强险承保公司">
                  {getFieldDecorator(`trafficSafeCom`, {
                    initialValue: editItem.trafficSafeCom,
                  })(
                    <Input placeholder="请输入交强险承保公司" size="large" />
                  )}
                </Form.Item>
              </div>
            </TabPane>
          </Tabs>
        </Form>
        <Brand
          visable={showBrand}
          onCancel={this.hideBrand}
          onOk={this.brandOk}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Modal>
    )
  }
}

export default Form.create()(AddCar)
