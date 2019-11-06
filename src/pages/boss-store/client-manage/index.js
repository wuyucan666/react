import React, { Component } from "react"
import CommonTable from "../../../components/CommonTable/index"
import services from '../../../services/index'
import { connect } from "dva"
import Add from "./components/Add"
import Edit from '../maintain-list/customerInfor'
import BulkImport from './components/BulkImport'
import tableConfig from "./tableConfig"
import Introduce from 'components/IntroduceModal'
import tip1 from './images/tip1.png'
import tip2 from './images/tip2.png'
import { Modal } from 'antd'

class client extends Component {
  state = {
    showAdd: false,
    showEdit: false,
    showImport: false,
    clientId: '',
    showDetail:false,
  }
  componentDidMount() {
    let o = this.props.location.state
    // console.log(o)
    if (o) {
      this.setState({ ...o })
    }
  }
  showAdd = () => {
    this.setState({
      showAdd: true,
    })
  }
  hideAdd = (phoneTem) => {
    this.setState({
      showAdd: false,
    })
    let stateObj = this.props.location.state || {}
    // console.log('phoneTem',phoneTem,'stateObj',stateObj)
    //如果是其他页面跳进了的话触发这里
    if (stateObj.showAdd||this.state.wyc_showAdd) {
      //跳回办卡页面，dai
      if (phoneTem && typeof (phoneTem) === 'string') {
        this.props.history.push({
          pathname: stateObj.currentpath || this.state.currentpath,
          state: {
            phoneTem: phoneTem,
          },
        })
      } else {
        this.props.history.push(`${stateObj.currentpath || this.state.currentpath}`)
      }

    }else{
      this.props.dispatch({
        type:'table/getData',
        payload:{new:false},
      })
    }
  }

  popup = (obj) =>{
    let _this = this
    if(obj.isOk){
      Modal.confirm({
        title: obj.title,
        content: '',
        okText: '确认',
        cancelText: '取消',
        icon: (
          <p className="iconfont icon-tishi" style={{ color: '#FF303D',fontSize: '48px', margin: '0', textAlign: 'center'}} ></p>
        ),
        centered: true,
        maskClosable: true,
        maskStyle: {
          background: 'rgba(0,0,0,0.65)',
        },
        className: 'madalDiv az_close',
        onOk() {
          services.DELETE({
            keys: {name: 'store/client/cancel', id: obj.item.clientId},
          }).then(res=>{
            // console.log('resss',res)
              const { dispatch } = _this.props
              if (res.code === '0') {
                dispatch({
                  type: 'table/getData',
                  payload: '',
                })
              }
          })
        },
      })
    }else {
      Modal.info({
        title: obj.title,
        okText: '好的',
        maskClosable: true,
        maskStyle: {
          background: 'rgba(0,0,0,0.65)',
        },
        closable:true,
        icon: ( <p className="iconfont icon-tishi" style={{ color: '#FF303D',fontSize: '48px', margin: '0', textAlign: 'center'}} ></p> ),
        onOk() {},
        className: 'madalDiv az_remove_button_margin az_close',
      })
    }
  }
  updateDetail = () => {
    const { editItem } = this.state
    this.getDetail(editItem.clientId)
  }
  showEdit = (clientId) => {
    this.setState({
      showEdit: true,
      clientId,
    })
  }
  hideEdit = () => {
    this.setState({
      showEdit: false,
    })
    this.props.dispatch({
      type:'table/getData',
      payload:{new:false},
    })
  }
  // showDetail = (clientId) => {
  //   this.setState({
  //     showDetail: true,
  //     clientId,
  //   })
  // }
  // hideDetail = () => {
  //   this.setState({
  //     showDetail: false,
  //   })
  // }

  onTableChange(e, item) {
    // console.log('eeeee',e,item)
    switch (e) {
      case 217:
        this.showAdd()
        break
      case 219:
        this.setState({ showImport: true })
        break
      case 14:
        const { clientId } = item
        this.showEdit(clientId)
        break
      case 19:
        services.DETAIL({
          keys: {name: 'store/client/cancel', id: item.clientId},
          method:'get',
        }).then(res=>{
          if(res.statusCode === '0'){
            this.popup({ title:'确定要注销该客户吗？', isOk: true, item })
          }else if(res.statusCode === 10213){
            this.popup({ title:'该客户有欠款,不能注销', isOk: false })
          }else if(res.statusCode === 10214){
            this.popup({ title:'该客户计次卡有剩余次数,不能注销', isOk: false })
          }else if(res.statusCode === 10215){
            this.popup({ title:'该客户充值卡有余额,不能注销', isOk: false })
          }
        })
        break
      default:
    }
  }
  goBack = () => {
    this.setState({ showImport: false })
  }
  render() {
    const { clientId, showAdd, showEdit, showImport } = this.state
    return (
      <div>
        {showAdd && <Add
          type='add'
          editItem={{}}
          onCancel={this.hideAdd}
          onUpdate={this.updateDetail}
        />}
        {/* {
          showImport &&
          <BulkImport
          goBack={this.goBack}
          ></BulkImport>
        } */}
        {showEdit && <Edit
          clientId={clientId}
          goBack={this.hideEdit}
          isRequsetList={true}
        />}
        {
          showImport && <BulkImport
            goBack={this.goBack}
          />
        }
        <div style={{ display: showAdd || showEdit || showImport ? 'none' : '' }}><CommonTable
          name="store/clients"
          search="licenseNo,clientName,phoneTem,licenseNo"
          tableConfig={tableConfig}
          onTableChange={this.onTableChange.bind(this)}
        /></div>
        {
          showImport && (
            <Introduce
              title='如何批量导入客户'
              content={
                [
                  {
                    title: <div>点击 <span style={{color: '#4AACF7'}}>【下载表格】</span> ，下载会员导入模板，输入客户信息、会员卡信息、车辆信息后（均为必填）保存</div>,
                    content: <img src={tip1} alt=""/>,
                  },
                  {
                    title: <div>点击 <span style={{color: '#4AACF7'}}>【上传文件】 </span>选择整理后的会员导入模板上传,上传后可查看导入时间，导入正常数据条数（已成功导入），查看导入异常客户数据导入异常客户数据重新整理后再次上传即可完成该部分客户数据导入</div>,
                    content: <img src={tip2} alt=""/>,
                  },
                ]
              }
            />
          )
        }
      </div>
    )
  }
}

export default connect()(client)
