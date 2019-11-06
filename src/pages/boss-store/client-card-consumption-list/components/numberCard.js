/**
 * @file 计次卡消耗列表
 */

import React, { PureComponent } from "react"
import withRouter from "umi/withRouter"
import { connect } from "dva"
import CommonTable from "components/CommonTable"
import tableConfig from "./numberCardTableConfig"
import services from "services"

export default withRouter(
  connect()(
    class UpCardConsumptionList extends PureComponent {
      constructor(props) {
        super(props)
        services.list({ keys: { name: "store/records" } }).then((res) => {
          tableConfig.screen.rules[2].list = res.list.map((_) => ({
            value: _.recordsId,
            name: _.cardName,
          }))
        })
        tableConfig.headers[1].render = (ret) => (
          <a
            style={{ color: "#4AACF7" }}
            onClick={() => {
              props.dispatch({
                type: "maintianList/goDetail",
                payload: {
                  orderId: ret.orderNo,
                  orderType: ret.orderType,
                  path: props.match.path,
                  isHideDetailBtns: true,
                },
              })
              props.history.push("/boss-store/maintain-list/orderAll")
            }}
          >
            {ret.orderNo}
          </a>
        )
      }
      render() {
        return (
          <div>
            <CommonTable
              name="wide-client/records/consume"
              tableConfig={{ ...tableConfig }}
            />
          </div>
        )
      }
    }
  )
)
