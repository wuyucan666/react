import React, { Component } from "react"
import CommonTable from "components/CommonTable/index"
import tableConfig from './tableConfig'
import CheckCar from '../maintain-list/checkCar/index'
import styles from "./styles.less"
console.log(styles,'----')
class Index extends Component {
    constructor() {
      super()
      this.state = {
        tableConfig,
        visible: false,
        CheckCarId:null,
      }
    }

    showReport = (visible,CheckCarId) => {
      console.log(visible,CheckCarId)
      this.setState({
        visible,
        CheckCarId,
      })
    }
    render(){
      const { tableConfig, visible, CheckCarId } = this.state
      let len = tableConfig.headers.length

      tableConfig.headers[len-1].render = (
        (record) => (
          <div className={styles.wyc_list_btn} >
            <div onClick={this.showReport.bind(this,true, record.orderId)} className={styles.wyc_d_btn}> 查看报告 </div>
          </div>
        )
      )

      return (
        <div>
          <CommonTable
            name="maintain/inspectionReport"
            tableConfig={tableConfig}
            New
          />
          {visible&&<CheckCar
            visible={ visible  }
            changeMast= { this.showReport }
            orderId = { CheckCarId }
          />}
        </div>
      )
    }
}

export default Index
