import { Component } from "react"
import { Table, Modal } from 'antd'
// import services from 'services'
// import styles from './styles.less'
const styles = require('./styles.less')


interface Props {
  visible:boolean
  hideModal:any
  currentServe:any
  serviceItem:any
}
class ServeCard extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  handleOk= () =>{

  }

  render() {
    const { visible, hideModal,currentServe, serviceItem } = this.props
    const dataSource = []
    currentServe && currentServe.forEach(v => {
      dataSource.push(v)
    })
    const columns = [
      {
        title: '项目/产品名称',
        dataIndex: 'projectName',
        key: 'projectName',
        width:'30%',
      },
      {
        title: '数量',
        dataIndex: 'totalNum',
        key: 'totalNum',
        width:'13%',
      },
      {
        title: '消费',
        dataIndex: 'useNum',
        key: 'useNum',
        width:'14%',
      },
      {
        title: '剩余',
        dataIndex: 'remainNum',
        key: 'remainNum',
        width:'13%',
      },
      {
        title: '有效期',
        dataIndex: 'deadlineTime',
        key: 'deadlineTime',
        width:'30%',
      },
    ]
    // {serviceItem.cardType === 4 ? "卡内服务（总次数剩余：" + serviceItem.remainNum*1 +"）" : "卡内服务"}
    return (
      <Modal
        title={[<div>卡内服务{serviceItem.cardType === 4 ? <span style={{fontSize: '14px', fontWeight: 'normal'}}>（总次数剩余：{serviceItem.remainNum*1}）</span> : ''}</div>]}
        visible={visible}
        onOk={this.handleOk}
        onCancel={hideModal}
        maskClosable={false}
        footer={null}
        width={1200}
        bodyStyle={{height:'600px'}}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          className={styles.serve_card}
        />
      </Modal>
    )
  }
}
export default ServeCard
