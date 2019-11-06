/**
 * Created by kikazheng on 2019/6/29
 */
import React, { Component } from 'react'
import { Modal, Button } from 'antd'
import ReactDOM from 'react-dom'

import style from './style.less'

class Index extends Component {
  state = {
    visible: false,
  }
  toggleVisible = () => {
    this.setState((prevState) => ({
      visible: !prevState.visible,
    }))
  }
  render() {
    const { title, content } = this.props
    const { visible } = this.state
    const special = content.filter(item => item.special)
    const normal = content.filter(item => !item.special)
    return ReactDOM.createPortal(
      (
        <div>
          <div className={style.help} onClick={this.toggleVisible}><i className='iconfont icon-wenhao1' />{title}</div>
          <Modal
            title={title}
            visible={visible}
            width={1000}
            footer={null}
            wrapClassName='introduce-modal'
            onCancel={this.toggleVisible}
          >
            <div className={style.container}>
              {
                !!special.length && (
                  <div className={style.special}>
                    {
                      special.map((item, index) => (
                        <div className={style.listItem} key={index}>
                          <span className={style.icon}>?</span>
                          <div >{item.title}</div>
                          {
                            item.content && (<div className={style.itemContent}>{item.content}</div>)
                          }
                        </div>
                      ))
                    }
                  </div>
                )
              }
              {
                !!normal.length && (
                  <div className={style.introduce}>
                    {
                      normal.map((item, index) => (
                        <div key={index} className={style.listItem}>
                          <span className={style.serial}>{index + 1}</span>
                          <div style={{ marginBottom: !item.content ? '75px' : 0 }}>{item.title}</div>
                          {
                            item.content && (<div className={style.itemContent}>{item.content}</div>)
                          }
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
            <div className={style.btn}>
              <Button type='primary' size='large' onClick={this.toggleVisible}>知道了</Button>
            </div>
          </Modal>
        </div>
      ),
      document.getElementById('breadcrumb')
    )
  }
}

export default Index
