/**
 * Created by kikazheng on 2019/4/17
 */
import React, {Component} from 'react'
import {Col, DatePicker, Form, Icon, Input, InputNumber, message, Modal, Radio, Row, Select, Upload, Spin, Button} from 'antd'
import moment from 'moment'
import validate from "../../../../../../utils/validate"
import { connect } from "dva"
import uploadImg from "../../../../../../utils/uploadImg"
import service from '../../../../../../services'
import style from './style.less'

const RadioGroup = Radio.Group
const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input

class Index extends Component{
  state = {
    channelList: [],
    data: {},
    loading: false,
  }
  componentDidMount(){
    this.setState({
      loading: true,
    })
    service.detail({keys: {name: 'store/client'}, data: {clientId: this.props.clientId}}).then(res => {
      if(res.success){
        const data = res.list
        data.birthday = data.birthday ? moment(data.birthday * 1000) : undefined
        data.licenseImg = data.licenseImg.map((item) => ({
          url: item.requestAddress,
          uid: item.id,
          imgId: item.id,
        }))
        data.clientImg = data.clientImg.map((item) => ({
          url: item.requestAddress,
          uid: item.id,
          imgId: item.id,
        }))
        this.setState({
          data,
        })
      }
    })
    service.LIST({keys: {name: 'store/channel/list'}, data: {q:{page:-1, where: {statusTem: 1}}}}).then(res => {
      this.setState({
        loading: false,
      })
      if(res.success){
        this.setState({
          channelList: res.list,
        })
      }
    }).catch(() => {
      this.setState({
        loading: false,
      })
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
  onCancel = () => {
    this.props.form.resetFields()
    this.props.onCancel()
  }

  //发布
  handleSubmit = (e) => {
    const { isRequsetList } = this.props

    e.preventDefault()
    this.props.form.validateFieldsAndScroll(
      (err, values) => {
        if (!err) {
          this.setState({loading: true})
          const { data } = this.state
          const clientData = { ...values, clientId: data.clientId }
          clientData.birthday = clientData.birthday && moment(clientData.birthday).format('YYYY-MM-DD')
          clientData.licenseImg = clientData.licenseImg && clientData.licenseImg.map(item => item.imgId)
          clientData.clientImg = clientData.clientImg && clientData.clientImg.map(item => item.imgId)
          clientData.data = data.list.map(item => item.clientCarId)
          service.update({ data: clientData, keys: { 'name': 'store/client' } }).then(res => {
            this.setState({loading: false})
            if (res.success) {
              message.success('修改成功!')
              this.props.form.resetFields()
              this.props.onOk()
              // console.log(isRequsetList,'isRequsetList存在就触发列表接口dispatch')
              isRequsetList && this.props.dispatch({
                type:'table/getData',
                payload:{new:false},
              })
            } else {
              message.error(res.content)
            }
          }).catch(() => {
            this.setState({loading: false})
          })
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

  render(){
    const { getFieldDecorator } = this.props.form
    const { channelList, previewVisible, previewImage, data, loading } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
      </div>
    )
    return(
      <Spin spinning={loading}>
        <div className={style.clientBox}>
          <Form layout="vertical" onSubmit={this.handleSubmit} >
            <Row type="flex" justify="space-between" gutter={{ sm: 24, xxl: 196 }}>
              <Col span={8}>
                <FormItem label="姓名">
                  {getFieldDecorator('clientName', { ...validate('姓名', { required: true, max: 30, type: 'string' }), initialValue: data.clientName })(
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
                        id: data.clientId,
                      }), initialValue: data.phoneTem,
                  })(
                    <Input placeholder="请输入手机号" size="large" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="客户来源">
                  {getFieldDecorator('channelId', { initialValue: data.channelId })(
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
                    initialValue: data.sex || 1,
                  })(
                    <RadioGroup options={[{ label: '男', value: 1 }, { label: '女', value: 2 }]} />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="客户类型">
                  {getFieldDecorator('clientType', { rules: [{ required: true, message: '请选择客户类型' }], initialValue: data.clientType || 1 })(
                    <RadioGroup options={[{ label: '个人', value: 1 }, { label: '单位', value: 2 }]} />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="客户状态">
                  {getFieldDecorator('state', { rules: [{ required: true, message: '请选择客户状态' }], initialValue: data.state})(
                    <RadioGroup options={[{ label: '启用', value: 1 }, { label: '停用', value: 0 }]} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" gutter={{ sm: 24, xxl: 196 }}>
              <Col span={8}>
                <FormItem label="生日">
                  {getFieldDecorator('birthday', { initialValue: data.birthday })(
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
                        id: data.clientId,
                      }), initialValue: data.identityCard,
                  })(
                    <Input placeholder="请输入身份证" size="large" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="住址">
                  {getFieldDecorator('address', { initialValue: data.address })(
                    <Input placeholder="请输入住址" size="large" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="所在单位">
                  {getFieldDecorator('company', { initialValue: data.company })(
                    <Input placeholder="请输入所在单位" size="large" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="单位住址">
                  {getFieldDecorator('companyAdd', { initialValue: data.companyAdd })(
                    <Input placeholder="请输入单位住址" size="large" />
                  )}
                </FormItem>
              </Col>
              {/* <Col span={8}>
                <FormItem label="允许挂账金额">
                  {getFieldDecorator('allowAmount', { ...validate('允许挂账金额'), initialValue: data.allowAmount })(
                    <InputNumber size='large' placeholder='请输入允许挂账金额' min={0} precision={1} style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col> */}
            </Row>
            <Row type="flex" gutter={{ sm: 24, xxl: 196 }}>
              <Col span={8}>
                <FormItem label="备注">
                  {getFieldDecorator('remark', { initialValue: data.remark })(
                    <TextArea placeholder="备注" maxLength="200" rows={4} />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="上传驾驶证">
                  {getFieldDecorator('licenseImg', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                    initialValue: data.licenseImg,
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
                    initialValue: data.clientImg,
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
            <div className={style.btn}>
              <Button size='large' type='primary' onClick={this.handleSubmit}>保存</Button>
              <Button size='large' onClick={this.onCancel}>取消</Button>
            </div>
          </Form>
        </div>
      </Spin>
    )
  }
}

export default connect()(Form.create()(Index))
