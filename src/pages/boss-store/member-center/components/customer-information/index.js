import { Component } from "react"
import { Form, Input, Select, Row, Col, Radio, DatePicker, Upload, Icon, InputNumber, message, Button, Modal } from "antd"
import validate from "../../../../../utils/validate"
import uploadImg from "../../../../../utils/uploadImg"
import styles from "./index.less"

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const RadioGroup = Radio.Group

const Add = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { editItem } = props
    if (editItem) {
      let obj = {}
      Object.keys(editItem).map(v => {
        return (obj[v] = Form.createFormField({
          value: editItem[v],
        }))
      })
      return obj
    }
  },
})(
  class extends Component {
    state = {
      warehouseIdValue: "",
      show: false,
      previewVisible: false,
      previewImage: '',//图片路径
    }
    /**
  * 展开
  */
    showHide = show => {
      this.setState({ show })
    }
    /**
     * 提交
     */
    handleSubmit = () => {
      const { validateFields } = this.props.form
      const { dispatch, menuClick } = this.props
      validateFields((err, values) => {
        if (err) {
          return
        }
        values.driverLicenseImage = values.driverLicenseImage ? values.driverLicenseImage.filter(v => v) : []
        values.otherImage = values.otherImage ? values.otherImage.filter(v => v) : []
        dispatch({ type: "customersImport/goCustomerInformation", payload: values }).then(() => {
          menuClick(1)
        })
      })
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
    handleChange = (property, num, v) => {
      if (v) {
        const imgType = ['image/jpeg', 'image/jpg', 'image/png']
        const { fileList, file } = v
        if (imgType.indexOf(file.type) === -1) {
          fileList.splice(fileList.findIndex(item => item.uid === file.uid))
          return false
        }
        if (fileList.length > num) {
          message.info(`最多上传${num}张`)
          fileList.splice(num)
        }
      }
      // return ({ fileList, file }) => {
      //   const imgType = ['image/jpeg', 'image/jpg', 'image/png']
      //   if (imgType.indexOf(file.type) === -1) {
      //     fileList.splice(fileList.findIndex(item => item.uid === file.uid))
      //     return false
      //   }
      //   if (fileList.length > num) {
      //     message.info(`最多上传${num}张`)
      //     fileList.splice(num)
      //   }
      // }
    }
    // 图片value转换
    normFile = (e) => {
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    }
    componentDidMount() {
    }
    //查看图片
    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      })
    }
    //隐藏图片modal
    modalImg = () => {
      this.setState({ previewVisible: false })
    }
    render() {
      const { getFieldDecorator } = this.props.form
      const { channelList, editItem } = this.props
      const uploadButton = (
        <div>
          <Icon type="plus" />
          {/* <div style={{ fontSize: "12px", color: "#CCCCCCFF" }}>点击添加照片</div> */}
        </div>
      )
      return (
        <div className={styles.centerDiv}>
          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.modalImg} className='feedback_upload_img'>
            <img alt="example" src={this.state.previewImage} />
          </Modal>
          <Form className="from-wrap-margin">
            <Row gutter={106} className={styles.CinformationBox}>
              <Col span={8}>
                <FormItem label="姓名">
                  {getFieldDecorator('clientName', { ...validate('姓名', { required: true, max: 30, type: 'string' }, editItem) })(
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
                        id: editItem ? editItem.clientId : 0,
                      }),
                  })(
                    <Input size="large" placeholder="请输入手机号" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="客户来源">
                  {getFieldDecorator('clientSource')(
                    <Select placeholder="请选择客户来源" size='large' getPopupContainer={triggerNode => triggerNode.parentNode}>
                      {
                        channelList && channelList.map((item) => (
                          <Option key={item.channelId} value={item.channelId}>{item.channelName}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={106} className={styles.CinformationBox}>
              <Col span={8}>
                <FormItem label="性别">
                  {getFieldDecorator('clientSex', {
                    rules: [{ required: true, message: '请选择性别' }],
                    initialValue: 1,
                  })(
                    <RadioGroup>
                      <Radio value={1}>男</Radio>
                      <Radio value={2}>女</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="客户类型">
                  {getFieldDecorator('clientType', { rules: [{ required: true, message: '请选择客户类型' }], initialValue: 1 })(
                    <RadioGroup>
                      <Radio value={1}>个人</Radio>
                      <Radio value={2}>单位</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            <div style={{ 'display': this.state.show ? 'block' : 'none' }}>
              <Row gutter={106} className={styles.CinformationBox}>
                <Col span={8}>
                  <FormItem label="生日">
                    {getFieldDecorator('clientBirthday')(
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
                          id: editItem ? editItem.clientId : 0,
                        }),
                    })(
                      <Input placeholder="请输入身份证" size="large" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="住址">
                    {getFieldDecorator('address')(
                      <Input placeholder="请输入住址" size="large" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={106} className={styles.CinformationBox}>
                <Col span={8}>
                  <FormItem label="所在单位">
                    {getFieldDecorator('currentUnit')(
                      <Input placeholder="请输入所在单位" size="large" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="单位住址">
                    {getFieldDecorator('unitAddress')(
                      <Input placeholder="请输入单位住址" size="large" />
                    )}
                  </FormItem>
                </Col>
                {/* <Col span={8}>
                  <FormItem label="允许挂账金额">
                    {getFieldDecorator('arrears', { ...validate('允许挂账金额') })(
                      <InputNumber size='large' placeholder='请输入允许挂账金额' min={0} precision={1} style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col> */}
              </Row>
              <Row gutter={106} className={styles.CinformationBox}>
                <Col span={8}>
                  <FormItem label="上传驾驶证">
                    {getFieldDecorator('driverLicenseImage', {
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                    })(
                      <Upload
                        className='client-upload'
                        multiple
                        listType="picture-card"
                        onChange={this.handleChange.bind(this, 'driverLicenseImage', 2)}
                        onPreview={this.handlePreview}
                        beforeUpload={(file) => uploadImg(file, 'car', this.getImgId('driverLicenseImage'))}
                      >{this.props.form.getFieldValue('driverLicenseImage') && this.props.form.getFieldValue('driverLicenseImage').length === 2 ? null : uploadButton}</Upload>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="上传其它图片">
                    {getFieldDecorator('otherImage', {
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                    })(
                      <Upload
                        className='client-upload'
                        multiple
                        listType="picture-card"
                        onChange={this.handleChange('otherImage', 10)}
                        onPreview={this.handlePreview}
                        beforeUpload={(file) => uploadImg(file, 'car', this.getImgId('otherImage'))}
                      >{this.props.form.getFieldValue('otherImage') && this.props.form.getFieldValue('otherImage').length === 10 ? null : uploadButton}</Upload>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="备注">
                    {getFieldDecorator(
                      "remark",
                      validate("备注", { required: false, max: 200 })
                    )(
                      <TextArea
                        style={{
                          height: "80px",
                        }}
                        placeholder="请输入备注信息"
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
          </Form>
          {!this.state.show ? (
            <div
              className={styles.updownw}
              onClick={this.showHide.bind(this, true)}
            >
              展开详细资料
            <i className="iconfont icon-zhankai" />
            </div>
          ) : (
              ""
            )}
          {this.state.show ? (
            <div
              className={styles.updownw}
              onClick={this.showHide.bind(this, false)}
            >
              收起详细资料
            <i className="iconfont icon-shouqi" type="up" />
            </div>
          ) : (
              ""
            )}
          <div className={styles.footerSubmit}>
            <Button className={styles.btn} size="large" type="primary" onClick={this.handleSubmit}>提交</Button>
            {/* <Button className={styles.btn} size="large" onClick={this.onClone} >取消</Button> */}
          </div>
        </div>
      )
    }
  }
)
export default Add
