/**
 * Created by kikazheng on 2019/4/24
 */
import React,{Component} from 'react'
import {Modal, Row, Col, Button, message} from 'antd'
import moment from 'moment'
import styles from '../index.less'

class DetailsFeedback extends Component{
  state = {
  }
  componentDidMount(){
  }
  handleOk=()=> {
    this.props.onClone()
  }
  handleCancel=()=> {
    this.props.onClone()
  }
  ondownload=()=> {
    const {item} = this.props
    let u = (item.pics && item.pics.requestAddress) ? item.pics.requestAddress : ''
    if(u) {
      window.open(u)
    } else {
      message.warn('没有图片！')
    }
  }
  render(){
    const {visible, item} = this.props
    return(
      <div>
        <Modal
          title="意见反馈详情"
          className='details_modal'
          width='900px'
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div className={styles.details_wrap}>
            <div className={styles.details_title}>
              <Row>
                <Col span={12}>
                  <Row>
                    <Col span={7}><div className={styles.l}>品牌名称</div></Col>
                    <Col span={17}><div className={styles.r}>{item.brandName}</div></Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={7}><div className={styles.l}>门店名称</div></Col>
                    <Col span={17}><div className={styles.r}>{item.storeName}</div></Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Row>
                    <Col span={7}><div className={styles.l}>反馈时间</div></Col>
                    <Col span={17}><div className={styles.r}>{item.created ? moment(item.created * 1000).format("YYYY-MM-DD HH:mm:ss") : ''}</div></Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={7}><div className={styles.l}>反馈人姓名</div></Col>
                    <Col span={17}><div className={styles.r}>{item.staffName}</div></Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Row>
                    <Col span={7}><div className={styles.l}>问题状态</div></Col>
                    <Col span={17}><div className={styles.r} style={{color: item.status === 1 ? '#4AACF7FF' : '#E55F39FF'}}>{item.status === 1 ? "已处理" : "未处理"}</div></Col>
                  </Row>
                </Col>
                {item.status === 1 ? <Col span={12}>
                  <Row>
                    <Col span={7}><div className={styles.l}>处理人</div></Col>
                    <Col span={17}><div className={styles.r}>{item.dealName}</div></Col>
                  </Row>
                </Col> : ''}
                {item.status === 1? '' : <Col span={12}>
                  <Row>
                    <Col span={7}><div className={styles.l}>问题类型</div></Col>
                    <Col span={17}><div className={styles.r}>{item.type === 1 ? "遇到问题" : "功能建议"}</div></Col>
                  </Row>
                </Col>}
              </Row>

              {item.status === 1 ? <Row>
                <Col span={12}>
                  <Row>
                    <Col span={7}><div className={styles.l}>处理时间</div></Col>
                    <Col span={17}><div className={styles.r}>{item.dealAt ? moment(item.dealAt * 1000).format("YYYY-MM-DD HH:mm:ss") : ''}</div></Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={7}><div className={styles.l}>问题类型</div></Col>
                    <Col span={17}><div className={styles.r}>{item.type === 1 ? "遇到问题" : "功能建议"}</div></Col>
                  </Row>
                </Col>
              </Row> : ''}
            </div>
            <div className={styles.details_h}>问题意见内容</div>
            <div className={styles.details_textAreaw}>
              {item.content ? <div className={styles.details_textArea}>{item.content}</div> : ''}
              {item.content ? '' : <p>您的宝贵建议已收到，请保持手机畅通，平台专人将尽快与您联系。</p>}
            </div>
            <div style={{display:(item.pics && item.pics.requestAddress)? '': 'none'}}>
              <div className={styles.details_h}>图片</div>
              <div className={styles.details_img_wrap}>
                <img alt='暂无图片' style={{width: (item.pics && item.pics.requestAddress) ? '100%' : ''}} src={(item.pics && item.pics.requestAddress) ? item.pics.requestAddress : ''}/>
              </div>
              <Button size='large' className={styles.details_img_btn} onClick={this.ondownload}>
                查看
                {/* <a href={(item.pics && item.pics.requestAddress) ? item.pics.requestAddress : ''} download="logo.jpg">下载</a> */}
              </Button>
            </div>
            <div className={styles.details_btn}><Button className={styles.btn} type="primary" size='large' onClick={this.handleOk}>确定</Button></div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default DetailsFeedback
