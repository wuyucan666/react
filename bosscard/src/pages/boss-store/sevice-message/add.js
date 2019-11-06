import React, { Component } from 'react'
import {Modal, Select, Icon, Input, message} from 'antd'
import { connect } from 'dva'
import services from "../../../services"
import styles from './styles.less'

const Option = Select.Option
const { TextArea } = Input

class Add extends Component {
  constructor(props){
    super(props)
    this.state={
      value: props.editItem.content || '',
      project: [],
      product: [],
      item: props.editItem || {},
    }
  }
  handleOk=()=>{
    let item = this.state.item
    const {type, editItem} = this.props
    if(!this.state.value) {
      return message.warning('内容不能为空！')
    }
    // 编辑
    if(type === 'edit') {
      services.UPDATE({
        data: {content: this.state.value},
        keys: { name: "store/servicesSmsTemplate", id: editItem.id},
      }).then(res => {
        if(res.code === '0') {
          message.success('修改成功！')
          this.props.dispatch({
            type: "table/getData",
            payload: {new: 'store/servicesSmsTemplate'},
          })
          this.setState({item: {}, value: ''})
          this.props.onCancel()
        }
      })
      return false
    }
    // 新增
    if(!item.projectId && !item.productId) {
      return message.warning('请选择产品/项目！')
    }
    services.INSERT({
      data: {
        content: this.state.value,
        projectId: item.projectId || 0,
        productId: item.productId || 0,
        name: item.name || '',
        type: item.projectId ? 1 : 2,
      },
      keys: { name: "store/servicesSmsTemplate" },
    }).then(res => {
      if(res.code === '0') {
        message.success('新建成功！')
        this.props.dispatch({
          type: "table/getData",
          payload: {new: 'store/servicesSmsTemplate'},
        })
        this.setState({item: {}, value: ''})
        this.props.onCancel()
      }
    })
  }
  handleCancel=()=> {
    this.setState({item: {}, value: ''})
    this.props.onCancel()
  }
  /**
   * 搜索
   */
  handleSearch = (st, value) => {
    let name = st === 1 ? 'store/product' : 'store/project'
    let data = st === 1 ? {'productName[~]|commodityCode[~]': value, statusTem: 1} : {'projectName[~]': value, statusTem: 1}
    services.list({ keys: { name}, data: {q: {"page": -1, "limit": -1, "where": data }} }).then(res => {
      if(st === 1) {
        this.setState({ product: res.list })
      } else {
        this.setState({ project: res.list })
      }
    })
  }
   /**
   * 选择
   */
  handleChange = (st, id) => {
    if(st === 1) {
      let item = this.state.product.find(v => v.productId === id)
      this.setState({item: {...item, name: item.productName}})
    } else {
      let item = this.state.project.find(v => v.projectId === id)
      this.setState({item: {...item, name: item.projectName}})
    }
  }
  onTextArea=(value)=>{
    this.setState({value: value.target.value})
  }
  // 删除选中
  del=()=> {
    this.setState({item: {}})
  }
  // 获取焦点之后触发
  onFocus=(e)=> {
    this.handleSearch(e, '')
  }
  render() {
    const {visible, type}= this.props
    const {value, project, product, item}= this.state
    return (
      <div>
        <Modal
          title="短信模板"
          width="900px"
          visible={visible}
          okText='保存'
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className='sevice_message_modal'
        >
          {(item.name) ?  '' : <div className={styles.sevice_message_flex}>
            <div className={styles.s_message_select}>
              <Select
                showSearch
                onFocus={this.onFocus.bind(this, 2)}
                className='sevice_message_select'
                size="large"
                style={{ width: '285px' }}
                placeholder='项目名称'
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch.bind(this, 2)}
                onChange={this.handleChange.bind(this, 2)}
                notFoundContent={null}
              >
                {project && project.map((d, index) => <Option key={index} value={d.projectId}>{d.projectName}</Option>)}
              </Select>
              <Icon className={styles.s_message_icon} type="search" />
            </div>
            <div className={styles.s_message_select}>
              <Select
                showSearch
                onFocus={this.onFocus.bind(this, 1)}
                className='sevice_message_select'
                size="large"
                style={{ width: '285px' }}
                placeholder='产品名称 / 编号'
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch.bind(this, 1)}
                onChange={this.handleChange.bind(this, 1)}
                notFoundContent={null}
              >
                {product && product.map((d, index) => <Option key={index} value={d.productId}>{d.productName}</Option>)}
              </Select>
              <Icon className={styles.s_message_icon} type="search" />
            </div>
          </div>}
          {(item.name) ? <div className={styles.chooes_goods}>
            <span>{item.name}</span>
            {type === 'edit' ? '' : <Icon onClick={this.del} className={styles.close_circle} type="close-circle" theme="filled" />}
          </div> : ''}
          <div className={styles.sevice_message_h}>开单后，系统将自动发送以下内容给对应的客户：</div>
          <div className={styles.s_message_textarea}>
            <TextArea value={value} className='sevice_message_textarea' onChange={this.onTextArea} placeholder='请输入短信内容' maxLength='70'></TextArea>
            <div className={styles.s_message_txt}>{value.length} / 70</div>
          </div>
        </Modal>
      </div>
    )
  }
}
export default connect()(Add)