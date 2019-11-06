import { Component } from "react"
import { Modal, Input, Radio, Upload, Icon, message, Button } from "antd"
import styles from './feedback.less'
import uploadImg from "../../utils/uploadImg"
import service from '../../services'

const { TextArea } = Input
const RadioGroup = Radio.Group

class Feedback extends Component {
  state = {
    radioGroup: 1,
    fileList: 0,
    previewVisible: false, //查看图片
    previewImage: '',//图片路径
    value: '',
    visible: false,
  }
  componentDidMount() {
  }
  handleOk=()=>{
    if(this.state.value.length > 500 || this.state.value.length < 6) {
      return message.warn('字数要小于500，大于6个字符！')
    }
    service.INSERT({
      keys: { name: 'message/opinion/feedback'},
      data: {content: this.state.value, pics: [this.state.fileList], type: this.state.radioGroup},
    }).then((res) => {
      if(res.code === '0') {
        this.props.goFeedback()
        this.setState({visible: true}, ()=> {
          setTimeout(() => {
            this.empty()
          }, 3000)
        })
      }
    })
  }
  empty=()=> {
    this.setState({
      radioGroup: 1,
      fileList: 0,
      previewVisible: false, //查看图片
      previewImage: '',//图片路径
      value: '',
      visible: false,
    })
  }
  handleCancel=()=>{
    this.empty()
    this.props.goFeedback()
  }
  onChangeRadioGroup=(e)=> {
    this.setState({radioGroup: e.target.value})
  }
  // 图片选择是否符合上传条件
  handleChange = (v) => {
    if(v.fileList && v.fileList.length === 0){
      this.setState({fileList: 0})
    }
    if (v) {
      const imgType = ['image/jpeg', 'image/jpg', 'image/png']
      const { fileList, file } = v
      if (imgType.indexOf(file.type) === -1) {
        fileList.splice(fileList.findIndex(item => item.uid === file.uid))
        return false
      }
      if(v.fileList && v.fileList.length === 2) {
        message.warn('最多上传1张')
        fileList.splice(1)
      }
    }
  }
  // 获取图片id
  getImgId = (fileList) => {
    this.setState({fileList})
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
  onChangeTextArea=(e) => {
    this.setState({value: e.target.value})
  }
  render() {
    return (
      <div>
        <Modal
          title="意见反馈"
          width="900px"
          className='feedback_wrap_modal'
          visible={this.props.feedbackVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <div className={styles.feedback_wrap}>
            <div className={styles.feedback_h}>
              <div>亲爱的智联车宝用户：</div>
              <div>如果您发现平台系统出现错误或想对我们的产品提出意见或建议请在这里填写，您的意见是平台进步的动力！（500字以内）</div>
            </div>
            <div className={styles.radio_group}>
              <RadioGroup onChange={this.onChangeRadioGroup} value={this.state.radioGroup}>
                <Radio value={1}>遇到问题</Radio>
                <Radio value={2}>功能建议</Radio>
              </RadioGroup>
            </div>
            <TextArea className={styles.feedback_textArea} onChange={this.onChangeTextArea} value={this.state.value} placeholder="例：在（）情况下，（）功能出现异常"/>
            {(!this.state.value || (this.state.value && this.state.value.length < 6)) ? <div className={styles.police}> *至少输入六字</div> : ''}
            <div className={styles.imgtext}>请上传本地图片，大小不超过3M，格式为.jpg、png或.bmp。</div>
           {this.props.feedbackVisible ? <div className={styles.feedback_upload_wrap}>
              <Upload
                className='feedback_upload'
                multiple
                listType="picture-card"
                onChange={this.handleChange.bind(this)}
                onPreview={this.handlePreview}
                beforeUpload={(file) => uploadImg(file, 'car', this.getImgId)}
              >
                {this.state.fileList ? '' :<div>
                  <Icon type="plus" />
                </div>}
              </Upload>
              <Modal visible={this.state.previewVisible} footer={null} onCancel={this.modalImg} className='feedback_upload_img'>
                <img alt="" src={this.state.previewImage} />
              </Modal>
            </div> : ''}
            <div className={styles.feedback_btn}><Button className={styles.btn} type="primary" size='large' onClick={this.handleOk}>提交反馈</Button></div>
          </div>
        </Modal>
        <Modal
          title=""
          width="674px"
          className='feedback_success_modal'
          visible={this.state.visible}
          footer={null}
        >
          <div className={styles.success_modal_w}>
            <div className={styles.success_modal_i}><Icon type="check-circle" theme="filled" /></div>
            <div className={styles.success_modal_txt}>提交成功</div>
            <div className={styles.success_modal_p}>感谢您的宝贵建议,将在<span> 3 </span>秒后关闭！</div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Feedback
