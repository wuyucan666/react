/**
 * Created by kikazheng on 2019/7/1
 */
import React,{Component} from 'react'
import {Modal, Form, Input, message} from 'antd'
import moment from 'moment'

import services from '../../../../../services'

import style from './style.less'

const { TextArea } = Input

class Index extends Component{
  state = {
    loading: false,
    key: 1,
    list: [],
    tagIds: [],
  }

  componentDidMount(){
    const {storeId, storeTag} = this.props.editItem
    this.setState({
      tagIds: storeTag.map(item => item.id),
    })
    services.LIST({keys: {name: 'admin/implement/dynamic'}, data: {q: {where: {storeId}}}}).then(res => {
      if(res.success){
        this.setState({
          list: res.list,
        })
      }
    })
  }

  onOk = () => {
    const {key} = this.state
    if(key === 1){
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({loading: true})
          const {storeId} = this.props.editItem
          const {content} = values
          services.INSERT({keys: {name: 'admin/implement/dynamic'}, data: {storeId, content}}).then(res => {
            this.setState({loading: false})
            if(res.success){
              message.success('添加成功')
              this.props.onOk()
            }
          }).catch(() => {
            this.setState({loading: false})
          })
        }else {
          this.setState({key: 1})
        }
      })
    }else {
      this.setState({loading: true})
      const {storeId} = this.props.editItem
      const {tagIds} = this.state
      services.PUT({keys: {link: 'admin/implement/store/tag'}, data: {storeId, tagIds}}).then(res => {
        this.setState({loading: false})
        if(res.success){
          message.success('添加成功')
          this.props.onOk()
        }
      }).catch(() => {
        this.setState({loading: false})
      })
    }
  }

  tabChange = (key) => {
    this.setState({key})
  }

  toggleTag = (id) => {
    const {tagIds} = this.state
    if(tagIds.includes(id)){
      const index = tagIds.findIndex(item => item === id)
      tagIds.splice(index, 1)
    }else {
      tagIds.push(id)
    }
    this.setState({
      tagIds,
    })
  }
  render(){
    const {onCancel, tagList} = this.props
    const {loading, key, list, tagIds} = this.state
    const { getFieldDecorator, getFieldValue} = this.props.form
    return(
      <Modal
        title='实施跟进'
        visible={true}
        width={740}
        confirmLoading={loading}
        onOk={this.onOk}
        onCancel={onCancel}
      >
        <div className={style.tab}>
          <div className={key === 1 ? style.tabActive : style.tabItem} onClick={() => this.tabChange(1)}>新增跟进</div>
          <div className={key === 2 ? style.tabActive : style.tabItem} onClick={() => this.tabChange(2)}>用户标签</div>
        </div>
        {
          key === 1 ? (
            <div>
              <div className={style.history}>
                {
                  list.map((item, index) => (
                    <div className={style.historyItem} key={index}>
                      <div className={style.historyTitle}>
                        <span>{item.adminName}</span>
                        <span>{moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm')}</span>
                        {!index && <span>最新</span>}
                      </div>
                      <div  className={style.historyContent}>{item.content}</div>
                    </div>
                  ))
                }
              </div>
              <Form layout="horizontal" hideRequiredMark>
                <Form.Item style={{position: 'relative'}}>
                  {getFieldDecorator('content', {
                    rules: [
                      { required: true, message: '请输入内容' },
                      { max: 100, message: '最多100字' },
                      ],
                  })(
                    <TextArea style={{width: '100%'}}  autosize={{ minRows: 6}}/>
                  )}
                  <span className={style.num}>{getFieldValue('content') ? getFieldValue('content').length : 0}/100</span>
                </Form.Item>
              </Form>
            </div>
          ):(
            <div>
              {
                tagList.map(item => (
                  <span
                    className={tagIds.includes(item.id) ? `${style.tag} ${style.tagActive}` : style.tag}
                    key={item.id}
                    onClick={() => this.toggleTag(item.id)}
                  >
                    {item.name}
                  </span>
                ))
              }
            </div>
          )
        }
      </Modal>
    )
  }
}

export default Form.create()(Index)
