/**
 * 树形业务组件
 * 2018-8-20
 * 李冯
 */

import { Component } from "react"
import { connect } from "dva"
import Tree from "./tree"
import Create from "./create"
import treeConfig from "utils/tree"
import { Modal } from "antd"
import './index.less'
class tree extends Component {
  constructor(props) {
    super(props)

    const config = treeConfig[props.type]

    if (config) {
      this.props.dispatch({
        type: config.type + "/getTreeData",
      })
    }

    this.state = {
      pid: 0,
      title: "",
      remark: "",
      categorySort: 0,
      createOkText: false,
      level: undefined, // 维修类型列表需要的级别
      formTem: 0,
      config,
    }
  }

  /**
   * 创建完之后重置表单
   */
  handleCreated() {
    this.setState({
      id: 0,
      pid: 0,
      title: "",
      remark: "",
      categorySort: 0,
      createOkText: false,
      level: undefined,
    })
  }

  render() {
    const config = this.state.config

    if (!config) return <div>缺少配置</div>

    const { loaded, treeData } = this.props.state[config.type]

    return (
      <div style={{ padding: 32 }}>
        <Tree
          treeData={treeData}
          loaded={loaded}
          id={config.id}
          addTitle={config.addTitle}
          isRegional={this.props.isRegional}
          isProduct={this.props.isProduct}
          isProject={this.props.isProject}
          isMaintenance={this.props.isMaintenance}
          pageType={this.props.type}
          type={config.type}
          hideBtn
          onHideBtn={(id) => {
            this.props.dispatch({
              type: config.type + "/setTreeNode",
              payload: {
                areaId: id,
                showBtn: false,
              },
            })
          }}
          onShowBtn={(id) => {
            this.props.dispatch({
              type: config.type + "/setTreeNode",
              payload: {
                areaId: id,
                showBtn: true,
              },
            })
          }}
          add={(pid, level, quantity) => {
            if(quantity){
              Modal.info({
                title: '提示',
                className: 'infoModal',
                width: 450,
                content: (
                  <div>
                    <p style={{color: '#333'}}>该分类下包含服务，不可以新建子分类</p>
                    <p>将该分类下的服务转移到其他分类后，可以新建子分类。</p>
                  </div>
                ),
                onOk() {},
              })
            }else {
              this.setState({
                pid,
                title: "",
                remark: "",
                categorySort: 0,
                level,
              })
              this.props.dispatch({
                type: config.type + "/setShowCreate",
                payload: true,
              })
            }
          }}
          del={(id) => {
            let that = this
            Modal.confirm({
              title: '您确定要删除吗?',
              content: '',
              okText: '确认',
              cancelText: '取消',
              icon:<div style={{width:'37px',height:'37px',background:'#FF303D',borderRadius:'50%',textAlign:'center',lineHeight:'37px',marginLeft:'177px',marginBottom:'10px'}}><i className='iconfont icon-shanchu' style={{color:'#fff'}}/></div>,
              closable: true,
              centered: true,
              maskClosable: true,
              maskStyle:{
                background:'rgba(0,0,0,0.65)',
              },
              className:'madalDiv',
              onOk () {
                that.props.dispatch({
                  type: config.type + "/del",
                  payload: { id, cb: (f) => f(that.props.dispatch) },
                })
              },
            })
          }}
          edit={(opts) => {
            this.setState({
              id: opts[config.id],
              pid: opts.pId,
              title: opts.title,
              remark: opts.remark,
              level: opts.level,
              formTem: opts.formTem,
              categorySort:
                opts.categorySort === "" ? 0 : Number(opts.categorySort),
            })

            this.props.dispatch({
              type: config.type + "/setShowCreate",
              payload: true,
            })
          }}
        />
        {/* {this.state.pid > -1 ?  : ''} */}
        <Create
          createOkText={this.state.createOkText}
          setOkText={(text) => this.setState({ createOkText: text })}
          isProject={this.props.isProject}
          isProduct={this.props.isProduct}
          remark={this.state.remark}
          categorySort={this.state.categorySort}
          isRegional={this.props.isRegional}
          type={this.props.type}
          pid={this.state.pid}
          itemId={this.state.id}
          title={this.state.title}
          level={this.state.level}
          formTem={this.state.formTem}
          onCreated={this.handleCreated}
        />
      </div>
    )
  }
}

export default connect((state) => ({ state }))(tree)
