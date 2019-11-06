import { Component } from "react"
import { Table } from "antd"

class StaffPlan extends Component {
  state = {
    pay: [
      {
        title: "员工",
        dataIndex: "staffName",
        key: "staffName",
        width: 70,
      },
      {
        title: "总业绩目标",
        dataIndex: "planOutput",
        key: "planOutput",
      },
      {
        title: "完成",
        dataIndex: "completeOutput",
        key: "completeOutput",
        width: 55,
      },
      {
        title: "进度",
        dataIndex: "progress",
        key: "progress",
        width: 55,
      },
      {
        title: "",
        dataIndex: "planId",
        render: () => <div className='iconfont icon-xiangqing'></div>,
        key: "planId",
        width: 40,
      },
    ],
  }
  componentDidMount() {
  }
  godetails = (record, key) => {
    const { lookStaff } = this.props
    lookStaff(record.staffId, key)
  }
  render() {
    const { pay } = this.state
    const { staffPlan, currentStaffState } = this.props
    const getrowClassName = (record, index) => {
      return index === currentStaffState ? 'planCurrentState' : ''
    }
    return (
      <div className='planTable'>
        <Table
          columns={pay}
          dataSource={staffPlan}
          size="middle"
          pagination={false}
          rowClassName={getrowClassName}
          onRow={(record, rowkey) => {
            return {
              onClick: this.godetails.bind(this, record, rowkey),
            }
          }}
        />
      </div>
    )
  }
}

export default StaffPlan
