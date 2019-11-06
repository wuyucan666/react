import React, { Component } from "react"
import { connect } from "dva"
import SelectCar from "pages/boss-store/member-center/components/select-car"
import SelectStaff from "pages/boss-store/member-center/components/select-staff"

interface Props {
  dispatch: (any) => any,
  selectStaff: any[]
  memberId: string
  selectCar: any[]
  member: any
}

/**选择绑定车辆和分成员工 */
export default connect(({ extendcard }) => extendcard)(
  class CarStaff extends Component<Props> {
    handleStaffChange(list) {
      this.props.dispatch({
        type: "extendcard/setSelectStaff",
        payload: list,
      })
    }
    handleCarChange(list) {
      this.props.dispatch({
        type: "extendcard/setSelectCar",
        payload: list,
      })
    }
    render() {
      const { memberId, selectCar, member } = this.props
      return (
        <div style={{ width: "100%" }}>
          <div style={{ padding: 32 }}>
            <h3
              style={{
                fontSize: 16,
                margin: 0,
                lineHeight: 1,
              }}
            >
              绑定车辆
            </h3>
            <SelectCar
              id={memberId}
              member={member}
              selected={selectCar}
              onChange={this.handleCarChange.bind(this)}
            />
            <h3
              style={{
                fontSize: 16,
                margin: "30px 0 0",
                lineHeight: 1,
              }}
            >
              分成人员
            </h3>
            <SelectStaff
              selected={this.props.selectStaff}
              onChange={this.handleStaffChange.bind(this)}
            />
          </div>
        </div>
      )
    }
  }
)
