import { Component } from "react"
import style from "./styles.less"
import { InputNumber, Button, message } from "antd"
import services from "services"

export default class superPay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      money: 0,
    }
  }
  UNSAFE_componentWillMount() {
    const { money } = this.props
    this.setState({
      money,
    })
  }
  changeMoney = val => {
    if (Object.prototype.toString.call(val).slice(8, -1) === "String") return
    this.setState({
      money: val,
    })
  }
  submit = () => {
    const { cardId, clientId, showSuper, getData } = this.props
    const { money } = this.state
    let obj = {
      cardId,
      clientId,
      Recharge: money,
      type: 2,
    }
    services
      .superPrivilege({
        keys: { name: "store/superPrivilege" },
        data: { ...obj },
      })
      .then(res => {
        if (res.success) {
          message.success("保存成功")
          showSuper(-1)
          getData(true)
        } else {
          message.info(res.message)
        }
      })
  }
  render() {
    const { showSuper } = this.props
    const { money } = this.state
    return (
      <div style={{ paddingBottom: "40px" }}>
        <div className={style.zl_money}>
          <div className={style.zl_money_content}>
            <div className={style.zl_moneyContent}>余额</div>
            <InputNumber
              step={0.1}
              onChange={this.changeMoney}
              min={0}
              max={999999}
              size="large"
              style={{
                marginLeft: "65px",
                width: "136px",
                transform: "translateY(18%)",
                lineHeight: "46px",
                border: "0 none",
                color: "#000",
                fontSize: "36px",
                fontWeight: "bold",
              }}
              value={money ? money : 0}
            />
          </div>
        </div>
        <div className={style.zl_buttons}>
          <Button
            onClick={this.submit}
            style={{ position: "absolute", bottom: "0", right: "0" }}
            size="large"
            type="primary"
          >
            确定
          </Button>
          <Button
            onClick={() => showSuper(-1)}
            style={{ position: "absolute", bottom: "0", right: "93px" }}
            size="large"
            type="default"
          >
            取消
          </Button>
        </div>
      </div>
    )
  }
}
