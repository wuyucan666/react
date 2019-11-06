import { Component } from 'react'
import { Button, Icon, Upload, message, Modal, Table, Tooltip } from 'antd'
import style from '../style.less'
import img from '../images/icon.png'
import { api } from "../../../../utils/config"
import empty from '../../maintain-billing/components/images/no_data.jpg'
import service from 'services'
import moment from 'moment'

class BulkImport extends Component {

  state = {
    loading: false,
    abnormalTk: false,
    list: [],
    abnormalData: [],
    failClientCount: 0,
    curId: -1,
  }

  componentWillMount () {
    this.getList()
  }

  getList = () => {
    service.LIST({
      keys: {name: 'store/client/import'},
    }).then(res => {
      if(res.success) {
        this.setState({
          list: res.list.map(v => ({...v, status: 2, created: moment(v.created * 1000).format('YYYY-MM-DD HH:mm:ss')})),
        })
      }
    })
  }

  onChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true})
    }
    if (info.file.status === 'done') {
      const { file: { response, name } } = info
      if(response.code === '0') {
        this.getList()
        message.success(`${name}导入成功!`)
        this.setState({loading: false})
      }else {
        if(response.code*1 === 442) {
          message.error('上传的文件格式必须是csv')
          this.setState({loading: false})
          let { list } = this.state
          list.shift()
          this.setState({
            list: list,
          })
        }
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}导入失败!`)
      this.setState({loading: false})
    }
  }

  beforeUpload = (file) => {
    console.log(file)
    const isCsv = file.type === 'application/vnd.ms-excel'
    if(!isCsv) {
      // message.error('上传的文件格式必须是csv')
    }else {
      let { list } = this.state
      list.unshift({fileName: file.name, status: 1, created: moment().format('YYYY-MM-DD HH:mm:ss')})
      this.setState({
        list: list,
      })
    }
    return true
  }

  showDate = (id) => {
    service.DETAIL({
      keys: {name: 'store/client/import/fail', id: id},
    }).then(res => {
      if(res.success) {
        this.setState({abnormalTk: true, abnormalData: res.data.failData, failClientCount: res.data.failClientCount, curId: id})
      }
    })
  }

  doload = () => {
    window.open('https://image-1256158653.cos.ap-guangzhou.myqcloud.com/smartcar/template/%E4%BC%9A%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.csv')
  }
  doloadFail = () => {
    window.open(`${api.domain}/store/client/import/fail/${this.state.curId}/download?token=${sessionStorage.getItem("tk")}`)
  }

  render() {
    const { list, abnormalData, failClientCount } = this.state
    const columns = [
      {
        title: '姓名',
        dataIndex: 'clientName',
        width: '78px',
        render: (val, record) => {
          return <div style={{color: record.attribute === 'clientName' ? '#FF596A' : '#666'}}>{val}</div>
        },
      },
      {
        title: '性别',
        dataIndex: 'sex',
        width: '68px',
        render: (val, record) => {
          return <div style={{color: record.attribute === 'sex' ? '#FF596A' : '#666'}}>{val}</div>
        },
      },
      {
        title: '手机',
        dataIndex: 'phone',
        width: '126px',
        render: (val, record) => {
          return <div style={{color: record.attribute === 'phone' ? '#FF596A' : '#666'}}>{val}</div>
        },
      },
      {
        title: '卡类型',
        dataIndex: 'cardType',
        width: '90px',
        render: (val, record) => {
          return <div style={{color: record.attribute === 'cardType' ? '#FF596A' : '#666'}}>{val}</div>
        },
      },
      {
        title: '卡名称',
        dataIndex: 'cardName',
        width: '200px',
        render: (val, record) => {
          return <div style={{color: record.attribute === 'cardName' ? '#FF596A' : '#666'}}>{val}</div>
        },
      },
      {
        title: '卡余额',
        dataIndex: 'cardAmount',
        width: '84px',
        render: (val, record) => {
          return <div style={{color: record.attribute === 'cardAmount' ? '#FF596A' : '#666'}}>{val}</div>
        },
      },
      {
        title: '到期时间',
        dataIndex: 'cardTime',
        width: '120px',
        render: (val, record) => {
          return <div style={{color: record.attribute === 'cardTime' ? '#FF596A' : '#666'}}>{val}</div>
        },
      },
      {
        title: '车牌号',
        dataIndex: 'cars',
        width: '180px',
        render: (val, record) => {
          return <div style={{color: record.attribute === 'cars' ? '#FF596A' : '#666'}}>{val}</div>
        },
      },
      {
        title: '异常',
        dataIndex: 'errors',
        width: '190px',
        render: (val) => {
          return <div style={{color: '#FF596A'}}>{val}</div>
        },
      },
    ]
    const props = {
      name: 'file',
      action: `${api.domain}/store/client/import`,
      showUploadList: false,
      headers: {
        Authorization: sessionStorage.getItem('tk'),
      },
      onChange: this.onChange,
      beforeUpload: this.beforeUpload,
    }

    return (
      <div>
        <div className={style.import}>
          <div className={style.tit + ' flex center'}>
            <span className='item'>客户批量导入</span>
            <Upload {...props} style={{display: 'inline-block'}}>
              <Button
              type={this.state.loading ? "default" : "primary" }
              size="large"
              disabled={this.state.loading}
              style={{background: '#4AACF7', color: '#fff'}}>上传文件</Button>
            </Upload>
            <div>
              <Button type="primary" size="large" onClick={this.doload}>下载表格</Button>
              <Button type="primary" size="large" onClick={() => this.props.goBack()}>返回上一级</Button>
            </div>
          </div>
          <div className={style.content}>
            {
              list.length > 0 ?
              list.map((_,i) => {
                return(
                  <div key={i} className={style.item + ' flex center animated'}>
                    <img src={img} alt=""></img>
                    <div className={style.name + ' flex column' }>
                      <span>文件名称: <Tooltip placement="top" title={_.fileName}><b>{_.fileName}</b></Tooltip></span>
                      <span>{_.created}</span>
                    </div>
                    <div className='item flex center'>
                        {
                          _.status === 1 &&
                          <span className={style.ing}>
                            <i className='iconfont icon-yuandian'></i> 数据导入中， 请稍后...
                          </span>
                        }
                        {
                          _.status === 2 &&
                          <span className={style.success}>
                            <Icon type="check" /> 已导入{_.importCount}条正常数据
                          </span>
                        }
                    </div>
                    <div className={style.buttons}>
                      {
                        _.status === 2 &&
                        <Button size="large" onClick={this.showDate.bind(this,_.id)}>查看异常客户</Button>
                      }
                    </div>
                  </div>
                )
              })
              :
              <div className="ainier_empty flex column">
                <img src={empty} alt="" style={{margin: '0 auto'}} />
                <p style={{fontSize: '14px', color: '#333', textAlign: 'center'}}>您暂未上传任何文件</p>
              </div>
            }
          </div>
        </div>
        <Modal
        title="异常数据"
        visible={this.state.abnormalTk}
        maskClosable={false}
        footer={null}
        width={1200}
        onCancel={() => this.setState({abnormalTk: false})}
        >
          <Table
          dataSource={abnormalData}
          columns={columns}
          scroll={{y: 500}}
          pagination={false}
          ></Table>
          <div style={{padding: '36px 0', textAlign: 'right'}} className='flex center'>
            <span className='item' style={{textAlign: 'left'}}>存在 <b style={{color: '#FE2150'}}>{failClientCount}</b> 个异常客户信息</span>
            <span style={{marginRight: 20}}>下载异常数据， 修改后导入</span>
            <Button style={{width: 88}} size="large" onClick={this.doloadFail}>下载</Button>
          </div>
        </Modal>
      </div>
    )
  }
}

export default BulkImport
