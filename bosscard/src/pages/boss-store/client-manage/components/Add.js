import { Component } from 'react'
import { Button, Form, Input, Upload, Modal, Select, Icon, DatePicker, Row, Col, Radio, message, InputNumber, Spin } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import debounce from 'lodash/debounce'
import validate from '../../../../utils/validate'
import FormTitle from '../../../../components/FormTitle/index'
import Tabbar from '../../../../components/Tabbar/index'
import services from "../../../../services/index"
import uploadImg from '../../../../utils/uploadImg'
import AddCar from '../../../../components/AddCar/index'
import UnbindCar from './UnbindCar'
import Card from './Card'
import styles from '../style.less'

const RadioGroup = Radio.Group
const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input


class Add extends Component {
  constructor(props) {
    super(props)
    this.searchCar = debounce(this.searchCar, 500)
  }
  state = {
    clientCarId: 0,
    showAddCar: false,
    car: [],
    carInfo: [],
    fetching: false,
    showSearch: false,
    loading: false,
    carId: '',
    showBind: false,
    showCard: false, // 关联卡项modal
    cardList: [], // 关联卡项
    selectedRowKeys: [],
    open: false,//客户信息切换收起、展开
    previewVisible: false, //查看图片
    previewImage: '',//图片路径
  }

  // UNSAFE_componentWillReceiveProps(nextProps){
  //   if(nextProps.editItem.clientId !== this.props.editItem.clientId){
  //     const {list} = nextProps.editItem
  //     const carInfo = list.map(item => ({
  //       clientCarId: item.clientCarId,
  //       licenseNo: item.licenseNo,
  //       carBrandName: item.carBrandName,
  //       seriesName: item.seriesName,
  //       carIcon: [{requestAddress: item.icon[0].requestAddress}],
  //     }))
  //     this.setState({carInfo})
  //   }
  // }

  componentDidMount() {
    this.props.dispatch({ type: 'clientManage/getChannelList' })
  }

  //客户信息切换收起、展开
  changeOpen() {
    this.setState({
      open: !this.state.open,
    })
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

  //取消发布
  onCancel = (phoneTem) => {
    this.props.form.resetFields()
    this.props.onCancel(phoneTem)
  }

  //解绑modal
  toggleBind = (clientCarId) => {
    this.setState((prevState) => {
      return {
        clientCarId,
        showBind: !prevState.showBind,
      }
    })
  }

  //解绑ok
  unBind = (callBack) => {
    const { type, onUpdate } = this.props
    const { clientCarId } = this.state
    if (type === 'add') {
      const { carInfo } = this.state
      const index = carInfo.findIndex(item => item.clientCarId === clientCarId)
      carInfo.splice(index, 1)
      this.setState({
        carInfo,
        showBind: false,
      })
      callBack()
    } else {
      services.del({ data: { clientCarId }, keys: { 'name': 'store/clientcar' } }).then(res => {
        callBack()
        if (res.success) {
          message.success('解绑成功')
          onUpdate()
          this.setState({
            showBind: false,
          })
        }
      }).catch(() => {
        callBack()
      })
    }
  }

  //发布
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(
      (err, values) => {
        if (!err) {
          const { type, editItem } = this.props
          const { carInfo } = this.state
          const data = { ...values, clientId: editItem.clientId }
          data.birthday = data.birthday && moment(data.birthday).format('YYYY-MM-DD')
          data.licenseImg = data.licenseImg && data.licenseImg.map(item => item.imgId)
          data.clientImg = data.clientImg && data.clientImg.map(item => item.imgId)
          data.data = (editItem.list ? editItem.list.concat(carInfo) : carInfo).map(item => item.clientCarId)
          if (!data.data.length) {
            message.error('请添加至少一辆车辆')
            return
          }
          this.setState({ loading: true })
          if (type === 'add') {
            services.insert({ data: data, keys: { 'name': 'store/client' } }).then(res => {
              this.setState({ loading: false })
              if (res.success) {
                message.success('添加成功!')
                // this.props.dispatch({
                //   type:'table/getData',
                //   payload:{new:false},
                // })
                this.props.form.resetFields()
                //除非父组件取消方法同时传递参数
                this.onCancel(data.phoneTem)
              } else {
                message.error(res.content)
              }
            }).catch(() => {
              this.setState({ loading: false })
            })
          } else {
            services.update({ data: data, keys: { 'name': 'store/client' } }).then(res => {
              this.setState({ loading: false })
              if (res.success) {
                message.success('修改成功!')
                this.props.dispatch({
                  type:'table/getData',
                  payload:{new:false},
                })
                this.props.form.resetFields()
                this.onCancel()
              } else {
                message.error(res.content)
              }
            }).catch(() => {
              this.setState({ loading: false })
            })
          }
        }
      },
    )
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

  // 关联卡项modal
  showCardModal = (carId) => {
    const { clientId } = this.props.editItem
    services.LIST({ keys: { name: 'store/clientcard/limit' }, data: { carId, clientId } }).then(res => {
      if (res.success) {
        this.setState({
          cardList: [...res.list],
          showCard: true,
          carId,
          selectedRowKeys: res.list.filter(item => item.check).map(item => item.id),
        })
      }
    })
  }

  hideCardModal = () => {
    this.setState({
      showCard: false,
    })
  }

  rowChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    })
  }

  delSelectedRowKeys = (id) => {
    const { selectedRowKeys } = this.state
    const index = selectedRowKeys.findIndex(item => item === id)
    selectedRowKeys.splice(index, 1)
    this.setState({
      selectedRowKeys,
    })
  }


  // 车辆搜索
  searchCar = (val) => {
    this.setState({ fetching: true })
    services.LIST({ keys: { name: 'store/car' }, data: { q: { where: { 'licenseNo[~]': val } } } }).then(res => {
      this.setState({ fetching: false })
      if (res.success) {
        this.setState({ car: res.list })
      }
    }).catch(() => {
      this.setState({ fetching: false })
    })
  }

  // 车辆搜索切换
  searchChange = (id) => {
    const { car, carInfo } = this.state
    const index = carInfo.findIndex(item => item.clientCarId === id)
    const data = car.filter(item => item.id === id)[0]
    if (index === -1) {
      carInfo.push({
        ...data,
        clientCarId: data.id,
      })
    } else {
      message.error('该车辆已绑定')
    }
    this.setState({
      carInfo,
      showSearch: false,
    })
  }

  // 新建车辆
  showAddCar = () => {
    this.setState({ showAddCar: true })
  }

  // 新建车辆ok
  onOk = (car) => {
    const { carInfo } = this.state
    carInfo.push({
      ...car,
      licenseNo: car.plateProvince + car.plateLetter + car.plateNumber,
      carIcon: [{
        requestAddress: car.carIconUrl,
      }],
    })
    console.log('8888888888', carInfo)
    this.setState({
      carInfo,
      showAddCar: false,
    })
  }

  // 新建车辆cancel
  hideAdd = () => {
    this.setState({ showAddCar: false })
  }

  //绑定车辆
  bindCar = () => {
    this.setState({ showSearch: true })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { channelList, editItem, type } = this.props
    const { previewVisible, previewImage, showCard, cardList, selectedRowKeys, car, showAddCar, fetching, carInfo, showSearch, loading, showBind, carId } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
      </div>
    )
    const cars = editItem.list ? editItem.list.map(item => ({
      clientCarId: item.clientCarId,
      licenseNo: item.licenseNo,
      carBrandName: item.carBrandName,
      seriesName: item.seriesName,
      carIcon: [{ requestAddress: item.icon[0].requestAddress }],
    })).concat(carInfo) : carInfo
    return (
      <div className='addClient' >
        <Form layout="vertical" onSubmit={this.handleSubmit} >
          <div className={styles.pad}>
            <FormTitle name="客户信息" />
            <Row type="flex" justify="space-between" gutter={{ sm: 24, xxl: 196 }}>
              <Col span={8}>
                <FormItem label="姓名">
                  {getFieldDecorator('clientName', { ...validate('姓名', { required: true, max: 30, type: 'string' }, editItem), initialValue: editItem.clientName })(
                    <Input placeholder="请输入姓名" size="large" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="手机号">
                  {getFieldDecorator('phoneTem', {
                    ...validate('手机号',
                      {
                        required: true,
                        max: 11,
                        type: 'phone',
                        sole: true,
                        model: 'Client',
                        _var: 2,
                        id: editItem.clientId,
                      }), initialValue: editItem.phoneTem,
                  })(
                    <Input placeholder="请输入手机号" size="large" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="客户来源">
                  {getFieldDecorator('channelId', { initialValue: editItem.channelId })(
                    <Select placeholder="请选择客户来源" size='large' getPopupContainer={triggerNode => triggerNode.parentNode}>
                      {
                        channelList.map((item) => (
                          <Option key={item.channelId} value={item.channelId}>{item.channelName}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="性别">
                  {getFieldDecorator('sex', {
                    rules: [{ required: true, message: '请选择性别' }],
                    initialValue: editItem.sex || 1,
                  })(
                    <RadioGroup options={[{ label: '男', value: 1 }, { label: '女', value: 2 }]} />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="客户类型">
                  {getFieldDecorator('clientType', { rules: [{ required: true, message: '请选择客户类型' }], initialValue: editItem.clientType || 1 })(
                    <RadioGroup options={[{ label: '个人', value: 1 }, { label: '单位', value: 2 }]} />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="客户状态">
                  {getFieldDecorator('state', { rules: [{ required: true, message: '请选择客户状态' }], initialValue: editItem.state || 1 })(
                    <RadioGroup options={[{ label: '启用', value: 1 }, { label: '停用', value: 0 }]} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <div style={this.state.open ? { height: 'auto' } : { height: 0, overflow: 'hidden' }}>
              <Row type="flex"  gutter={{ sm: 24, xxl: 196 }}>
                <Col span={8}>
                  <FormItem label="生日">
                    {getFieldDecorator('birthday', { initialValue: editItem.birthday })(
                      <DatePicker style={{ width: '100%' }} size="large" getCalendarContainer={trigger => trigger.parentNode} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="身份证">
                    {getFieldDecorator('identityCard', {
                      ...validate('身份证',
                        {
                          max: 30,
                          type: 'card',
                          sole: true,
                          model: 'Client',
                          id: editItem.clientId,
                        }), initialValue: editItem.identityCard,
                    })(
                      <Input placeholder="请输入身份证" size="large" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="住址">
                    {getFieldDecorator('address', { initialValue: editItem.address })(
                      <Input placeholder="请输入住址" size="large" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="所在单位">
                    {getFieldDecorator('company', { initialValue: editItem.company })(
                      <Input placeholder="请输入所在单位" size="large" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="单位住址">
                    {getFieldDecorator('companyAdd', { initialValue: editItem.companyAdd })(
                      <Input placeholder="请输入单位住址" size="large" />
                    )}
                  </FormItem>
                </Col>
                {/* <Col span={8}>
                  <FormItem label="允许挂账金额">
                    {getFieldDecorator('allowAmount', { ...validate('允许挂账金额'), initialValue: editItem.allowAmount })(
                      <InputNumber size='large' placeholder='请输入允许挂账金额' min={0} precision={1} style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col> */}
              </Row>
              <Row type="flex" gutter={{ sm: 24, xxl: 196 }}>
                <Col span={8}>
                  <FormItem label="备注">
                    {getFieldDecorator('remark', { initialValue: editItem.remark })(
                      <TextArea placeholder="备注" maxLength="200" rows={4} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="上传驾驶证">
                    {getFieldDecorator('licenseImg', {
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                      initialValue: editItem.licenseImg,
                    })(
                      <Upload
                        className='client-upload'
                        multiple
                        listType="picture-card"
                        onChange={this.handleChange('licenseImg', 2)}
                        onPreview={this.handlePreview}
                        beforeUpload={(file) => uploadImg(file, 'car', this.getImgId('licenseImg'))}
                      >{this.props.form.getFieldValue('licenseImg') && this.props.form.getFieldValue('licenseImg').length === 2 ? null : uploadButton}</Upload>
                    )}
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="上传其它图片">
                    {getFieldDecorator('clientImg', {
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                      initialValue: editItem.clientImg,
                    })(
                      <Upload
                        className='client-upload'
                        multiple
                        listType="picture-card"
                        onChange={this.handleChange('clientImg', 10)}
                        onPreview={this.handlePreview}
                        beforeUpload={(file) => uploadImg(file, 'car', this.getImgId('clientImg'))}
                      >{this.props.form.getFieldValue('clientImg') && this.props.form.getFieldValue('clientImg').length === 10 ? null : uploadButton}</Upload>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            {
              !this.state.open ?
                <span className={styles.open} onClick={this.changeOpen.bind(this)}>展开详情资料<i className="iconfont icon-zhankai" /></span>
                : <span className={styles.open} onClick={this.changeOpen.bind(this)}>收起详情资料<i className="iconfont icon-shouqi" /></span>
            }
          </div>
          <div className={styles.split} />
          <div className={styles.pad} style={{ paddingBottom: 0 }}>
            <FormTitle name="车辆信息" />
            <div className={styles.car}>
              {
                cars.map(item => (
                  <div
                    className={styles.carBox}
                    key={item.clientCarId}
                  >
                    <div className={styles.carItem}>
                      <div className={styles.imgBox}><img src={item.carIcon[0].requestAddress} alt="" /></div>
                      <div>
                        <div className={styles.plate}>{item.licenseNo}</div>
                        <div className={styles.carName}>{item.carBrandName + item.seriesName}</div>
                      </div>
                    </div>
                    <div className={styles.action}  >
                      <span onClick={() => this.toggleBind(item.clientCarId)}>解绑</span>
                      {type === 'edit' && <span onClick={() => this.showCardModal(item.clientCarId)}>关联卡项</span>}
                    </div>
                  </div>
                ))
              }
              <div className={styles.carBox} onClick={this.showAddCar}>
                <div className={styles.btn}>
                  <i className='iconfont icon-tianjia' />
                  <span>新建车辆</span>
                </div>
              </div>
              {
                showSearch ? (
                  <div className={styles.carBox}>
                    <div className={styles.btn}>
                      <Select
                        style={{ width: 230 }}
                        autoFocus={true}
                        showArrow={false}
                        showSearch
                        size='large'
                        placeholder='输入车牌号搜索'
                        filterOption={false}
                        notFoundContent={fetching ? <Spin size="small" /> : null}
                        onSearch={this.searchCar}
                        onChange={this.searchChange}
                        onBlur={() => this.setState({ showSearch: false })}
                      >
                        {
                          car.map((item) => (
                            <Option value={item.id} key={item.id}>{item.licenseNo}</Option>
                          ))
                        }
                      </Select>
                    </div>
                  </div>
                ) : (
                    <div className={styles.carBox} onClick={this.bindCar}>
                      <div className={styles.btn}>
                        <i className='iconfont icon-bangding' />
                        <span>绑定车辆</span>
                      </div>
                    </div>
                  )
              }
            </div>
          </div>
        </Form>
        <AddCar
          hideClient={true}
          type='add'
          visible={showAddCar}
          editItem={{}}
          onCancel={this.hideAdd}
          onOk={this.onOk}
        />
        <UnbindCar
          visible={showBind}
          onCancel={this.toggleBind}
          onOk={this.unBind}
        />
        <Card
          visible={showCard}
          selectedRowKeys={selectedRowKeys}
          cardList={cardList}
          carId={carId}
          clientId={editItem.clientId}
          rowChange={this.rowChange}
          delSelectedRowKeys={this.delSelectedRowKeys}
          onCancel={this.hideCardModal}
          onOk={this.hideCardModal}
        />
        <Tabbar>
          <div className={styles.tabbar}>
            <Button size="large" type="primary" loading={loading} onClick={this.handleSubmit.bind(this)}>提交</Button>
            <Button size="large" onClick={this.onCancel} >取消</Button>
          </div>
        </Tabbar>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { channelList } = state.clientManage
  return {
    channelList,
  }
}

export default connect(mapStateToProps)(Form.create()(Add))
