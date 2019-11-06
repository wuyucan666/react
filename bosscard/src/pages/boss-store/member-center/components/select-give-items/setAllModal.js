import React, { Component } from "react"
import { Modal, Select, DatePicker } from "antd"
import styles from "./index.less"
import units from "./units"
import moment from "moment"

const Option = Select.Option

export default class SetAllModal extends Component {
  state = {
    allEditForm: {
      deadlineStatus: 1,
      deadlineTime: moment().add(1, "year"),
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
              value={this.state.allEditForm.deadlineStatus}
              onChange={(value) =>
                this.setState({
                  allEditForm: {
                    ...this.state.allEditForm,
                    deadlineStatus: value,
                  },
                })
              }
              size="large"
            >
              <Option key={1} value={1}>
                有限期
              </Option>
              <Option key={0} value={0}>
                无限期
              </Option>
            </Select>
            <DatePicker
              size="large"
              disabled={!this.state.allEditForm.deadlineStatus}
              value={this.state.allEditForm.deadlineTime}
              onChange={(value) =>
                this.setState({
                  allEditForm: {
                    ...this.state.allEditForm,
                    deadlineTime: value,
                  },
                })
              }
            />
          </div>
        </Modal>
      </div>
    )
  }
}
