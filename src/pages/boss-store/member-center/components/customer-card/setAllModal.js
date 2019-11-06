import React, { Component } from "react"
import { Modal, Select, Input } from "antd"
import styles from "./index.less"
import units from "./units"

const Option = Select.Option

export default class SetAllModal extends Component {
  state = {
    allEditForm: {
      deadlineUnit: 1, // 单位
      neverValid: 0, // 是否永久
      deadlineNum: 0, // 值
    },
    units,
  }
  render() {
    return (
      <div>
        <Modal
          title="批量设置"
          visible={this.props.show}
          okButtonProps={{ size: "large" }}
          cancelButtonProps={{ size: "large" }}
          onCancel={this.props.onCancel}
          onOk={() => this.props.onOk(this.state.allEditForm)}
          width={570}
        >
          <div className={styles.modalContent}>
            <Select
              defaultValue={this.state.allEditForm.neverValid}
              onChange={(value) =>
                this.setState({
                  allEditForm: {
                    ...this.state.allEditForm,
                    neverValid: value,
                  },
                })
              }
              size="large"
            >
              <Option key={0} value={0}>
                有限期
              </Option>
              <Option key={1} value={1}>
                无限期
              </Option>
            </Select>
            <Input
              style={{ width: 152 }}
              disabled={this.state.allEditForm.neverValid === 1}
              size="large"
              type="text"
              value={this.state.allEditForm.deadlineNum}
              onChange={(e) => {
                let num = parseInt(e.target.value.match(/[1-9][0-9]*/), 10)
                num = isNaN(num) ? 0 : num
                // 单位为年时，限制输入20最大
                if (this.state.allEditForm.deadlineUnit === 1) {
                  num = num > 20 ? 20 : num
                }
                this.setState({
                  allEditForm: {
                    ...this.state.allEditForm,
                    deadlineNum: num,
                  },
                })
              }}
            />
            <Select
              defaultValue={this.state.allEditForm.deadlineUnit}
              disabled={this.state.allEditForm.neverValid === 1}
              onChange={(value) =>
                this.setState({
                  allEditForm: {
                    ...this.state.allEditForm,
                    deadlineUnit: value,
                  },
                })
              }
              size="large"
            >
              {this.state.units.map((_, index) => (
                <Option key={index} value={_.value}>
                  {_.name}
                </Option>
              ))}
            </Select>
          </div>
        </Modal>
      </div>
    )
  }
}
