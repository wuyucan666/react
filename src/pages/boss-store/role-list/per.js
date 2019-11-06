/**
 * 分配权限
 * 2018-8-27
 * 李冯
 */

import { Component } from "react"
import { Modal, Tree, Spin } from "antd"
import { connect } from "dva"

// import {} from 'antd'
//
const mapProps = ({
  "store/roleList": {
    perModalStatus,
    permission,
    btnLoading,
    defaultCheckedKeys,
    loading,
    selectPermession,
  },
}) => ({
  perModalStatus,
  permission,
  btnLoading,
  defaultCheckedKeys,
  loading,
  selectPermession,
})

export default connect(mapProps)(
  class Per extends Component {
    state = {
      selectPermession: [],
    }

    constructor(props) {
      super(props)
      this.state = {
        selectPermession: props.selectPermession,
      }
    }

    componentDidMount() {
      this.props.dispatch({
        type: "store/roleList/getPermission",
        payload: this.props.roleId,
      })
    }

    UNSAFE_componentWillReceiveProps(props) {
      this.setState({
        selectPermession: props.selectPermession,
      })
    }

    render() {
      const { TreeNode } = Tree

      const loop = (data) =>
        data.map((_) => {
          if (_.children && _.children.length) {
            return (
              <TreeNode disabled={_.disabled} key={_.perId} title={_.perName}>
                {loop(_.children)}
              </TreeNode>
            )
          } else {
            return (
              <TreeNode disabled={_.disabled} key={_.perId} title={_.perName} />
            )
          }
        })

      return (
        <div>
          <Modal
            okText="确认"
            cancelText="取消"
            width={580}
            confirmLoading={this.props.btnLoading}
            defaultCheckedKeys={this.props.defaultCheckedKeys}
            okButtonProps={{
              disabled: this.state.selectPermession.length === 0,
            }}
            onCancel={() =>
              this.props.dispatch({
                type: "store/roleList/setPerModalStatus",
                payload: false,
              })
            }
            onOk={() => {
              this.props.dispatch({
                type: "store/roleList/setPer",
                payload: {
                  perId: this.state.selectPermession,
                  roleId: this.props.roleId,
                },
              })
            }}
            title="分配权限"
            visible={true}
          >
            <Spin spinning={this.props.loading}>
              {!this.props.loading ? (
                <Tree
                  checkable
                  defaultCheckedKeys={this.props.selectPermession}
                  onCheck={(permessions) =>
                    this.setState({ selectPermession: permessions })
                  }
                >
                  {loop(this.props.permission)}
                </Tree>
              ) : (
                ""
              )}
            </Spin>
          </Modal>
        </div>
      )
    }
  }
)
